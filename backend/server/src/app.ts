import express, { Request, Response } from "express";
import cors from "cors";
import userRouter from "./routes/user/user.routers";
import menuRouter from "./routes/menu/menu.routers";
import lunchChoiceRouter from "./routes/lunchChoice/lunchChoice.routers";
import mealTemplateRouter from "./routes/mealTemplate/mealTemplate.routers";
import weeklyMealPlanRouter from "./routes/weeklyMealPlan/weeklyMealPlan.routers";
import smsRouter from "./routes/sms/sms.routers";

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
app.use("/sms", smsRouter);

// Root route
app.get("/", (_req: Request, res: Response) => {
  res.send("office lunch menu management server");
});

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "mealsync-api"
  });
});

export default app;
