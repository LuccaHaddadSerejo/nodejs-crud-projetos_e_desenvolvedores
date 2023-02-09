import * as express from "express";
import { createdDeveloper } from "../types";

declare global {
  namespace Express {
    interface Request {
      developer: {
        treatedBody: createdDeveloper;
      };
    }
  }
}
