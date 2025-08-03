import { AppDataSource } from "../utils/data-source";
import { LunchChoice } from "../entities/LunchChoice";
import { User } from "../entities/User";
import { Menu } from "../entities/Menu";
import { isAfter, parseISO } from "date-fns";
import ExcelJS from "exceljs";
import { Repository } from "typeorm/repository/Repository";

// Cache repository instances for better performance
let cachedLunchChoiceRepository: Repository<LunchChoice> | null = null;

const lunchChoiceRepository = () => {
  if (!cachedLunchChoiceRepository) {
    cachedLunchChoiceRepository = AppDataSource.getRepository(LunchChoice);
  }
  return cachedLunchChoiceRepository;
};

const userRepository = () => {
  return AppDataSource.getRepository(User);
};

const menuRepository = () => {
  return AppDataSource.getRepository(Menu);
};

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

async function exportLunchChoices(): Promise<any> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Weekly Meal Plan");

  // Add Header Row
  worksheet.columns = [
    { header: "Username", key: "username", width: 20 },
    { header: "Monday", key: "monday", width: 25 },
    { header: "Tuesday", key: "tuesday", width: 25 },
    { header: "Wednesday", key: "wednesday", width: 25 },
    { header: "Thursday", key: "thursday", width: 25 },
    { header: "Friday", key: "friday", width: 25 }
  ];

  try {
    // Get all users
    const users = await userRepository().find({
      select: ["id", "username"]
    });

    // Get current week's start (Monday) and end (Friday)
    const today = new Date();
    const currentWeekStart = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is Sunday
    currentWeekStart.setDate(diff);
    currentWeekStart.setHours(0, 0, 0, 0);

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 4); // Friday
    currentWeekEnd.setHours(23, 59, 59, 999);

    // Format dates for database queries
    const startDateStr = currentWeekStart.toISOString().split('T')[0];
    const endDateStr = currentWeekEnd.toISOString().split('T')[0];

    // Get all lunch choices for the current week
    const lunchChoices = await lunchChoiceRepository()
      .createQueryBuilder("choice")
      .where("choice.menudate >= :startDate", { startDate: startDateStr })
      .andWhere("choice.menudate <= :endDate", { endDate: endDateStr })
      .orderBy("choice.userid", "ASC")
      .addOrderBy("choice.menudate", "ASC")
      .getMany();

    // Create a map to organize lunch choices by user and day
    const userMeals: { [userId: number]: { [day: string]: string } } = {};

    // Initialize user meal data
    users.forEach(user => {
      userMeals[user.id] = {
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: ""
      };
    });

    // Populate meal data
    lunchChoices.forEach(choice => {
      const choiceDate = new Date(choice.menudate);
      const dayOfWeek = choiceDate.getDay();
      
      let dayKey = "";
      switch (dayOfWeek) {
        case 1: dayKey = "monday"; break;
        case 2: dayKey = "tuesday"; break;
        case 3: dayKey = "wednesday"; break;
        case 4: dayKey = "thursday"; break;
        case 5: dayKey = "friday"; break;
        default: return; // Skip weekends
      }

      if (userMeals[choice.userid]) {
        userMeals[choice.userid][dayKey] = choice.menuname;
      }
    });

    // Add data rows to worksheet
    users.forEach(user => {
      const rowData = {
        username: user.username,
        monday: userMeals[user.id]?.monday || "No selection",
        tuesday: userMeals[user.id]?.tuesday || "No selection",
        wednesday: userMeals[user.id]?.wednesday || "No selection",
        thursday: userMeals[user.id]?.thursday || "No selection",
        friday: userMeals[user.id]?.friday || "No selection"
      };
      
      worksheet.addRow(rowData);
    });

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4472C4' }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Add borders to all cells
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
        });
      }
    });

    // Add title and date information
    worksheet.insertRow(1, []);
    worksheet.insertRow(1, [`Weekly Meal Plan - Week of ${startDateStr} to ${endDateStr}`]);
    worksheet.mergeCells('A1:F1');
    const titleCell = worksheet.getCell('A1');
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    
    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
    
  } catch (error) {
    console.error('Error generating Excel export:', error);
    throw new Error('Failed to generate Excel export');
  }
}

export { 
  lunchChoiceCreate, 
  allLunchChoice, 
  getAllLunchChoices, 
  addLunchChoice, 
  deleteLunchChoice,
  getLunchChoiceById,
  updateLunchChoice,
  exportLunchChoices
};
