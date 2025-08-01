import express from "express";
import {
  addLunchChoice,
  getAllLunchChoice,
  deleteLunch,
} from "./lunchChoice.controller";

const lunchChoiceRouter = express.Router();

lunchChoiceRouter.post("/add", addLunchChoice);
lunchChoiceRouter.get("/", getAllLunchChoice);
lunchChoiceRouter.delete("/:id", deleteLunch);

export default lunchChoiceRouter;
