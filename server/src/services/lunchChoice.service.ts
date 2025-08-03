import { AppDataSource } from "../utils/data-source";
import { LunchChoice } from "../entities/LunchChoice";
import { User } from "../entities/User";
import { Menu } from "../entities/Menu";
import { isAfter, parseISO } from "date-fns";

const lunchChoiceRepository = () => AppDataSource.getRepository(LunchChoice);
const userRepository = () => AppDataSource.getRepository(User);
const menuRepository = () => AppDataSource.getRepository(Menu);

interface LunchChoiceInput {
  userid: number;
  username: string;
  menuid: number;
  menuname: string;
  menudate?: string;
}

interface ServiceResponse<T = any> {
  status: string;
  result?: T;
  error?: string;
  message?: string;
}

async function allLunchChoice(): Promise<{
  status: string;
  result?: LunchChoice[];
  error?: string;
}> {
  try {
    const result = await lunchChoiceRepository().find();
    return { status: "success", result };
  } catch (error: any) {
    return { status: "error", error: error.message };
  }
}

async function getAllLunchChoices(
  filters: {
    userId?: number;
    startDate?: string;
    endDate?: string;
  } = {}
): Promise<{
  status: string;
  result?: LunchChoice[];
  error?: string;
}> {
  try {
    const query = lunchChoiceRepository().createQueryBuilder("choice");
    
    if (filters.userId) {
      query.andWhere("choice.userid = :userId", { userId: filters.userId });
    }
    
    if (filters.startDate) {
      query.andWhere("choice.menudate >= :startDate", { startDate: filters.startDate });
    }
    
    if (filters.endDate) {
      query.andWhere("choice.menudate <= :endDate", { endDate: filters.endDate });
    }
    
    query.orderBy("choice.menudate", "ASC");
    
    const choices = await query.getMany();
    return { status: "success", result: choices };
  } catch (error: any) {
    console.error("Error getting lunch choices:", error);
    return { status: "error", error: error.message };
  }
}

async function lunchChoiceCreate(
  input: LunchChoiceInput,
): Promise<{ status: string; result?: LunchChoice; error?: string }> {
  const { userid, menuid } = input;

  try {
    // Check if already added
    const exists = await lunchChoiceRepository().findOneBy({ userid, menuid });
    if (exists) {
      return {
        status: "creation failed",
        error: "Already added this menu item",
      };
    }

    // Fetch related user and menu
    const user = await userRepository().findOneBy({ id: userid });
    if (!user) return { status: "error", error: "User not found" };

    const menu = await menuRepository().findOneBy({ id: menuid });
    if (!menu) return { status: "error", error: "Menu not found" };

    // Create LunchChoice entity
    const newLunchChoice = lunchChoiceRepository().create({
      userid: user.id,
      username: user.username,
      menuid: menu.id,
      menuname: menu.menuname,
      menudate: menu.menudate,
      user, // optional: set relation object
      menu, // optional: set relation object
    });

    await lunchChoiceRepository().save(newLunchChoice);

    return { status: "created", result: newLunchChoice };
  } catch (err: any) {
    return { status: "creation failed", error: err.message };
  }
}

async function addLunchChoice(
  choice: LunchChoiceInput,
): Promise<ServiceResponse<LunchChoice>> {
  const queryRunner = AppDataSource.createQueryRunner();
  
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    const user = await userRepository().findOne({ where: { id: choice.userid } });
    if (!user) {
      await queryRunner.rollbackTransaction();
      return { status: "error", error: "User not found" };
    }

    const menu = await menuRepository().findOne({ where: { id: choice.menuid } });
    if (!menu) {
      await queryRunner.rollbackTransaction();
      return { status: "error", error: "Menu not found" };
    }

    // Parse the menu date and check if it's in the future
    const menuDate = parseISO(menu.menudate);
    const today = new Date();
    
    // Allow selection only for future dates or today before 10 AM
    const cutoffTime = new Date(today);
    cutoffTime.setHours(10, 0, 0, 0);
    
    if (isAfter(today, menuDate) && isAfter(today, cutoffTime)) {
      await queryRunner.rollbackTransaction();
      return { 
        status: "error", 
        error: "Cannot select a meal for a past date or after 10 AM on the same day" 
      };
    }

    // Check if user already made a choice for this date
    const existingChoice = await lunchChoiceRepository().findOne({
      where: {
        userid: choice.userid,
        menudate: menu.menudate
      }
    });

    if (existingChoice) {
      // Update existing choice
      existingChoice.menuid = choice.menuid;
      existingChoice.menuname = choice.menuname;
      const updatedChoice = await lunchChoiceRepository().save(existingChoice);
      await queryRunner.commitTransaction();
      return { 
        status: "success", 
        result: updatedChoice,
        message: "Meal selection updated successfully"
      };
    } else {
      // Create new choice
      const newChoice = new LunchChoice();
      newChoice.userid = choice.userid;
      newChoice.username = choice.username;
      newChoice.menuid = choice.menuid;
      newChoice.menuname = choice.menuname;
      newChoice.menudate = menu.menudate;

      const savedChoice = await lunchChoiceRepository().save(newChoice);
      await queryRunner.commitTransaction();
      return { 
        status: "success", 
        result: savedChoice,
        message: "Meal selected successfully"
      };
    }
  } catch (error: any) {
    await queryRunner.rollbackTransaction();
    console.error("Error in addLunchChoice:", error);
    return { status: "error", error: error.message };
  } finally {
    await queryRunner.release();
  }
}

async function deleteLunchChoice(
  id: number,
  userId?: number
): Promise<ServiceResponse<boolean>> {
  const queryRunner = AppDataSource.createQueryRunner();
  
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    const choice = await lunchChoiceRepository().findOne({ where: { id } });
    
    if (!choice) {
      await queryRunner.rollbackTransaction();
      return { status: "error", error: "Lunch choice not found" };
    }
    
    // If userId is provided, verify the choice belongs to the user
    if (userId && choice.userid !== userId) {
      await queryRunner.rollbackTransaction();
      return { 
        status: "error", 
        error: "Unauthorized: You can only delete your own meal selections" 
      };
    }
    
    // Check if the menu date is in the future or today before 10 AM
    const menuDate = parseISO(choice.menudate);
    const today = new Date();
    const cutoffTime = new Date(today);
    cutoffTime.setHours(10, 0, 0, 0);
    
    if (isAfter(today, menuDate) && isAfter(today, cutoffTime)) {
      await queryRunner.rollbackTransaction();
      return { 
        status: "error", 
        error: "Cannot delete a meal selection for a past date or after 10 AM on the same day" 
      };
    }
    
    const result = await lunchChoiceRepository().delete(id);
    
    if (result.affected === 0) {
      await queryRunner.rollbackTransaction();
      return { status: "error", error: "Failed to delete lunch choice" };
    }
    
    await queryRunner.commitTransaction();
    return { 
      status: "success", 
      result: true,
      message: "Meal selection deleted successfully" 
    };
  } catch (error: any) {
    await queryRunner.rollbackTransaction();
    console.error("Error deleting lunch choice:", error);
    return { status: "error", error: error.message };
  } finally {
    await queryRunner.release();
  }
}

async function getLunchChoiceById(id: number): Promise<ServiceResponse<LunchChoice>> {
  try {
    const choice = await lunchChoiceRepository().findOne({ 
      where: { id },
      relations: ['user', 'menu']
    });
    
    if (!choice) {
      return { status: 'error', error: 'Lunch choice not found' };
    }
    
    return { status: 'success', result: choice };
  } catch (error: any) {
    console.error('Error getting lunch choice by ID:', error);
    return { status: 'error', error: error.message };
  }
}

async function updateLunchChoice(
  id: number, 
  updateData: Partial<LunchChoiceInput>
): Promise<ServiceResponse<LunchChoice>> {
  const queryRunner = AppDataSource.createQueryRunner();
  
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    const choice = await lunchChoiceRepository().findOne({ where: { id } });
    if (!choice) {
      await queryRunner.rollbackTransaction();
      return { status: 'error', error: 'Lunch choice not found' };
    }
    
    // Update fields if provided
    if (updateData.menuid) {
      const menu = await menuRepository().findOne({ where: { id: updateData.menuid } });
      if (!menu) {
        await queryRunner.rollbackTransaction();
        return { status: 'error', error: 'Menu not found' };
      }
      
      // Check if the menu date is in the past or today after cutoff
      const menuDate = parseISO(menu.menudate);
      const today = new Date();
      const cutoffTime = new Date(today);
      cutoffTime.setHours(10, 0, 0, 0);
      
      if (isAfter(today, menuDate) && isAfter(today, cutoffTime)) {
        await queryRunner.rollbackTransaction();
        return { 
          status: 'error', 
          error: 'Cannot update to a menu from a past date or after 10 AM on the same day' 
        };
      }
      
      choice.menuid = updateData.menuid;
      choice.menuname = updateData.menuname || menu.menuname;
      choice.menudate = menu.menudate;
    }
    
    if (updateData.username) {
      choice.username = updateData.username;
    }
    
    const updatedChoice = await lunchChoiceRepository().save(choice);
    await queryRunner.commitTransaction();
    
    return { 
      status: 'success', 
      result: updatedChoice,
      message: 'Meal selection updated successfully'
    };
  } catch (error: any) {
    await queryRunner.rollbackTransaction();
    console.error('Error updating lunch choice:', error);
    return { status: 'error', error: error.message };
  } finally {
    await queryRunner.release();
  }
}

export { 
  lunchChoiceCreate, 
  allLunchChoice, 
  getAllLunchChoices, 
  addLunchChoice, 
  deleteLunchChoice,
  getLunchChoiceById,
  updateLunchChoice
};
