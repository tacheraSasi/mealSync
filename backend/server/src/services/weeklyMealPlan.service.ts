import { Repository } from "typeorm";
import { AppDataSource } from "../utils/data-source";
import { WeeklyMealPlan } from "../entities/WeeklyMealPlan";
import { User } from "../entities/User";
import { MealTemplate } from "../entities/MealTemplate";
import { format, startOfWeek, addDays } from "date-fns";
import * as XLSX from 'xlsx';

// Cache repository instances for better performance
let cachedWeeklyMealPlanRepository: Repository<WeeklyMealPlan> | null = null;
let cachedUserRepository: Repository<User> | null = null;
let cachedMealTemplateRepository: Repository<MealTemplate> | null = null;

const weeklyMealPlanRepository = (): Repository<WeeklyMealPlan> => {
  if (!cachedWeeklyMealPlanRepository) {
    cachedWeeklyMealPlanRepository = AppDataSource.getRepository(WeeklyMealPlan);
  }
  return cachedWeeklyMealPlanRepository;
};

const userRepository = (): Repository<User> => {
  if (!cachedUserRepository) {
    cachedUserRepository = AppDataSource.getRepository(User);
  }
  return cachedUserRepository;
};

const mealTemplateRepository = (): Repository<MealTemplate> => {
  if (!cachedMealTemplateRepository) {
    cachedMealTemplateRepository = AppDataSource.getRepository(MealTemplate);
  }
  return cachedMealTemplateRepository;
};

interface WeeklyMealPlanResult {
  id: number;
  userId: number;
  username: string;
  mealTemplateId: number;
  mealName: string;
  weekStartDate: string;
  dayOfWeek: string;
  status: string;
  selectedAt: Date;
}

export interface ServiceResponse<T> {
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

// Helper function to get the next Monday's date in YYYY-MM-DD format
const getNextWeekStartDate = (): string => {
  const today = new Date();
  const nextMonday = startOfWeek(addDays(today, 7), { weekStartsOn: 1 }); // 1 = Monday
  return format(nextMonday, "yyyy-MM-dd");
};

// Helper function to check if today is Friday
const isTodayFriday = (): boolean => {
  // return isFriday(new Date());
  return true
}; 

interface WeeklyMealSelectionInput {
  userId: number;
  weeklySelections: {
    monday?: number;
    tuesday?: number;
    wednesday?: number;
    thursday?: number;
    friday?: number;
  };
}

async function getAllWeeklyMealPlans(weekStartDate?: string): Promise<ServiceResponse<WeeklyMealPlanResult[]>> {
  try {
    const targetWeek = weekStartDate || getNextWeekStartDate();
    
    const plans = await weeklyMealPlanRepository().find({
      where: { weekStartDate: targetWeek },
      order: { dayOfWeek: "ASC", username: "ASC" },
    });

    return { status: "success", result: plans };
  } catch (error: unknown) {
    return { 
      status: "error", 
      error: handleError(error, "Failed to fetch weekly meal plans") 
    };
  }
}

async function getUserWeeklyMealPlan(
  userId: number, 
  weekStartDate?: string
): Promise<ServiceResponse<WeeklyMealPlanResult[]>> {
  try {
    const targetWeek = weekStartDate || getNextWeekStartDate();
    
    const plans = await weeklyMealPlanRepository().find({
      where: { 
        userId, 
        weekStartDate: targetWeek 
      },
      order: { dayOfWeek: "ASC" },
    });

    return { status: "success", result: plans };
  } catch (error: unknown) {
    return { 
      status: "error", 
      error: handleError(error, "Failed to fetch user weekly meal plan") 
    };
  }
}

async function createWeeklyMealSelection({
  userId,
  weeklySelections,
}: WeeklyMealSelectionInput): Promise<ServiceResponse<WeeklyMealPlanResult[]>> {
  try {
    // Check if today is Friday (meal planning day)
    if (!isTodayFriday()) {
      return {
        status: "error",
        error: "Weekly meal planning is only available on Fridays!",
      };
    }

    const nextWeekStart = getNextWeekStartDate();
    
    // Get user and validate
    const user = await userRepository().findOneBy({ id: userId });
    if (!user) {
      return { status: "error", error: "User not found" };
    }

    // Clear existing selections for next week
    await weeklyMealPlanRepository().delete({
      userId,
      weekStartDate: nextWeekStart,
    });

    const createdPlans: WeeklyMealPlan[] = [];
    const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"];

    for (const day of daysOfWeek) {
      const mealTemplateId = weeklySelections[day as keyof typeof weeklySelections];
      
      if (mealTemplateId) {
        // Validate meal template exists
        const mealTemplate = await mealTemplateRepository().findOneBy({ 
          id: mealTemplateId, 
          isActive: true 
        });
        
        if (!mealTemplate) {
          return { 
            status: "error", 
            error: `Meal template not found for ${day}` 
          };
        }

        const weeklyPlan = weeklyMealPlanRepository().create({
          userId: user.id,
          username: user.username,
          mealTemplateId: mealTemplate.id,
          mealName: mealTemplate.name,
          weekStartDate: nextWeekStart,
          dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1), // Capitalize
          status: "pending",
          user,
          mealTemplate,
        });

        const savedPlan = await weeklyMealPlanRepository().save(weeklyPlan);
        createdPlans.push(savedPlan);
      }
    }

    return {
      status: "created",
      result: createdPlans,
    };
  } catch (error: unknown) {
    return { 
      status: "creation failed", 
      error: handleError(error, "Failed to create weekly meal selection") 
    };
  }
}

async function updateWeeklyMealPlanStatus(
  id: number, 
  status: string
): Promise<ServiceResponse<WeeklyMealPlanResult>> {
  try {
    const plan = await weeklyMealPlanRepository().findOneBy({ id });
    if (!plan) {
      return { status: "error", error: "Weekly meal plan not found" };
    }

    plan.status = status;
    await weeklyMealPlanRepository().save(plan);

    return {
      status: "updated",
      result: plan,
    };
  } catch (error: unknown) {
    return { 
      status: "error", 
      error: handleError(error, "Failed to update meal plan status") 
    };
  }
}

async function deleteWeeklyMealPlan(id: number): Promise<ServiceResponse<WeeklyMealPlanResult>> {
  try {
    const plan = await weeklyMealPlanRepository().findOneBy({ id });
    if (!plan) {
      return { status: "error", error: "Weekly meal plan not found" };
    }

    await weeklyMealPlanRepository().remove(plan);

    return {
      status: "success",
      result: plan,
    };
  } catch (error: unknown) {
    return { 
      status: "error", 
      error: handleError(error, "Failed to delete weekly meal plan") 
    };
  }
}

// Get weekly summary for admin
async function getWeeklySummary(weekStartDate?: string): Promise<ServiceResponse<any>> {
  try {
    const targetWeek = weekStartDate || getNextWeekStartDate();
    
    const summary = await weeklyMealPlanRepository()
      .createQueryBuilder("plan")
      .select("plan.dayOfWeek", "dayOfWeek")
      .addSelect("plan.mealName", "mealName")
      .addSelect("COUNT(plan.id)", "count")
      .where("plan.weekStartDate = :weekStartDate", { weekStartDate: targetWeek })
      .groupBy("plan.dayOfWeek, plan.mealName")
      .orderBy("plan.dayOfWeek", "ASC")
      .addOrderBy("COUNT(plan.id)", "DESC")
      .getRawMany();

    return { status: "success", result: summary };
  } catch (error: unknown) {
    return { 
      status: "error", 
      error: handleError(error, "Failed to fetch weekly summary") 
    };
  }
}

// Export weekly meal plans to Excel
async function exportWeeklyMealPlansToExcel(weekStartDate?: string): Promise<ServiceResponse<Buffer>> {
  try {
    const targetWeek = weekStartDate || getNextWeekStartDate();
    
    const plans = await weeklyMealPlanRepository().find({
      where: { weekStartDate: targetWeek },
      order: { username: "ASC", dayOfWeek: "ASC" },
    });

    // Group data by user and day
    const userData: Record<string, any> = {};
    
    plans.forEach(plan => {
      if (!userData[plan.username]) {
        userData[plan.username] = {
          Username: plan.username,
          Monday: '-',
          Tuesday: '-',
          Wednesday: '-',
          Thursday: '-',
          Friday: '-'
        };
      }
      userData[plan.username][plan.dayOfWeek] = plan.mealName;
    });

    const data = Object.values(userData);

    // Create worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Weekly Meal Plans');

    // Generate Excel buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    return { status: "success", result: excelBuffer };
  } catch (error: unknown) {
    return { 
      status: "error", 
      error: handleError(error, "Failed to export weekly meal plans") 
    };
  }
}

export { 
  getAllWeeklyMealPlans,
  getUserWeeklyMealPlan,
  createWeeklyMealSelection,
  updateWeeklyMealPlanStatus,
  deleteWeeklyMealPlan,
  getWeeklySummary,
  isTodayFriday,
  getNextWeekStartDate,
  exportWeeklyMealPlansToExcel
};
