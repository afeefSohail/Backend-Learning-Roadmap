import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger-output.json" with  { type : "json"};
import authRouter from "#routes/auth.routes";
import userRouter from "#routes/user.routes";
import photoRouter from "#routes/photo.routes";

const app: Application = express();

app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/", (req, res) => {
  res.json({ success: true, message: "User Auth API is running." });
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/user", photoRouter);

export default app;