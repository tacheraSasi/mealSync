import { Request, Response } from "express";
import {
  getAllWeeklyMealPlans,
  getUserWeeklyMealPlan,
  createWeeklyMealSelection,
  updateWeeklyMealPlanStatus,
  deleteWeeklyMealPlan,
  getWeeklySummary,
  isTodayFriday,
  getNextWeekStartDate,
} from "../../services/weeklyMealPlan.service";

export async function getAllWeeklyMealPlansController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const weekStartDate = req.query.weekStartDate as string;
    const result = await getAllWeeklyMealPlans(weekStartDate);
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: message });
  }
}

export async function getUserWeeklyMealPlanController(
  req: Request,
  res: Response
): Promise<Response> {
  const userId = Number(req.params.userId);
  
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const weekStartDate = req.query.weekStartDate as string;
    const result = await getUserWeeklyMealPlan(userId, weekStartDate);
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: message });
  }
}

export async function createWeeklyMealSelectionController(
  req: Request,
  res: Response
): Promise<Response> {
  const { userId, weeklySelections } = req.body;

  if (!userId || !weeklySelections) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await createWeeklyMealSelection({
      userId,
      weeklySelections,
    });
    return res.status(201).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: message });
  }
}

export async function updateWeeklyMealPlanStatusController(
  req: Request,
  res: Response
): Promise<Response> {
  const id = Number(req.params.id);
  const { status } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid meal plan ID" });
  }

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  try {
    const result = await updateWeeklyMealPlanStatus(id, status);
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: message });
  }
}

export async function deleteWeeklyMealPlanController(
  req: Request,
  res: Response
): Promise<Response> {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid meal plan ID" });
  }

  try {
    const result = await deleteWeeklyMealPlan(id);
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: message });
  }
}

export async function getWeeklySummaryController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const weekStartDate = req.query.weekStartDate as string;
    const result = await getWeeklySummary(weekStartDate);
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: message });
  }
}

export async function getWeeklyPlanningInfoController(
  _req: Request,
  res: Response
): Promise<Response> {
  try {
    const info = {
      isFridayPlanningDay: isTodayFriday(),
      nextWeekStartDate: getNextWeekStartDate(),
      currentDay: new Date().toLocaleDateString("en-US", { weekday: "long" }),
      planningMessage: isTodayFriday() 
        ? "Today is Friday! You can plan your meals for next week." 
        : "Meal planning is only available on Fridays.",
    };
    
    return res.status(200).json({ status: "success", result: info });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: message });
  }
}
