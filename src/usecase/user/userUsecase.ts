import { UserRepository } from "@/repository/user/userRepository";
import { AuthUser } from "@/types/auth/authenticatedRequest";
import { AppError } from "@/types/error/AppError";
import { UpdateRequest } from "@/types/user/PATCH";
import { validatePhoneNumber } from "@/utils/validatePhoneNumber";

export class UserUsecase {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async get(authUser?: AuthUser) {
    // Guarantee that authUser is defined (from middleware)
    const user = await this.userRepository.getUserByCredentials(
      authUser!.studentId,
      authUser!.citizenId
    );
    const { password: _password, ...userWithoutPassword } = user!;

    return userWithoutPassword;
  }

  async update(id: string | undefined, body: UpdateRequest) {
    if (!id) {
      throw new AppError("Cannot retrieve Id from JWT", 500);
    }
    const filteredBody: Partial<UpdateRequest> = Object.fromEntries(
      Object.entries(body).filter(
        ([_, value]) => value !== null && value !== undefined
      )
    ) as Partial<UpdateRequest>;

    if (Object.keys(filteredBody).length === 0) {
      throw new AppError("No fields to update", 400);
    }

    if (this.validateUpdateRequest(filteredBody) === false) {
      throw new AppError("Invalid update request", 400);
    }

    this.userRepository.update(id, filteredBody);
  }

  private validateUpdateRequest(body: Partial<UpdateRequest>): boolean {
    if (body.phoneNumber && validatePhoneNumber(body.phoneNumber) === false) {
      return false;
    }
    if (
      body.parentPhoneNumber &&
      validatePhoneNumber(body.parentPhoneNumber) === false
    ) {
      return false;
    }
    const validPrefixes = ["MR", "MS", "MRS", "Other"];
    if (body.prefix && !validPrefixes.includes(body.prefix)) {
      return false;
    }

    return true;
  }
}
