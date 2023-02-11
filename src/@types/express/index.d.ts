import * as express from "express";
import {
  createdDev,
  createdDevInfo,
  createdProject,
  resProject,
} from "../types";

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
        handledProjectBody: resProject;
      };
      tech: {
        handledTechBody: any;
      };
    }
  }
}
