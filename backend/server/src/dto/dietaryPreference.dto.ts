import { IsString, IsOptional, IsBoolean, IsNumber } from "class-validator";

export class CreateDietaryPreferenceDto {
  @IsNumber()
  userId!: number;

  @IsString()
  preference!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateDietaryPreferenceDto {
  @IsOptional()
  @IsString()
  preference?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}