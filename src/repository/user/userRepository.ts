import { User, BottleChoice } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { GroupRepository } from "@/repository/group/groupRepository";
import { RegisterRequest } from "@/types/auth/POST";
import { UpdateRequest } from "@/types/user/PATCH";
import { AppError } from "@/types/error/AppError";

export class UserRepository {
  private groupRepository: GroupRepository;

  constructor() {
    this.groupRepository = new GroupRepository();
  }

  async create(body: RegisterRequest): Promise<User> {
    const user = await prisma.user.create({
      data: {
        studentId: body.studentId,
        citizenId: body.citizenId,
        prefix: body.prefix,
        firstName: body.firstName,
        lastName: body.lastName,
        nickname: body.nickname,
        academicYear: body.academicYear,
        faculty: body.faculty,
        password: body.password,
        phoneNumber: body.phoneNumber,
        parentName: body.parentName,
        parentPhoneNumber: body.parentPhoneNumber,
        parentRelationship: body.parentRelationship,
        foodAllergy: body.foodAllergy || null,
        drugAllergy: body.drugAllergy || null,
        illness: body.illness || null,
        avatarId: Math.floor(Math.random() * 5) + 1,
        role: body.role,
      },
    });

    await this.groupRepository.createGroupForUser(user.id);

    return user;
  }

  async update(id: string, body: Partial<UpdateRequest>): Promise<User | null> {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: body,
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async getUserByCredentials(
    studentId: string,
    citizenId: string
  ): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        AND: [{ studentId: studentId }, { citizenId: citizenId }],
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async changePassword(id: string, newPassword: string): Promise<User | null> {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: newPassword,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async findExists(studentId: string, citizenId: string): Promise<boolean> {
    const userFromStudentId = await prisma.user.findFirst({
      where: {
        studentId: studentId,
      },
    });
    if (userFromStudentId) {
      return true;
    }
    const userFromCitizenId = await prisma.user.findFirst({
      where: {
        citizenId: citizenId,
      },
    });
    if (userFromCitizenId) {
      return true;
    }
    return false;
  }

  async updateBottleChoice(id: string, bottleChoice: BottleChoice): Promise<void> {
    try {
      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          bottleChoice,
        },
      });
    } catch (error) {
      console.error("Error updating bottle choice:", error);
      throw new AppError("Failed to update bottle choice", 404);
    }
  }
}
