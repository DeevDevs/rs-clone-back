const express = require("express");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const statsRoutes = require("./routes/statsRoutes");
const memoirRoutes = require("./routes/memoirRoutes");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const { processError } = require("./helperFns/errorHandler");
const cors = require("cors");

const app = express();

app.use(cors());
app.options("*", cors());
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());
app.use(express.static(path.join(__dirname, "public")));
app.use(compression());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/memoir", memoirRoutes);

app.use(processError);

module.exports = app;