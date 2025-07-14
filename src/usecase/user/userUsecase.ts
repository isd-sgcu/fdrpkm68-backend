import { UserRepository } from "@/repository/user/userRepository";
import { AuthUser } from "@/types/auth/authenticatedRequest";
import { AppError } from "@/types/error/AppError";
import { UpdateRequest, UpdateBottleChoiceRequest } from "@/types/user/PATCH";
import { validatePhoneNumber } from "@/utils/validatePhoneNumber";
import { RegisterRequest } from "@/types/auth/POST";
import { hashPassword } from "@/utils/password";

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

  async updateBottleChoice(id: string | undefined, body: UpdateBottleChoiceRequest): Promise<void> {
    if (!id) {
      throw new AppError("Cannot retrieve Id from JWT", 500);
    }
    if (this.validateUpdateBottleChoiceRequest(body) === false) {
      throw new AppError("Invalid update bottle choice request", 400);
    }

    await this.userRepository.updateBottleChoice(id, body.bottleChoice);
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

  async registerStaff(body: RegisterRequest) {
    if (this.validateRegisterRequest(body) === false) {
      throw new AppError("Invalid registration request", 400);
    }

    const existingStaff = await this.userRepository.findExistsStaff(
      body.studentId,
      body.citizenId
    );

    // there is no staff data in StaffData table
    if (!existingStaff) {
      throw new AppError("Staff data not found", 404);
    }

    const existingStaffInUsers = await this.userRepository.findExists(
      body.studentId,
      body.citizenId
    );
    
    //staff already exist in users table 
    //!!!! there is a case that staff registered via nong nong form (registered as a freshmen), 
    // then when register with /staff-register it causes error as they're already exist in users table. T^T
    if (existingStaffInUsers) {
      throw new AppError("Staff already exists in users table", 409);
    }

    body.password = await hashPassword(body.password);

    const user = await this.userRepository.registerStaff(body);
    if (!user) {
      throw new AppError("User registration failed", 500);
    }
    const { password:_, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

   private validateRegisterRequest(body: RegisterRequest): boolean {
    if (body.studentId.length !== 10 || body.citizenId.length !== 13) {
      return false;
    }
    if (!/^\d+$/.test(body.studentId) || !/^\d+$/.test(body.citizenId)) {
      return false;
    }
    if (
      !/[A-Z]/.test(body.password) ||
      !/[a-z]/.test(body.password) ||
      !/\d/.test(body.password) ||
      body.password.length < 8 ||
      body.password.length > 20
    ) {
      return false;
    }
    const validPrefixes = ["MR", "MS", "MRS", "Other"];
    if (!validPrefixes.includes(body.prefix)) {
      return false;
    }
    if (
      !validatePhoneNumber(body.phoneNumber) ||
      !validatePhoneNumber(body.parentPhoneNumber)
    ) {
      return false;
    }
    return true;
   }
   
  private validateUpdateBottleChoiceRequest(body: UpdateBottleChoiceRequest): boolean {
    if (!body.bottleChoice) {
      return false;
    }
    const validBottleChoices = ["A", "B", "C"];
    if (!validBottleChoices.includes(body.bottleChoice)) {
      return false;
    }

    return true;
  }
}
