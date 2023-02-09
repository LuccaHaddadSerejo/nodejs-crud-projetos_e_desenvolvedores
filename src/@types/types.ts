import { QueryResult } from "pg";

interface iReqDev {
  name: string;
  email: string;
  iDeveloperInfo?: number | null;
}

interface iDev extends iReqDev {
  id: number;
}

type resDev = QueryResult<iDev>;
type createdDev = Omit<iDev, "id">;

interface iReqDevInfo {
  developerSince: Date;
  preferredOS: "Windows" | "Linux" | "MacOS";
}

interface iDevInfo extends iReqDevInfo {
  id: number;
}

type resDevInfo = QueryResult<iDevInfo>;
type createdDevInfo = Omit<iDevInfo, "id">;

export {
  iReqDev,
  iDev,
  resDev,
  createdDev,
  iReqDevInfo,
  resDevInfo,
  createdDevInfo,
};
