import express from "express";
import {
  createDietaryPreference,
  getUserDietaryPreferences,
  getAllDietaryPreferences,
  updateDietaryPreference,
  deleteDietaryPreference,
} from "./dietaryPreference.controller";
import { validateDto } from "../../middleware/validate";
import { CreateDietaryPreferenceDto, UpdateDietaryPreferenceDto } from "../../dto/dietaryPreference.dto";

const dietaryPreferenceRouter = express.Router();

dietaryPreferenceRouter.post("/", validateDto(CreateDietaryPreferenceDto), createDietaryPreference);
dietaryPreferenceRouter.get("/", getAllDietaryPreferences);
dietaryPreferenceRouter.get("/user/:userId", getUserDietaryPreferences);
dietaryPreferenceRouter.put("/:id", validateDto(UpdateDietaryPreferenceDto), updateDietaryPreference);
dietaryPreferenceRouter.delete("/:id", deleteDietaryPreference);

export default dietaryPreferenceRouter;