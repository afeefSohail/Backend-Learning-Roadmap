const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const categoryRouter = require("./routes/category_routes");
const productRouter = require("./routes/product_routes");
const userRouter = require("./routes/users_routes");
const queryRouter = require("./routes/query_examples");

// Parsing Middleware
app.use(express.json()); // this line is required for req.body to work. parse incoming raw JSON strings into JS objects

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
// app.use("/", categoryRouter);
// app.use("/prodcuts", productRouter);
// app.use("/users", userRouter);
app.use("/", queryRouter);

app.listen(3000, () => console.log("Server running on port 3000"));
