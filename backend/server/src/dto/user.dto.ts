import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsMobilePhone, IsBoolean, IsNumber } from "class-validator";

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

  @IsOptional()
  @IsNumber()
  departmentId?: number;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsBoolean()
  notificationsEnabled?: boolean;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: "Invalid email format" })
  email?: string;

  @IsOptional()
  @IsMobilePhone(undefined, { strictMode: false }, { message: "Invalid phone number format" })
  phoneNumber?: string;

  @IsOptional()
  @IsNumber()
  departmentId?: number;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsBoolean()
  notificationsEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
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
