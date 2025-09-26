import { IsString, IsOptional, IsNumber, Min, Max } from "class-validator";

export class CreateMealRatingDto {
  @IsNumber()
  userId!: number;

  @IsNumber()
  mealTemplateId!: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsString()
  mealDate!: string;
}

export class UpdateMealRatingDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  comment?: string;
}