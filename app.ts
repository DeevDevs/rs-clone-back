import express from "express";
import path from "path";
import userRoutes from "./routes/userRoutes";
import statsRoutes from "./routes/statsRoutes";
import memoirRoutes from "./routes/memoirRoutes";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import cookieParser from "cookie-parser";
import { processError } from "./helperFns/errorHandler";

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());
app.use(express.static(path.join(__dirname, "public")));
app.use(compression());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/memoir", memoirRoutes);

app.use(processError);

export default app;
