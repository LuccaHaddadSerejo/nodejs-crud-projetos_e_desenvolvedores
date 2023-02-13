import express, { Application } from "express";
import { startDatabase } from "./database";
import {
  createDeveloper,
  createDeveloperInfo,
  deleteDeveloper,
  getAllDevelopers,
  getDeveloperAndProjects,
  getDeveloperByid,
  updateDeveloper,
} from "./logic/developerLogic";
import { updateDeveloperInfo } from "../src/logic/developerInfoLogic";
import {
  createProject,
  deleteProject,
  deleteTechFromProject,
  getAllProjects,
  getProjectById,
  insertTechnologyOnProject,
  updateProject,
} from "../src/logic/projectLogic";
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
  checkIfProjectExists,
  checkProjectRequiredKeysPatch,
  checkProjectInvalidKeysPatch,
} from "../src/middlewares/projectMiddlewares";
import {
  checkIfTechExists,
  checkTechInvalidKeys,
} from "../src/middlewares/technologiesMidleware";

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

app.post(
  "/projects/:id/technologies",
  checkIfProjectExists,
  checkTechInvalidKeys,
  checkIfTechExists,
  insertTechnologyOnProject
);

app.get("/developers", getAllDevelopers);

app.get("/developers/:id", checkIfDeveloperExists, getDeveloperByid);

app.get(
  "/developers/:id/projects",
  checkIfDeveloperExists,
  getDeveloperAndProjects
);

app.get("/projects", getAllProjects);

app.get("/projects/:id", checkIfProjectExists, getProjectById);

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

app.patch(
  "/projects/:id",
  checkIfProjectExists,
  checkProjectRequiredKeysPatch,
  checkProjectInvalidKeysPatch,
  updateProject
);

app.delete("/developers/:id", checkIfDeveloperExists, deleteDeveloper);

app.delete("/projects/:id", checkIfProjectExists, deleteProject);

app.delete("/projects/:id/technologies/:name", deleteTechFromProject);

app.listen(3000, async () => {
  console.log("Server is running!");
  await startDatabase();
});
