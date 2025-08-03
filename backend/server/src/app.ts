import express, { Request, Response } from "express";
import cors from "cors";
import userRouter from "./routes/user/user.routers";
import menuRouter from "./routes/menu/menu.routers";
import lunchChoiceRouter from "./routes/lunchChoice/lunchChoice.routers";
import mealTemplateRouter from "./routes/mealTemplate/mealTemplate.routers";
import weeklyMealPlanRouter from "./routes/weeklyMealPlan/weeklyMealPlan.routers";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/user", userRouter);
app.use("/menu", menuRouter);
app.use("/lunchChoice", lunchChoiceRouter);
app.use("/mealTemplate", mealTemplateRouter);
app.use("/weeklyMealPlan", weeklyMealPlanRouter);

// Root route
app.get("/", (_req: Request, res: Response) => {
  res.send("office lunch menu management server");
});

export default app;
