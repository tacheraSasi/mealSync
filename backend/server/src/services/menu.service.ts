import { format, addDays, isSameDay } from "date-fns";
import { Repository, In } from "typeorm";
import { AppDataSource } from "../utils/data-source";
import { Menu } from "../entities/Menu";
import { MealTemplate } from "../entities/MealTemplate";

const menuRepository = (): Repository<Menu> =>
  AppDataSource.getRepository(Menu);

interface MenuInput {
  menuname: string;
  description: string;
  menudate: string;
  createdby: string;
}

async function allMenu(): Promise<{
  status: string;
  result?: Menu[];
  error?: string;
}> {
  try {
    const currentDate = format(new Date(), "d-MMM-yyyy");

    // Fetch all menus
    const menus = await menuRepository().find();

    // Update isactive flag for each menu depending on the date
    for (const menu of menus) {
      const isActive = menu.menudate === currentDate;
      if (menu.isactive !== isActive) {
        menu.isactive = isActive;
        await menuRepository().save(menu);
      }
    }

    // Fetch updated menus
    const updatedMenus = await menuRepository().find();

    return { status: "success", result: updatedMenus };
  } catch (error: any) {
    return { status: "error", error: error.message };
  }
}

async function menuCreate(
  menu: MenuInput,
): Promise<{ status: string; result?: Menu; error?: string }> {
  try {
    const currentDate = format(new Date(), "d-MMM-yyyy");

    const newMenu = menuRepository().create({
      ...menu,
      isactive: menu.menudate === currentDate,
    });

    await menuRepository().save(newMenu);

    return { status: "created", result: newMenu };
  } catch (error: any) {
    return { status: "error", error: error.message };
  }
}

async function menuUpdate(
  menu: MenuInput,
  id: number,
): Promise<{ status: string; result?: Menu; error?: string }> {
  try {
    const currentDate = format(new Date(), "d-MMM-yyyy");

    const existingMenu = await menuRepository().findOneBy({ id });
    if (!existingMenu) return { status: "error", error: "Menu not found" };

    existingMenu.menuname = menu.menuname;
    existingMenu.description = menu.description;
    existingMenu.menudate = menu.menudate;
    existingMenu.createdby = menu.createdby;
    existingMenu.isactive = menu.menudate === currentDate;

    await menuRepository().save(existingMenu);

    return { status: "updated", result: existingMenu };
  } catch (error: any) {
    return { status: "error", error: error.message };
  }
}

/**
 * Generates weekly menus starting from the specified date
 * @param weekStartDate - The start date of the week (should be a Monday)
 * @param createdBy - Username of the admin creating the menus
 * @returns Status and generated menus or error message
 */
async function generateWeeklyMenus(
  weekStartDate: Date,
  createdBy: string
): Promise<{ status: string; result?: Menu[]; error?: string }> {
  try {
    const mealTemplates = await AppDataSource.getRepository(MealTemplate).find({
      where: { isActive: true },
    });

    if (mealTemplates.length === 0) {
      return { status: "error", error: "No active meal templates found" };
    }

    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const generatedMenus: Menu[] = [];
    
    // Format the dates for the week
    const weekDates = weekDays.map((_, index) => {
      const date = addDays(weekStartDate, index);
      return format(date, "d-MMM-yyyy");
    });
    
    // Find and remove existing menus for these dates
    const existingMenus = await menuRepository().find({
      where: { menudate: In(weekDates) },
    });

    if (existingMenus.length > 0) {
      await menuRepository().remove(existingMenus);
    }

    // Generate 3 random meals for each workday
    for (let i = 0; i < weekDays.length; i++) {
      const currentDate = addDays(weekStartDate, i);
      const formattedDate = format(currentDate, "d-MMM-yyyy");
      
      // Shuffle and select 3 random meals for the day
      const dailyMeals = [...mealTemplates]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      for (const meal of dailyMeals) {
        const menu = new Menu();
        menu.menuname = meal.name;
        menu.description = meal.description;
        menu.menudate = formattedDate;
        menu.createdby = createdBy;
        menu.isactive = isSameDay(currentDate, new Date());
        
        const savedMenu = await menuRepository().save(menu);
        generatedMenus.push(savedMenu);
      }
    }

    return { status: "success", result: generatedMenus };
  } catch (error: any) {
    console.error("Error generating weekly menus:", error);
    return { status: "error", error: error.message };
  }
}

export { allMenu, menuCreate, menuUpdate, generateWeeklyMenus };
