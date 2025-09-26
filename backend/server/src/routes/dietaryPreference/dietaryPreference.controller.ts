import { Request, Response } from "express";
import { AppDataSource } from "../../utils/data-source";
import { DietaryPreference } from "../../entities/DietaryPreference";
import { CreateDietaryPreferenceDto, UpdateDietaryPreferenceDto } from "../../dto/dietaryPreference.dto";

const dietaryPreferenceRepository = AppDataSource.getRepository(DietaryPreference);

export const createDietaryPreference = async (req: Request, res: Response): Promise<void> => {
  try {
    const preferenceData: CreateDietaryPreferenceDto = req.body;
    
    const newPreference = dietaryPreferenceRepository.create(preferenceData);
    const savedPreference = await dietaryPreferenceRepository.save(newPreference);

    res.status(201).json({
      status: "created",
      message: "Dietary preference created successfully",
      result: savedPreference,
    });
  } catch (error: any) {
    console.error("Error creating dietary preference:", error);
    res.status(500).json({
      status: "error",
      error: "Failed to create dietary preference",
    });
  }
};

export const getUserDietaryPreferences = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    
    const preferences = await dietaryPreferenceRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: "DESC" },
    });

    res.status(200).json({
      status: "success",
      result: preferences,
    });
  } catch (error) {
    console.error("Error fetching dietary preferences:", error);
    res.status(500).json({
      status: "error",
      error: "Failed to fetch dietary preferences",
    });
  }
};

export const getAllDietaryPreferences = async (_req: Request, res: Response): Promise<void> => {
  try {
    const preferences = await dietaryPreferenceRepository.find({
      relations: ["user"],
      where: { isActive: true },
      order: { createdAt: "DESC" },
    });

    res.status(200).json({
      status: "success",
      result: preferences,
    });
  } catch (error) {
    console.error("Error fetching dietary preferences:", error);
    res.status(500).json({
      status: "error",
      error: "Failed to fetch dietary preferences",
    });
  }
};

export const updateDietaryPreference = async (req: Request, res: Response): Promise<void> => {
  try {
    const preferenceId = parseInt(req.params.id);
    const updateData: UpdateDietaryPreferenceDto = req.body;

    const preference = await dietaryPreferenceRepository.findOne({
      where: { id: preferenceId },
    });

    if (!preference) {
      res.status(404).json({
        status: "error",
        error: "Dietary preference not found",
      });
      return;
    }

    Object.assign(preference, updateData);
    preference.updatedAt = new Date();

    const updatedPreference = await dietaryPreferenceRepository.save(preference);

    res.status(200).json({
      status: "success",
      message: "Dietary preference updated successfully",
      result: updatedPreference,
    });
  } catch (error) {
    console.error("Error updating dietary preference:", error);
    res.status(500).json({
      status: "error",
      error: "Failed to update dietary preference",
    });
  }
};

export const deleteDietaryPreference = async (req: Request, res: Response): Promise<void> => {
  try {
    const preferenceId = parseInt(req.params.id);

    const preference = await dietaryPreferenceRepository.findOne({
      where: { id: preferenceId },
    });

    if (!preference) {
      res.status(404).json({
        status: "error",
        error: "Dietary preference not found",
      });
      return;
    }

    // Soft delete by setting isActive to false
    preference.isActive = false;
    preference.updatedAt = new Date();
    await dietaryPreferenceRepository.save(preference);

    res.status(200).json({
      status: "success",
      message: "Dietary preference deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting dietary preference:", error);
    res.status(500).json({
      status: "error",
      error: "Failed to delete dietary preference",
    });
  }
};