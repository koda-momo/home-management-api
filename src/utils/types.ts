export interface ErrorResponse extends Error {
  statusCode: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Session {
  email: string;
  expires: number;
}

export interface LoginResponse {
  message: string;
}

export interface StatusResponse {
  authenticated: boolean;
  email?: string;
}
