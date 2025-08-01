import { Request, Response } from "express";
import {
  lunchChoiceCreate,
  allLunchChoice,
  deleteLunchChoice,
} from "../../services/lunchChoice.service";

export async function getAllLunchChoice(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const result = await allLunchChoice();
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: message });
  }
}

export async function addLunchChoice(
  req: Request,
  res: Response,
): Promise<Response> {
  const lunchChoice = req.body;

  if (!lunchChoice.userid || !lunchChoice.menuid) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await lunchChoiceCreate(lunchChoice);
    return res.status(201).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: message });
  }
}

export async function deleteLunch(
  req: Request,
  res: Response,
): Promise<Response> {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID parameter" });
  }

  try {
    const result = await deleteLunchChoice(id);
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: message });
  }
}
