const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const dataRouters = require("./routes/01-data_operations");
const queryRouter = require("./routes/02-query_examples");
const filteringRouter = require("./routes/03-filtering_examples");
const joinQueriesRouter = require("./routes/04-join_queries")
const aggregateGrouping = require("./routes/05-aggregation_grouping")

// Parsing Middleware
app.use(express.json()); // this line is required for req.body to work. parse incoming raw JSON strings into JS objects

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
// app.use("/", dataRouters);
// app.use("/", queryRouter);
// app.use("/", filteringRouter);
//app.use("/", joinQueriesRouter);
app.use("/", aggregateGrouping);
app.listen(3000, () => console.log("Server running on port 3000"));
