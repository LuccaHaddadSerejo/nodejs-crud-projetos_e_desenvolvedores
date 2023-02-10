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
};
