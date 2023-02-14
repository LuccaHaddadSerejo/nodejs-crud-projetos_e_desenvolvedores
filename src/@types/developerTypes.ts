import { QueryResult } from "pg";
import { iTech } from "./techTypes";

interface iReqDev {
  name?: string | undefined;
  email?: string | undefined;
  developerInfoID?: number | null | undefined;
}

interface iDev extends iReqDev {
  id: number;
}

interface iReqDevInfo {
  developerSince?: Date | null | undefined;
  preferredOS?: "Windows" | "Linux" | "MacOS" | null | undefined;
}

interface iDevInfo extends iReqDevInfo {
  id: number;
}

type createdDev = Omit<iDev, "id">;
type createdDevInfo = Omit<iDevInfo, "id">;
type devWithInfo = iDev & iReqDevInfo;
type devProjectAndTech = devWithInfo & iTech;

type resDev = QueryResult<iDev>;
type resDevInfo = QueryResult<iDevInfo>;
type resDevProjectAndTech = QueryResult<devProjectAndTech>;
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
  devProjectAndTech,
  resDevProjectAndTech,
};
