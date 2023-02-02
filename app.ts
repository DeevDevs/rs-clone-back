import express from "express";
import path from "path";
import userRoutes from "./routes/userRoutes";
import statsRoutes from "./routes/statsRoutes";
import memoirRoutes from "./routes/memoirRoutes";
import demoRoutes from "./routes/demoRoutes";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());
app.use(express.static(path.join(__dirname, "public")));
app.use(compression());
app.use(cookieParser());

app.use("/api", demoRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/memoir", memoirRoutes);

export default app;
