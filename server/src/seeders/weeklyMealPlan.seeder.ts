import { AppDataSource } from "../utils/data-source";
import { WeeklyMealPlan } from "../entities/WeeklyMealPlan";
import { User } from "../entities/User";
import { MealTemplate } from "../entities/MealTemplate";

export async function seedWeeklyMealPlans() {
  const weeklyMealPlanRepository = AppDataSource.getRepository(WeeklyMealPlan);
  const userRepository = AppDataSource.getRepository(User);
  const mealTemplateRepository = AppDataSource.getRepository(MealTemplate);

  // Check if weekly meal plans already exist
  const count = await weeklyMealPlanRepository.count();
  if (count > 0) {
    console.log("Weekly meal plans already exist, skipping seeding");
    return;
  }

  // Get sample users and meal templates
  const users = await userRepository.find({ take: 3 });
  const mealTemplates = await mealTemplateRepository.find({ take: 10 });

  if (users.length === 0 || mealTemplates.length === 0) {
    console.log("Need users and meal templates to seed weekly meal plans");
    return;
  }

  // Create a sample week (Monday of next week)
  const nextMonday = new Date();
  nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7));
  nextMonday.setHours(0, 0, 0, 0);

  const weeklyMealPlans = [];

  // Create plans for each user for a full week
  for (const user of users) {
    for (let dayOffset = 0; dayOffset < 5; dayOffset++) { // Monday to Friday
      const mealDate = new Date(nextMonday);
      mealDate.setDate(mealDate.getDate() + dayOffset);
      
      const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const dayName = daysOfWeek[dayOffset];

      // Add 2-3 meal choices per day per user
      const mainCourse = mealTemplates.find(t => t.category === 'Main Course');
      const soup = mealTemplates.find(t => t.category === 'Soup');
      const salad = mealTemplates.find(t => t.category === 'Salad');

      if (mainCourse) {
        const planData: any = {
          user: user,
          mealTemplate: mainCourse,
          weekStartDate: nextMonday.toISOString().split('T')[0], // Convert to YYYY-MM-DD string
          dayOfWeek: dayName,
          mealDate: mealDate,
          status: dayOffset < 2 ? 'selected' : 'planned', // First two days selected
        };
        if (dayOffset < 2) {
          planData.selectedAt = new Date();
        }
        weeklyMealPlans.push(planData);
      }

      if (soup && dayOffset % 2 === 0) { // Add soup every other day
        const planData: any = {
          user: user,
          mealTemplate: soup,
          weekStartDate: nextMonday.toISOString().split('T')[0],
          dayOfWeek: dayName,
          mealDate: mealDate,
          status: dayOffset < 2 ? 'selected' : 'planned',
        };
        if (dayOffset < 2) {
          planData.selectedAt = new Date();
        }
        weeklyMealPlans.push(planData);
      }

      if (salad && dayOffset % 3 === 0) { // Add salad every third day
        const planData: any = {
          user: user,
          mealTemplate: salad,
          weekStartDate: nextMonday.toISOString().split('T')[0],
          dayOfWeek: dayName,
          mealDate: mealDate,
          status: dayOffset < 2 ? 'selected' : 'planned',
        };
        if (dayOffset < 2) {
          planData.selectedAt = new Date();
        }
        weeklyMealPlans.push(planData);
      }
    }
  }

  try {
    const createdPlans = weeklyMealPlanRepository.create(weeklyMealPlans);
    await weeklyMealPlanRepository.save(createdPlans);
    console.log(`Weekly meal plans seeded successfully: ${weeklyMealPlans.length} plans created`);
  } catch (error) {
    console.error("Error seeding weekly meal plans:", error);
    throw error;
  }
}
