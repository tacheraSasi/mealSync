import express from "express";
// Temporarily commenting out JWT auth until it's properly implemented
// import { authenticateJWT } from "../../middleware/auth";
import {
  getUserLunchChoices,
  selectMeal,
  updateMealSelection,
  deleteMealSelection,
  getMealSelection
} from "./lunchChoice.controller";
import { exportLunchChoices } from "../../services/lunchChoice.service";

const lunchChoiceRouter = express.Router();

// Temporarily disable authentication middleware for testing
// Apply authentication middleware to all routes
// lunchChoiceRouter.use(authenticateJWT);

// Get all lunch choices for a user
lunchChoiceRouter.get("/user/:userId", (req, res, next) => {
  const userId = parseInt(req.params.userId);
  const isAdmin = (req as any).user?.role === 'admin';
  
  if (!isAdmin && (req as any).user?.id !== userId) {
    return res.status(403).json({ 
      status: 'error', 
      error: 'You can only view your own meal selections' 
    });
  }
  
  return next();
}, getUserLunchChoices);

// Select a meal for a user
lunchChoiceRouter.post("/user/:userId/select", (req, res, next) => {
  const userId = parseInt(req.params.userId);
  const isAdmin = (req as any).user?.role === 'admin';
  
  // Only allow users to select meals for themselves, unless admin
  if (!isAdmin && (req as any).user?.id !== userId) {
    return res.status(403).json({ 
      status: 'error', 
      error: 'You can only select meals for yourself' 
    });
  }
  
  return next();
}, selectMeal);

// Update a meal selection
lunchChoiceRouter.put("/:choiceId", (req, res, next) => {
  const choiceId = parseInt(req.params.choiceId);
  
  if (isNaN(choiceId)) {
    return res.status(400).json({ status: 'error', error: 'Invalid choice ID' });
  }
  
  // Store choiceId in request for controller to use
  (req as any).choiceId = choiceId;
  return next();
}, updateMealSelection);

// Delete a meal selection
lunchChoiceRouter.delete("/:choiceId/user/:userId", (req, res, next) => {
  const { choiceId, userId } = req.params;
  
  if (isNaN(parseInt(choiceId)) || isNaN(parseInt(userId))) {
    return res.status(400).json({ status: 'error', error: 'Invalid IDs' });
  }
  
  // Store IDs in request for controller to use
  (req as any).choiceId = parseInt(choiceId);
  (req as any).userId = parseInt(userId);
  
  return next();
}, deleteMealSelection);

// Get a specific meal selection
lunchChoiceRouter.get("/:choiceId", (req, res, next) => {
  const choiceId = parseInt(req.params.choiceId);
  
  if (isNaN(choiceId)) {
    return res.status(400).json({ status: 'error', error: 'Invalid choice ID' });
  }
  
  // Store choiceId in request for controller to use
  (req as any).choiceId = choiceId;
  return next();
}, getMealSelection);

lunchChoiceRouter.get('/export', async (_req, res) => {
  try {
    // For now, allow export without authentication
    // TODO: Re-enable admin check when JWT authentication is properly implemented
    // const isAdmin = (req as any).user?.role === 'admin';
    // if (!isAdmin) {
    //   return res.status(403).json({ 
    //     status: 'error', 
    //     error: 'Only administrators can export meal plans' 
    //   });
    // }

    const excelBuffer = await exportLunchChoices();
    
    // Get current date for filename
    const today = new Date();
    const weekStart = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    weekStart.setDate(diff);
    
    const filename = `weekly_meal_plan_${weekStart.toISOString().split('T')[0]}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', excelBuffer.length);
    
    return res.send(excelBuffer);
  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({ 
      status: 'error', 
      error: 'Failed to export meal plan' 
    });
  }
});

export default lunchChoiceRouter;
