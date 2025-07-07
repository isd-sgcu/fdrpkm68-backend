export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
    };
    token: string;
  };
  timestamp: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
}

export interface StudentLoginCredentials {
  studentId: string;
  password: string;
}

export interface AuthToken {
  token: string;
  expiresAt: string;
  userId: string;
}
