import { Request, Response, NextFunction } from "express";
import { QueryConfig } from "pg";
import { client } from "../database";
import { resDev } from "../@types/developerTypes";
import { iReqProject, resProject } from "../@types/projectsTypes";

const checkIfProjectDeveloperExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = +req.body.developerId;

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

const checkIfProjectExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = +req.params.id;

  const queryString = `
	SELECT 
      *
  FROM 
      projects AS p
  WHERE
      p."id" = $1
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: resProject = await client.query(queryConfig);

  if (queryResult.rowCount > 0) {
    return next();
  } else {
    return res.status(404).json({ message: "Project not found" });
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
      message: "At least one of those keys must be send.",
      keys: [
        "name",
        "description",
        "estimatedTime",
        "repository",
        "startDate",
        "developerId",
      ],
    });
  }
};

const checkProjectRequiredKeysPatch = async (
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
    "endDate",
    "developerId",
  ];

  const checkKeys = requiredKeys.some((key) => keys.includes(key));

  if (checkKeys) {
    return next();
  } else {
    res.status(400).json({
      message: "At least one of those keys must be send.",
      keys: [
        "name",
        "description",
        "estimatedTime",
        "repository",
        "startDate",
        "endDate",
        "developerId",
      ],
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

  const deleteKeys = (body: any, unwantedKeys: string[]): iReqProject => {
    unwantedKeys.map((key: string) => delete body[key]);
    return body;
  };

  const result: iReqProject = deleteKeys(req.body, filterKey);

  req.project = {
    handledProjectBody: result,
  };

  return next();
};

const checkProjectInvalidKeysPatch = async (
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
    "endDate",
    "developerId",
  ];
  const filterKey = keys.filter(
    (key: string) => requiredKeys.includes(key) === false
  );

  const deleteKeys = (body: any, unwantedKeys: string[]): iReqProject => {
    unwantedKeys.map((key: string) => delete body[key]);
    return body;
  };

  const result: iReqProject = deleteKeys(req.body, filterKey);

  req.project = {
    handledProjectBody: result,
  };

  return next();
};

export {
  checkIfProjectDeveloperExists,
  checkIfProjectExists,
  checkProjectRequiredKeys,
  checkProjectInvalidKeys,
  checkProjectRequiredKeysPatch,
  checkProjectInvalidKeysPatch,
};
