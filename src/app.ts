import express, { Application } from "express";
import { startDatabase } from "./database";
import { createDeveloper, createDeveloperInfo } from "./logic/developerLogic";
import {
  checkInvalidKeys,
  checkRequiredKeys,
  checkUniqueEmail,
} from "../src/middlewares/developerMiddleware";
import {
  checkIfDeveloperExists,
  checkInfoInvalidKeys,
  checkInfoRequiredKeys,
  checkUniqueInfo,
  checkOS,
} from "../src/middlewares/devInfoMiddleware";

const app: Application = express();
app.use(express.json());

app.post(
  "/developers",
  checkRequiredKeys,
  checkInvalidKeys,
  checkUniqueEmail,
  createDeveloper
);

app.post(
  "/developers/:id/infos",
  checkIfDeveloperExists,
  checkInfoRequiredKeys,
  checkInfoInvalidKeys,
  checkUniqueInfo,
  checkOS,
  createDeveloperInfo
);
app.get("/developers", createDeveloper);

app.listen(3000, async () => {
  console.log("Server is running!");
  await startDatabase();
});
