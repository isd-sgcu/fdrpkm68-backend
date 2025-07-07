import { PrismaClient, User } from "@prisma/client";
import { RegisterRequest } from "@/types/auth/POST";

export class UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(body: RegisterRequest): Promise<User> {
    const user = await this.prisma.user.create({
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

    return user;
  }

  async findExists(studentId: string, citizenId: string): Promise<boolean> {
    const userFromStudentId = await this.prisma.user.findFirst({
      where: {
        studentId: studentId,
      },
    });
    if (userFromStudentId) {
      return true;
    }
    const userFromCitizenId = await this.prisma.user.findFirst({
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
