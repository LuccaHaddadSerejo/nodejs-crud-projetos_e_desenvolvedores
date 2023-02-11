import { QueryResult } from "pg";

interface iReqDev {
  name?: string | undefined;
  email?: string | undefined;
  developerInfoID?: number | null | undefined;
}

interface iDev extends iReqDev {
  id: number;
}

type resDev = QueryResult<iDev>;
type createdDev = Omit<iDev, "id">;

interface iReqDevInfo {
  developerSince?: Date | null | undefined;
  preferredOS?: "Windows" | "Linux" | "MacOS" | null | undefined;
}

interface iDevInfo extends iReqDevInfo {
  id: number;
}

type resDevInfo = QueryResult<iDevInfo>;
type createdDevInfo = Omit<iDevInfo, "id">;

type devWithInfo = iDev & iReqDevInfo;
type resDevWithInfo = QueryResult<devWithInfo>;

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

type createdProject = Omit<iProject, "id">;
type resProject = QueryResult<iProject>;

interface iProjectTechnology extends iProject {
  technologyId: number | null;
  technologyName: string | null;
}

type resProjectTechnology = QueryResult<iProjectTechnology>;

export {
  iReqDev,
  iDev,
  resDev,
  createdDev,
  iReqDevInfo,
  resDevInfo,
  createdDevInfo,
  devWithInfo,
  resDevWithInfo,
  iReqProject,
  iProject,
  createdProject,
  resProject,
  iProjectTechnology,
  resProjectTechnology,
};
