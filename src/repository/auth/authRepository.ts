import { User } from "@prisma/client";
import { StudentLoginCredentials } from "@/types/auth/POST";
import { prisma } from "@/lib/prisma";

export class AuthRepository {
  async findUserByStudentId(studentId: string): Promise<User | null> {
    try {
      const user = await prisma.user.findFirst({
        where: { studentId },
      });

      if (!user) return null;

      return user;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Failed to find user");
    }
  }

  async verifyCredentials(
    credentials: StudentLoginCredentials
  ): Promise<User | null> {
    try {
      const user = await this.findUserByStudentId(credentials.studentId);

      if (!user) {
        return null;
      }

      const isPasswordValid = user.password === credentials.password;

      return isPasswordValid ? user : null;
    } catch (error) {
      console.error("Error verifying credentials:", error);
      throw new Error("Failed to verify credentials");
    }
  }
}
