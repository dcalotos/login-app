export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
  lastLogin?: Date;
  isActive?: boolean;
  isVerified?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  id: number;
  username: string;
  email: string;
}

export interface MessageResponse {
  message: string;
}
