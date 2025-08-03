import { Request, Response } from "express";
import {
  getAllMealTemplates,
  getMealTemplateById,
  createMealTemplate,
  updateMealTemplate,
  deleteMealTemplate,
  getMealTemplatesByCategory,
} from "../../services/mealTemplate.service";

export async function getAllMealTemplatesController(
  _req: Request,
  res: Response
): Promise<Response> {
  try {
    const result = await getAllMealTemplates();
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: message });
  }
}

export async function getMealTemplateByIdController(
  req: Request,
  res: Response
): Promise<Response> {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid meal template ID" });
  }

  try {
    const result = await getMealTemplateById(id);
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: message });
  }
}

export async function createMealTemplateController(
  req: Request,
  res: Response
): Promise<Response> {
  const { name, description, category, createdBy } = req.body;

  if (!name || !description || !category || !createdBy) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await createMealTemplate({
      name,
      description,
      category,
      createdBy,
    });
    return res.status(201).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: message });
  }
}

export async function updateMealTemplateController(
  req: Request,
  res: Response
): Promise<Response> {
  const id = Number(req.params.id);
  const updateData = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid meal template ID" });
  }

  try {
    const result = await updateMealTemplate(id, updateData);
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: message });
  }
}

export async function getMealTemplatesByCategoryController(
  req: Request,
  res: Response
): Promise<Response> {
  const { category } = req.params;

  if (!category || category.trim() === "") {
    return res.status(400).json({ error: "Category parameter is required" });
  }

  try {
    const result = await getMealTemplatesByCategory(category);
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: message });
  }
}

export async function deleteMealTemplateController(
  req: Request,
  res: Response
): Promise<Response> {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid meal template ID" });
  }

  try {
    const result = await deleteMealTemplate(id);
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: message });
  }
}
