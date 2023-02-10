import { Request, Response, NextFunction } from "express";
import { createdDevInfo, resDev } from "../@types/types";
import { QueryConfig } from "pg";
import { client } from "../database";

const checkInfoRequiredKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const keys = Object.keys(req.body);
  const requiredKeys = ["developerSince", "preferredOS"];

  const checkKeys = requiredKeys.every((key) => keys.includes(key));

  if (checkKeys) {
    return next();
  } else {
    res.status(400).json({
      message:
        "missing one or both of required keys: developerSince, preferredOS",
    });
  }
};

const checkInfoRequiredKeysPatch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const keys = Object.keys(req.body);
  const requiredKeys = ["developerSince", "preferredOS"];

  const checkKeys = requiredKeys.some((key) => keys.includes(key));

  if (checkKeys) {
    return next();
  } else {
    res.status(400).json({
      message: "missing one of the required keys: developerSince, preferredOS",
    });
  }
};

const checkInfoInvalidKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  if (req.body.developerSince && req.body.preferredOS) {
    const newBody: createdDevInfo = {
      developerSince: req.body.developerSince,
      preferredOS: req.body.preferredOS,
    };
    req.info = {
      handledDevInfo: newBody,
    };
    return next();
  } else if (req.body.developerSince && req.body.preferredOS === undefined) {
    const newBody: createdDevInfo = {
      developerSince: req.body.developerSince,
    };
    req.info = {
      handledDevInfo: newBody,
    };
    return next();
  } else if (req.body.developerSince === undefined && req.body.preferredOS) {
    const newBody: createdDevInfo = {
      preferredOS: req.body.preferredOS,
    };
    req.info = {
      handledDevInfo: newBody,
    };
    return next();
  }
};

const checkUniqueInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = +req.params.id;

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

  if (queryResult.rows[0].developerInfoID) {
    res.status(400).json({
      message: "Developer info are already registered",
    });
  } else {
    return next();
  }
};

const checkOS = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const data = req.info.handledDevInfo;
  const OsOptions = ["Windows", "Linux", "MacOS"];
  const checkOsData = OsOptions.includes(data.preferredOS!);

  if (checkOsData) {
    return next();
  } else {
    res.status(400).json({
      message: "invalid 'OS' option",
      options: ["Windows", "Linux", "MacOs"],
    });
  }
};

export {
  checkInfoRequiredKeys,
  checkInfoRequiredKeysPatch,
  checkInfoInvalidKeys,
  checkUniqueInfo,
  checkOS,
};
