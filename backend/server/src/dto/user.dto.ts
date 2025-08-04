import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsMobilePhone } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: "Username is required" })
  @IsString()
  username!: string;

  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @IsOptional()
  @IsMobilePhone(undefined, { strictMode: false }, { message: "Invalid phone number format" })
  phoneNumber?: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be at least 6 characters" })
  password!: string;
}

export class LoginUserDto {
  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  password!: string;
}

export class UserIdParamDto {
  @IsNotEmpty({ message: "User ID is required" })
  id!: number;
}
