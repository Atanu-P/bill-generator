const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const routes = require("./routes/");
const connectDB = require("./db");
const errorHandler = require("./utils/errorHandler");
require("dotenv").config();

connectDB();

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(morgan("dev"));

app.use(routes);
app.use(errorHandler);

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
