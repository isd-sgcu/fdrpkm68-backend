import { User } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { GroupRepository } from "@/repository/group/groupRepository";

import { RegisterRequest } from "@/types/auth/POST";

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
        role: body.role,
      },
    });

    // TODO: UNCOMMENT THIS WHEN GROUP FEATURE IS READY
    // This will create a group for the user after registration :)
    // await this.groupRepository.createGroupForUser(user.id);

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
}
