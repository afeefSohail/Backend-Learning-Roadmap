const express = require("express");
const app = express();
const indexRouter = require("./routes/a_create_record");

// Parsing Middleware
app.use(express.json()); // this line is required for req.body to work. parse incoming raw JSON strings into JS objects
app.use(express.urlencoded({ extended: true })); // optional, for form-encoded bodies. inputs (e.g., from Postman/HTML forms)

app.use("/", indexRouter);
app.listen(3000, () => console.log("Server running on port 3000"));
