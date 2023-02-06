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

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use((req, res, next) => {
  res.header({ "Access-Control-Allow-Origin": "http://localhost:3000" });
  next();
});
// app.options("*", cors());
// app.use((req, res, next) => {
//   res.header({ "Access-Control-Allow-Origin": "http://localhost:3000" });
//   res.header({ "Access-Control-Allow-Credentials": "true" });
//   next();
// });
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());
app.use(compression());

app.use("/api/user", userRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/memoir", memoirRoutes);

app.use(processError);

module.exports = app;
