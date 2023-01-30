import application from "./app";
import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: `./config.env` });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    autoIndex: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => console.log("DB connections successful"));

mongoose.set("strictQuery", true);

const port = process.env.PORT || 3000;

const server = application.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", () => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
