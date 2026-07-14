const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const indexRouter = require("./routes/a_create_record");

// Parsing Middleware
app.use(express.json()); // this line is required for req.body to work. parse incoming raw JSON strings into JS objects

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/", indexRouter);
app.listen(3000, () => console.log("Server running on port 3000"));
