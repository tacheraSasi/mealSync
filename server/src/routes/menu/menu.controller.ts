import { Request, Response } from "express";
import { menuCreate, allMenu, menuUpdate } from "../../services/menu.service";

export async function getAllMenu(_req: Request, res: Response): Promise<Response> {
  try {
    const result = await allMenu();
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: message });
  }
}

export async function addMenu(req: Request, res: Response): Promise<Response> {
  const menu = req.body;

  if (!menu.menuname || !menu.description || !menu.menudate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await menuCreate(menu);
    return res.status(201).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: message });
  }
}

export async function updateMenu(
  req: Request,
  res: Response,
): Promise<Response> {
  const id = Number(req.params.id);
  const menu = req.body;

  if (!menu.menuname || !menu.description || !menu.menudate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await menuUpdate(menu, id);
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: message });
  }
}
