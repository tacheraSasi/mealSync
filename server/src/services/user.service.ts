import bcrypt from "bcryptjs";
import { Repository } from "typeorm";
import { AppDataSource } from "../utils/data-source";
import { User } from "../entities/User";

// Cache repository instance for better performance
let cachedUserRepository: Repository<User> | null = null;

const userRepository = (): Repository<User> => {
  if (!cachedUserRepository) {
    cachedUserRepository = AppDataSource.getRepository(User);
  }
  return cachedUserRepository;
};

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

// Helper function for consistent error handling
const handleError = (error: unknown, fallbackMessage: string): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
};

// Helper function to sanitize user input
const sanitizeInput = (input: string): string => {
  return input.trim().toLowerCase();
};

async function allUsers(): Promise<ServiceResponse<UserResult[]>> {
  try {
    const users = await userRepository().find({
      select: ["id", "username", "email", "role"],
    });
    return { status: "success", result: users };
  } catch (error: unknown) {
    return { 
      status: "error", 
      error: handleError(error, "Failed to fetch users") 
    };
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
  } catch (error: unknown) {
    return { 
      status: "error", 
      error: handleError(error, "Failed to fetch user") 
    };
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
    // Sanitize email input
    const normalizedEmail = sanitizeInput(email);
    
    // Only select necessary fields + password for verification
    const foundUser = await userRepository().findOne({ 
      where: { email: normalizedEmail },
      select: ["id", "username", "email", "role", "password"]
    });
    
    // Perform password check even if user not found to prevent timing attacks
    const dummyHash = "$2a$10$dummyhashtopreventtimingattacks";
    const userPassword = foundUser?.password || dummyHash;
    const valid = await bcrypt.compare(password, userPassword);
    
    if (!foundUser || !valid) {
      return { status: "error", error: "Invalid email or password" };
    }

    const data: UserResult = {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      role: foundUser.role,
    };
    return { status: "success", result: data };
  } catch (error: unknown) {
    return { 
      status: "error", 
      error: handleError(error, "Login failed") 
    };
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
    // Sanitize inputs
    const normalizedEmail = sanitizeInput(email);
    const trimmedUsername = username.trim();
    
    const existingUser = await userRepository().findOne({
      where: [{ username: trimmedUsername }, { email: normalizedEmail }],
    });

    if (existingUser)
      return {
        status: "creation failed",
        error: "User already exists. Please login.",
      };

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = userRepository().create({
      username: trimmedUsername,
      email: normalizedEmail,
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
  } catch (error: unknown) {
    return { 
      status: "creation failed", 
      error: handleError(error, "User creation failed") 
    };
  }
}

export { allUsers, getUser, loginUser, createUser };
