import { Request, Response } from "express";
import { menuCreate, allMenu, menuUpdate, generateWeeklyMenus } from "../../services/menu.service";
import { startOfWeek, addDays, parseISO } from "date-fns";

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

export async function generateWeeklyMenu(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    // Get the authenticated user from the request (assuming you have auth middleware)
    const user = (req as any).user;
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized: Admin access required' });
    }

    // Get the start date from query params or default to next Monday
    const startDateParam = req.query.startDate as string;
    const startDate = startDateParam 
      ? parseISO(startDateParam) 
      : startOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 }); // Next Monday

    const result = await generateWeeklyMenus(startDate, user.username);
    
    if (result.status === 'error') {
      return res.status(400).json({ error: result.error });
    }

    return res.status(201).json({
      status: 'success',
      message: 'Weekly menus generated successfully',
      data: result.result
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate weekly menus';
    return res.status(500).json({ 
      status: 'error',
      error: message 
    });
  }
}
