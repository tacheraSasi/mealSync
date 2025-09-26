import { Request, Response } from "express";
import { AppDataSource } from "../../utils/data-source";
import { Department } from "../../entities/Department";
import { CreateDepartmentDto, UpdateDepartmentDto } from "../../dto/department.dto";

const departmentRepository = AppDataSource.getRepository(Department);

export const createDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const departmentData: CreateDepartmentDto = req.body;
    
    const newDepartment = departmentRepository.create(departmentData);
    const savedDepartment = await departmentRepository.save(newDepartment);

    res.status(201).json({
      status: "created",
      message: "Department created successfully",
      result: savedDepartment,
    });
  } catch (error: any) {
    console.error("Error creating department:", error);
    
    if (error.code === "23505") { // Unique constraint violation
      res.status(409).json({
        status: "error",
        error: "Department name already exists",
      });
      return;
    }

    res.status(500).json({
      status: "error",
      error: "Failed to create department",
    });
  }
};

export const getAllDepartments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const departments = await departmentRepository.find({
      relations: ["users"],
      where: { isActive: true },
      order: { name: "ASC" },
    });

    res.status(200).json({
      status: "success",
      result: departments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({
      status: "error",
      error: "Failed to fetch departments",
    });
  }
};

export const getDepartmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const departmentId = parseInt(req.params.id);
    const department = await departmentRepository.findOne({
      where: { id: departmentId },
      relations: ["users"],
    });

    if (!department) {
      res.status(404).json({
        status: "error",
        error: "Department not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      result: department,
    });
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({
      status: "error",
      error: "Failed to fetch department",
    });
  }
};

export const updateDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const departmentId = parseInt(req.params.id);
    const updateData: UpdateDepartmentDto = req.body;

    const department = await departmentRepository.findOne({
      where: { id: departmentId },
    });

    if (!department) {
      res.status(404).json({
        status: "error",
        error: "Department not found",
      });
      return;
    }

    Object.assign(department, updateData);
    department.updatedAt = new Date();

    const updatedDepartment = await departmentRepository.save(department);

    res.status(200).json({
      status: "success",
      message: "Department updated successfully",
      result: updatedDepartment,
    });
  } catch (error: any) {
    console.error("Error updating department:", error);
    
    if (error.code === "23505") {
      res.status(409).json({
        status: "error",
        error: "Department name already exists",
      });
      return;
    }

    res.status(500).json({
      status: "error",
      error: "Failed to update department",
    });
  }
};

export const deleteDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const departmentId = parseInt(req.params.id);

    const department = await departmentRepository.findOne({
      where: { id: departmentId },
      relations: ["users"],
    });

    if (!department) {
      res.status(404).json({
        status: "error",
        error: "Department not found",
      });
      return;
    }

    // Check if department has active users
    const activeUsers = department.users.filter(user => user.isActive);
    if (activeUsers.length > 0) {
      res.status(400).json({
        status: "error",
        error: "Cannot delete department with active users. Please reassign or deactivate users first.",
      });
      return;
    }

    // Soft delete by setting isActive to false
    department.isActive = false;
    department.updatedAt = new Date();
    await departmentRepository.save(department);

    res.status(200).json({
      status: "success",
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({
      status: "error",
      error: "Failed to delete department",
    });
  }
};