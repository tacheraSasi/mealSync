import { Router } from "express";
import { addMenu, getAllMenu, updateMenu } from "./menu.controller";

const menuRouter = Router();

menuRouter.post("/add", addMenu);
menuRouter.get("/", getAllMenu);
menuRouter.put("/:id", updateMenu);

export default menuRouter;
