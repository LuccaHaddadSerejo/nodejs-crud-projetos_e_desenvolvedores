import { Request, Response, NextFunction } from "express";
import { QueryConfig } from "pg";
import { client } from "../database";
import { resDev } from "../@types/types";

const checkIfProjectDeveloperExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = req.body.developerId;

  const queryString = `
  SELECT
      *
  FROM
      developers
  WHERE 
      id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: resDev = await client.query(queryConfig);

  if (queryResult.rowCount > 0) {
    return next();
  } else {
    res.status(400).json({
      message: "Developer not found",
    });
  }
};

const checkProjectRequiredKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const keys = Object.keys(req.body);
  const requiredKeys = [
    "name",
    "description",
    "estimatedTime",
    "repository",
    "startDate",
    "developerId",
  ];

  const checkKeys = requiredKeys.every((key) => keys.includes(key));

  if (checkKeys) {
    return next();
  } else {
    res.status(400).json({
      message: `missing one or multiple of the required keys: ${requiredKeys}`,
    });
  }
};

const checkProjectInvalidKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const keys = Object.keys(req.body);
  const requiredKeys = [
    "name",
    "description",
    "estimatedTime",
    "repository",
    "startDate",
    "developerId",
  ];
  const filterKey = keys.filter(
    (key: string) => requiredKeys.includes(key) === false
  );

  const deleteKeys = (body: any, unwantedKeys: string[]): any => {
    unwantedKeys.map((key: string) => delete body[key]);
    return body;
  };

  const result: any = deleteKeys(req.body, filterKey);

  req.project = {
    handledProjectBody: result,
  };

  return next();
};

export {
  checkIfProjectDeveloperExists,
  checkProjectRequiredKeys,
  checkProjectInvalidKeys,
};
