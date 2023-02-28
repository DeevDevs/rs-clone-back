const express = require("express");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const statsRoutes = require("./routes/statsRoutes");
const memoirRoutes = require("./routes/memoirRoutes");
const previewsRoutes = require("./routes/previewsRoutes");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const { processError } = require("./helperFns/errorHandler");

const app = express();

app.enable("trust proxy");
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  const allowedOrigins = ["http://localhost:3000", "https://travelers-memoirs.netlify.app"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header({
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, accept, access-control-allow-origin, Cookie",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, PATCH, POST, DELETE",
  });
  if ("OPTIONS" == req.method) {
    res.send(200);
  } else next();
});

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());
app.use(compression());

app.use("/api/user", userRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/memoir", memoirRoutes);
app.use("/api/previews", previewsRoutes);

app.use(processError);

module.exports = app;
