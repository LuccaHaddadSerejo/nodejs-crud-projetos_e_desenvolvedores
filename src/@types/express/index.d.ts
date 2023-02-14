import * as express from "express";
import {
  createdDev,
  createdDevInfo,
  createdProject,
  iReqTech,
} from "../developerTypes";

declare global {
  namespace Express {
    interface Request {
      developer: {
        handledBody: createdDev;
      };
      info: {
        handledDevInfo: createdDevInfo;
      };
      project: {
        handledProjectBody: createdProject;
      };
      tech: {
        handledTechBody: iReqTech;
      };
    }
  }
}
