import { Request, Response, NextFunction } from "express";
import { createdDev } from "../@types/types";
import { QueryConfig } from "pg";
import { client } from "../database";

const checkRequiredKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const keys = Object.keys(req.body);
  const requiredKeys = ["name", "email"];

  const checkKeys = requiredKeys.every((key) => keys.includes(key));

  if (checkKeys) {
    return next();
  } else {
    res.status(400).json({
      message: "missing one or both of required keys: name, email",
    });
  }
};

const checkInvalidKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const newBody: createdDev = {
    name: req.body.name,
    email: req.body.email,
  };

  req.developer = {
    treatedBody: newBody,
  };

  return next();
};

const checkUniqueEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const getEmail = req.developer.treatedBody.email;

  const queryString = `
  SELECT 
    email 
  FROM 
    developers
  WHERE
    email = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [getEmail],
  };

  const queryResult: any = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return next();
  } else {
    res.status(409).json({
      message: "Email already exists",
    });
  }
};

export { checkRequiredKeys, checkInvalidKeys, checkUniqueEmail };
