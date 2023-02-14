const application = require("./app.js");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// process.on("uncaughtException", (err) => {
//   process.exit(1);
// });

dotenv.config({ path: `./config.env` });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    dbName: `rs-clone`,
    useNewUrlParser: true,
    autoIndex: true,
    useUnifiedTopology: true,
  })
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

process.on("SIGTERM", () => {
  console.log("SIGTERM received. SHUTTING DOWN gracefully...");
  server.close(() => {
    console.log("Process terminated!");
  });
});