import express, { Application } from "express";
import { startDatabase } from "./database";
import { createDeveloper } from "./logic/developerLogic";
import {
  checkInvalidKeys,
  checkRequiredKeys,
  checkUniqueEmail,
} from "../src/middlewares/developerMiddleware";

const app: Application = express();
app.use(express.json());

app.post(
  "/developers",
  checkRequiredKeys,
  checkInvalidKeys,
  checkUniqueEmail,
  createDeveloper
);
app.get("/developers", createDeveloper);

app.listen(3000, async () => {
  console.log("Server is running!");
  await startDatabase();
});
