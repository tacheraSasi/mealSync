import { Router } from "express";
import {
  getAllMealTemplatesController,
  getMealTemplateByIdController,
  createMealTemplateController,
  updateMealTemplateController,
  deleteMealTemplateController,
  getMealTemplatesByCategoryController,
} from "./mealTemplate.controller";

const mealTemplateRouter = Router();

// Get all meal templates
mealTemplateRouter.get("/", getAllMealTemplatesController);

// Get meal templates by category
mealTemplateRouter.get("/category/:category", getMealTemplatesByCategoryController);

// Get meal template by ID
mealTemplateRouter.get("/:id", getMealTemplateByIdController);

// Create new meal template
mealTemplateRouter.post("/", createMealTemplateController);

// Update meal template
mealTemplateRouter.put("/:id", updateMealTemplateController);

// Delete meal template (soft delete)
mealTemplateRouter.delete("/:id", deleteMealTemplateController);

export default mealTemplateRouter;
