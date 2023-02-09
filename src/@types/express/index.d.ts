import * as express from "express";
import { createdDev, createdDevInfo } from "../types";

declare global {
  namespace Express {
    interface Request {
      developer: {
        handledBody: createdDev;
      };
      info: {
        handledDevInfo: createdDevInfo;
      };
    }
  }
}
