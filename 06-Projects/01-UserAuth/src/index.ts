import express, { Request, Response, Application } from "express";
// import swaggerUi from "swagger-ui-express";
// import swaggerFile from "./swagger-output.json" assert { type: "json" };

const app: Application = express();
const PORT: number | string = process.env.PORT || 3000;

// 🟢 Parsing Middleware
// Required for req.body to work. Parses incoming raw JSON strings into JS objects.
app.use(express.json()); 

// 🌐 Mount the Unified Swagger Interface Panel
//app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Default health-probe validation checkpoint route
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "🚀 TypeScript API Gateway engine is fully live inside Docker!"
  });
});

app.listen(PORT, () => {
  console.log(`📡 Server running smoothly on port ${PORT}`);
});
