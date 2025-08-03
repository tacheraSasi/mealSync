import { Repository } from "typeorm";
import { AppDataSource } from "../utils/data-source";
import { MealTemplate } from "../entities/MealTemplate";

// Cache repository instance for better performance
let cachedMealTemplateRepository: Repository<MealTemplate> | null = null;

const mealTemplateRepository = (): Repository<MealTemplate> => {
  if (!cachedMealTemplateRepository) {
    cachedMealTemplateRepository = AppDataSource.getRepository(MealTemplate);
  }
  return cachedMealTemplateRepository;
};

interface MealTemplateResult {
  id: number;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

interface ServiceResponse<T> {
  status: "success" | "error" | "created" | "creation failed" | "updated";
  result?: T;
  error?: string;
}

// Helper function for consistent error handling
const handleError = (error: unknown, fallbackMessage: string): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
};

interface CreateMealTemplateInput {
  name: string;
  description: string;
  category: string;
  createdBy: string;
}

async function getAllMealTemplates(): Promise<ServiceResponse<MealTemplateResult[]>> {
  try {
    const templates = await mealTemplateRepository().find({
      where: { isActive: true },
      order: { category: "ASC", name: "ASC" },
    });
    return { status: "success", result: templates };
  } catch (error: unknown) {
    return { 
      status: "error", 
      error: handleError(error, "Failed to fetch meal templates") 
    };
  }
}

async function getMealTemplateById(id: number): Promise<ServiceResponse<MealTemplateResult>> {
  try {
    const template = await mealTemplateRepository().findOne({
      where: { id, isActive: true },
    });
    if (!template) return { status: "error", error: "Meal template not found" };
    return { status: "success", result: template };
  } catch (error: unknown) {
    return { 
      status: "error", 
      error: handleError(error, "Failed to fetch meal template") 
    };
  }
}

async function createMealTemplate({
  name,
  description,
  category,
  createdBy,
}: CreateMealTemplateInput): Promise<ServiceResponse<MealTemplateResult>> {
  try {
    // Check if template with same name already exists
    const existingTemplate = await mealTemplateRepository().findOne({
      where: { name: name.trim() }
    });

    if (existingTemplate) {
      return {
        status: "creation failed",
        error: "Meal template with this name already exists.",
      };
    }

    const newTemplate = mealTemplateRepository().create({
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      createdBy,
      isActive: true,
    });

    await mealTemplateRepository().save(newTemplate);

    return {
      status: "created",
      result: newTemplate,
    };
  } catch (error: unknown) {
    return { 
      status: "creation failed", 
      error: handleError(error, "Meal template creation failed") 
    };
  }
}

async function updateMealTemplate(
  id: number,
  updateData: Partial<CreateMealTemplateInput>
): Promise<ServiceResponse<MealTemplateResult>> {
  try {
    const existingTemplate = await mealTemplateRepository().findOneBy({ id });
    if (!existingTemplate) {
      return { status: "error", error: "Meal template not found" };
    }

    // Update fields if provided
    if (updateData.name) existingTemplate.name = updateData.name.trim();
    if (updateData.description) existingTemplate.description = updateData.description.trim();
    if (updateData.category) existingTemplate.category = updateData.category.trim();

    await mealTemplateRepository().save(existingTemplate);

    return {
      status: "updated",
      result: existingTemplate,
    };
  } catch (error: unknown) {
    return { 
      status: "error", 
      error: handleError(error, "Failed to update meal template") 
    };
  }
}

async function deleteMealTemplate(id: number): Promise<ServiceResponse<MealTemplateResult>> {
  try {
    const existingTemplate = await mealTemplateRepository().findOneBy({ id });
    if (!existingTemplate) {
      return { status: "error", error: "Meal template not found" };
    }

    // Soft delete by setting isActive to false
    existingTemplate.isActive = false;
    await mealTemplateRepository().save(existingTemplate);

    return {
      status: "success",
      result: existingTemplate,
    };
  } catch (error: unknown) {
    return { 
      status: "error", 
      error: handleError(error, "Failed to delete meal template") 
    };
  }
}

async function getMealTemplatesByCategory(category: string): Promise<ServiceResponse<MealTemplateResult[]>> {
  try {
    const templates = await mealTemplateRepository().find({
      where: { category: category.trim(), isActive: true },
      order: { name: "ASC" },
    });
    return { status: "success", result: templates };
  } catch (error: unknown) {
    return { 
      status: "error", 
      error: handleError(error, "Failed to fetch meal templates by category") 
    };
  }
}

export { 
  getAllMealTemplates, 
  getMealTemplateById, 
  createMealTemplate, 
  updateMealTemplate, 
  deleteMealTemplate,
  getMealTemplatesByCategory 
};
