import { AuthRepository } from "@/repository/auth/authRepository";
import { User } from "@prisma/client";
import { StudentLoginCredentials } from "@/types/auth/POST";

export class AuthUsecase {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async login(credentials: StudentLoginCredentials): Promise<{
    user: User;
    token: string;
  }> {
    try {
      const user = await this.authRepository.verifyCredentials(credentials);
      if (!user) {
        throw new Error("User not found");
      }

      const token = "HELLO";

      return {
        user,
        token,
      };
    } catch (error) {
      console.error("Login use case error:", error);
      throw new Error("Login failed");
    }
  }
}
