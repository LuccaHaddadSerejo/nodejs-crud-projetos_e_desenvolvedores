import { QueryResult } from "pg";
import { iTech } from "./techTypes";

interface iReqProject {
  name?: string | undefined;
  description?: string | undefined;
  estimatedTime?: string | undefined;
  repository?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | null | undefined;
  developerId?: string | undefined;
}

interface iProject extends iReqProject {
  id: number;
}

interface iProjectTechnology extends iProject {
  technologyId: number | null;
  technologyName: string | null;
}

type createdProject = Omit<iProject, "id">;
type projectAndTech = iTech & iProject;

type resProject = QueryResult<iProject>;
type resProjectTechnology = QueryResult<iProjectTechnology>;
type resProjectAndTech = QueryResult<projectAndTech>;

export {
  iReqProject,
  iProject,
  createdProject,
  projectAndTech,
  resProject,
  resProjectTechnology,
  resProjectAndTech,
};
