import express from "express";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "./department.controller";
import { validateDto } from "../../middleware/validate";
import { CreateDepartmentDto, UpdateDepartmentDto } from "../../dto/department.dto";

const departmentRouter = express.Router();

departmentRouter.post("/", validateDto(CreateDepartmentDto), createDepartment);
departmentRouter.get("/", getAllDepartments);
departmentRouter.get("/:id", getDepartmentById);
departmentRouter.put("/:id", validateDto(UpdateDepartmentDto), updateDepartment);
departmentRouter.delete("/:id", deleteDepartment);

export default departmentRouter;