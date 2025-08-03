import { Router } from "express";
import { addMenu, getAllMenu, updateMenu, generateWeeklyMenu } from "./menu.controller";
import { authenticateJWT } from "../../middleware/auth";

const menuRouter = Router();

menuRouter.post("/add", addMenu);
menuRouter.get("/", getAllMenu);
menuRouter.put("/:id", updateMenu);

// Generate weekly menus (admin only)
menuRouter.post("/generate-weekly", authenticateJWT, generateWeeklyMenu);

export default menuRouter;
