import express, { Application } from "express";
import { startDatabase } from "./database";
import {
  createDeveloper,
  createDeveloperInfo,
  deleteDeveloper,
  getAllDevelopers,
  getDeveloperByid,
  updateDeveloper,
} from "./logic/developerLogic";
import { updateDeveloperInfo } from "../src/logic/developerInfoLogic";
import { createProject } from "../src/logic/projectLogic";
import {
  checkIfDeveloperExists,
  checkInvalidKeys,
  checkRequiredKeys,
  checkRequiredKeysPatch,
  checkUniqueEmail,
} from "../src/middlewares/developerMiddleware";
import {
  checkInfoInvalidKeys,
  checkInfoRequiredKeys,
  checkUniqueInfo,
  checkOS,
  checkInfoRequiredKeysPatch,
} from "../src/middlewares/devInfoMiddleware";
import {
  checkIfProjectDeveloperExists,
  checkProjectRequiredKeys,
  checkProjectInvalidKeys,
} from "../src/middlewares/projectMiddlewares";

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

app.post(
  "/projects",
  checkIfProjectDeveloperExists,
  checkProjectRequiredKeys,
  checkProjectInvalidKeys,
  createProject
);

app.get("/developers", getAllDevelopers);

app.get("/developers/:id", checkIfDeveloperExists, getDeveloperByid);

app.patch(
  "/developers/:id",
  checkIfDeveloperExists,
  checkRequiredKeysPatch,
  checkInvalidKeys,
  checkUniqueEmail,
  updateDeveloper
);

app.patch(
  "/developers/:id/infos",
  checkIfDeveloperExists,
  checkInfoRequiredKeysPatch,
  checkInfoInvalidKeys,
  checkOS,
  updateDeveloperInfo
);

app.delete("/developers/:id", checkIfDeveloperExists, deleteDeveloper);

app.listen(3000, async () => {
  console.log("Server is running!");
  await startDatabase();
});
