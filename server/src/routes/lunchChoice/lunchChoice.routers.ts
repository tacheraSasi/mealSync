import express from "express";
import { authenticateJWT } from "../../middleware/auth";
import {
  getUserLunchChoices,
  selectMeal,
  updateMealSelection,
  deleteMealSelection,
  getMealSelection
} from "./lunchChoice.controller";

const lunchChoiceRouter = express.Router();

// Apply authentication middleware to all routes
lunchChoiceRouter.use(authenticateJWT);

// Get all lunch choices for a user (with optional date filters)
lunchChoiceRouter.get("/user/:userId", (req, res, next) => {
  // Allow users to view their own choices or admins to view any user's choices
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

export default lunchChoiceRouter;
