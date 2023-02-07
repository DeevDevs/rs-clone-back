const express = require("express");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const statsRoutes = require("./routes/statsRoutes");
const memoirRoutes = require("./routes/memoirRoutes");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const { processError } = require("./helperFns/errorHandler");
const cors = require("cors");

const app = express();

app.enable("trust proxy");
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(cors());
// app.use(
//   cors({
//     credentials: true,
//     origin: "http://localhost:3000",
//   })
// );
app.use((req, res, next) => {
  res.header({
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, accept, access-control-allow-origin, Cookie",
    "Access-Control-Allow-Credentials": "true",
  });
  console.log(req.method);
  if ("OPTIONS" == req.method) {
    res.header({
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, accept, access-control-allow-origin, Cookie",
      // "Access-Control-Allow-Credentials": "true",
    });
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

app.use(processError);

module.exports = app;
