import { AuthError } from "next-auth";

export class CustomAuthError extends AuthError {
  static type: string;

  constructor(message?: any) {
    super();

    this.type = message;
  }
}
export class InvalidEmailPasswordError extends AuthError {
  static type = "Email or Password sai  ";
}

export class InactiveAccountError extends AuthError {
  static type = "Tai khoan chua duoc kich hoat   ";
}
