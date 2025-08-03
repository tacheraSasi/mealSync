import express from "express";
import {
  userRegister,
  getAllUsers,
  getUserById,
  userLogin,
} from "./user.controller";
import { validateDto } from "../../middleware/validate";
import {
  CreateUserDto,
  LoginUserDto,
  UserIdParamDto,
} from "../../dto/user.dto";

const userRouter = express.Router();

userRouter.post("/login", validateDto(LoginUserDto), userLogin);
userRouter.post("/register", validateDto(CreateUserDto), userRegister);
userRouter.get("/", getAllUsers);
userRouter.get("/:id", validateDto(UserIdParamDto, "params"), getUserById);

export default userRouter;
