const express = require("express");
const app = express();
const indexRouter = require("./routes/a_create_recorde");
app.use("/", indexRouter);
app.listen(3000, () => console.log("Server running on port 3000"));
