import { Router } from "express";
import {
  getAllWeeklyMealPlansController,
  getUserWeeklyMealPlanController,
  createWeeklyMealSelectionController,
  updateWeeklyMealPlanStatusController,
  deleteWeeklyMealPlanController,
  getWeeklySummaryController,
  getWeeklyPlanningInfoController,
  exportWeeklyMealPlansController,
} from "./weeklyMealPlan.controller";

const weeklyMealPlanRouter = Router();

// Get planning info (is it Friday, next week date, etc.)
weeklyMealPlanRouter.get("/info", getWeeklyPlanningInfoController);

// Get all weekly meal plans (admin)
weeklyMealPlanRouter.get("/", getAllWeeklyMealPlansController);

// Get weekly summary for admin
weeklyMealPlanRouter.get("/summary", getWeeklySummaryController);

// Export weekly meal plans to Excel
weeklyMealPlanRouter.get("/export", exportWeeklyMealPlansController);

// Get user's weekly meal plan
weeklyMealPlanRouter.get("/user/:userId", getUserWeeklyMealPlanController);

// Create weekly meal selection (Friday only)
weeklyMealPlanRouter.post("/", createWeeklyMealSelectionController);

// Update meal plan status
weeklyMealPlanRouter.put("/:id/status", updateWeeklyMealPlanStatusController);

// Delete weekly meal plan
weeklyMealPlanRouter.delete("/:id", deleteWeeklyMealPlanController);

export default weeklyMealPlanRouter;
