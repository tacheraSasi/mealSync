import bcrypt from "bcryptjs";
import { Repository } from "typeorm";
import { AppDataSource } from "../utils/data-source";
import { User } from "../entities/User";

const userRepository = (): Repository<User> =>
  AppDataSource.getRepository(User);

interface UserResult {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface ServiceResponse<T> {
  status: "success" | "error" | "created" | "creation failed";
  result?: T;
  error?: string;
}

async function allUsers(): Promise<ServiceResponse<UserResult[]>> {
  try {
    const users = await userRepository().find({
      select: ["id", "username", "email", "role"],
    });
    return { status: "success", result: users };
  } catch (error: any) {
    return { status: "error", error: error.message };
  }
}

async function getUser(id: number): Promise<ServiceResponse<UserResult>> {
  try {
    const user = await userRepository().findOne({
      where: { id },
      select: ["id", "username", "email", "role"],
    });
    if (!user) return { status: "error", error: "User not found" };
    return { status: "success", result: user };
  } catch (error: any) {
    return { status: "error", error: error.message };
  }
}

interface LoginInput {
  email: string;
  password: string;
}

async function loginUser({
  email,
  password,
}: LoginInput): Promise<ServiceResponse<UserResult>> {
  try {
    const foundUser = await userRepository().findOne({ where: { email } });
    if (!foundUser) return { status: "error", error: "Please register first" };

    const valid = await bcrypt.compare(password, foundUser.password);
    if (!valid) return { status: "error", error: "Invalid password" };

    const data: UserResult = {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      role: foundUser.role,
    };
    return { status: "success", result: data };
  } catch (error: any) {
    return { status: "error", error: error.message };
  }
}

interface CreateUserInput {
  username: string;
  email: string;
  password: string;
}

async function createUser({
  username,
  email,
  password,
}: CreateUserInput): Promise<ServiceResponse<UserResult>> {
  try {
    const existingUser = await userRepository().findOne({
      where: [{ username }, { email }],
    });

    if (existingUser)
      return {
        status: "creation failed",
        error: "User already exists. Please login.",
      };

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = userRepository().create({
      username,
      email,
      password: passwordHash,
    });

    await userRepository().save(newUser);

    return {
      status: "created",
      result: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    };
  } catch (error: any) {
    return { status: "creation failed", error: error.message };
  }
}

export { allUsers, getUser, loginUser, createUser };
