import { Request, Response } from "express";
import {
  createUser,
  allUsers,
  getUser,
  loginUser,
} from "../../services/user.service";

export async function getAllUsers(res: Response): Promise<Response> {
  try {
    const result = await allUsers();
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getUserById(
  req: Request,
  res: Response,
): Promise<Response> {
  const id = Number(req.params.id); // convert to number

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  try {
    const result = await getUser(id);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function userLogin(
  req: Request,
  res: Response,
): Promise<Response> {
  const user = req.body;
  try {
    const result = await loginUser(user);
    if (result.status === "error") {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function userRegister(
  req: Request,
  res: Response,
): Promise<Response> {
  const user = req.body;
  if (!user.username || !user.email || !user.password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const result = await createUser(user);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
