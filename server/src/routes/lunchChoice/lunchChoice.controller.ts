import { Request, Response } from "express";
import {
  addLunchChoice,
  deleteLunchChoice,
  getAllLunchChoices,
  getLunchChoiceById,
  updateLunchChoice,
} from "../../services/lunchChoice.service";

export async function getUserLunchChoices(req: Request, res: Response): Promise<Response> {
  try {
    const userId = parseInt(req.params.userId, 10);
    const { startDate, endDate } = req.query;
    
    if (isNaN(userId)) {
      return res.status(400).json({ status: 'error', error: 'Invalid user ID' });
    }
    
    const filters = {
      userId,
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined
    };
    
    const result = await getAllLunchChoices(filters);
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error getting user lunch choices:', error);
    return res.status(500).json({ status: 'error', error: message });
  }
}

export async function selectMeal(req: Request, res: Response): Promise<Response> {
  try {
    const userId = parseInt(req.params.userId, 10);
    const { menuId } = req.body;
    
    if (isNaN(userId) || isNaN(parseInt(menuId, 10))) {
      return res.status(400).json({ status: 'error', error: 'Invalid user ID or menu ID' });
    }
    
    // Get user info from the authenticated request
    const user = (req as any).user;
    
    const choice: any = {
      userid: userId,
      username: user?.username || `user_${userId}`,
      menuid: parseInt(menuId, 10),
      menuname: req.body.menuName || ''
    };
    
    const result = await addLunchChoice(choice);
    
    if (result.status === 'error') {
      return res.status(400).json(result);
    }
    
    return res.status(201).json({
      status: 'success',
      message: result.message || 'Meal selected successfully',
      data: result.result
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to select meal';
    console.error('Error selecting meal:', error);
    return res.status(500).json({ status: 'error', error: message });
  }
}

export async function updateMealSelection(req: Request, res: Response): Promise<Response> {
  try {
    const choiceId = parseInt(req.params.choiceId, 10);
    const { menuId } = req.body;
    
    if (isNaN(choiceId) || isNaN(parseInt(menuId, 10))) {
      return res.status(400).json({ status: 'error', error: 'Invalid choice ID or menu ID' });
    }
    
    // Get user info from the authenticated request
    const user = (req as any).user;
    
    const result = await updateLunchChoice(choiceId, {
      menuid: parseInt(menuId, 10),
      menuname: req.body.menuName || '',
      username: user?.username
    });
    
    if (result.status === 'error') {
      return res.status(400).json(result);
    }
    
    return res.status(200).json({
      status: 'success',
      message: 'Meal selection updated successfully',
      data: result.result
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update meal selection';
    console.error('Error updating meal selection:', error);
    return res.status(500).json({ status: 'error', error: message });
  }
}

export async function deleteMealSelection(req: Request, res: Response): Promise<Response> {
  try {
    const choiceId = parseInt(req.params.choiceId, 10);
    const userId = parseInt(req.params.userId, 10);
    
    if (isNaN(choiceId) || isNaN(userId)) {
      return res.status(400).json({ status: 'error', error: 'Invalid choice ID or user ID' });
    }
    
    // Verify the user owns this choice (unless admin)
    const user = (req as any).user;
    const isAdmin = user?.role === 'admin';
    
    if (user.id !== userId && !isAdmin) {
      return res.status(403).json({ 
        status: 'error', 
        error: 'You can only delete your own meal selections' 
      });
    }
    
    const result = await deleteLunchChoice(choiceId, isAdmin ? undefined : userId);
    
    if (result.status === 'error') {
      return res.status(400).json(result);
    }
    
    return res.status(200).json({
      status: 'success',
      message: 'Meal selection deleted successfully'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete meal selection';
    console.error('Error deleting meal selection:', error);
    return res.status(500).json({ status: 'error', error: message });
  }
}

export async function getMealSelection(req: Request, res: Response): Promise<Response> {
  try {
    const choiceId = parseInt(req.params.choiceId, 10);
    
    if (isNaN(choiceId)) {
      return res.status(400).json({ status: 'error', error: 'Invalid choice ID' });
    }
    
    const result = await getLunchChoiceById(choiceId);
    
    if (result.status === 'error') {
      return res.status(404).json(result);
    }
    
    // Verify the user owns this choice (unless admin)
    const user = (req as any).user;
    const isAdmin = user?.role === 'admin';
    
    if (user.id !== result.result?.userid && !isAdmin) {
      return res.status(403).json({ 
        status: 'error', 
        error: 'You can only view your own meal selections' 
      });
    }
    
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to get meal selection';
    console.error('Error getting meal selection:', error);
    return res.status(500).json({ status: 'error', error: message });
  }
}
