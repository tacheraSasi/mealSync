import { IsString, IsOptional, IsBoolean, IsNumber, Min } from "class-validator";

export class CreateDepartmentDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  manager?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  mealBudget?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  manager?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  mealBudget?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}