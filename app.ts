import express from "express";
import path from "path";
import demoRoutes from "./routes/demoRoutes";
import mongoSanitize from "express-mongo-sanitize";

const app = express();

app.use("/", demoRoutes);

export default app;

app.use(mongoSanitize());
app.use(express.static(path.join(__dirname, "public")));