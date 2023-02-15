import { Request, Response, NextFunction } from "express";
import { QueryConfig } from "pg";
import { resProjectAndTech } from "../@types/projectsTypes";
import { iReqTech, iTech, resTech } from "../@types/techTypes";
import { client } from "../database";

const checkTechInvalidKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const keys = Object.keys(req.body);
  const requiredKeys = ["name"];

  const filterKey = keys.filter(
    (key: string) => requiredKeys.includes(key) === false
  );

  const deleteKeys = (body: any, unwantedKeys: string[]): iReqTech => {
    unwantedKeys.map((key: string) => delete body[key]);
    return body;
  };

  const result: iReqTech = deleteKeys(req.body, filterKey);

  req.tech = {
    handledTechBody: result,
  };

  return next();
};

const checkIfTechExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const values = Object.values(req.tech.handledTechBody);

  const requiredValues = [
    "JavaScript",
    "Python",
    "React",
    "Express.js",
    "HTML",
    "CSS",
    "Django",
    "PostgreSQL",
    "MongoDB",
  ];

  const checkValue: boolean = requiredValues.some((value: string) =>
    values.includes(value)
  );

  if (checkValue) {
    return next();
  } else {
    return res.status(404).json({
      message: "Technology not supported",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }
};

const checkIfParamTechExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const paramName: string = req.params.name;

  const requiredValues = [
    "JavaScript",
    "Python",
    "React",
    "Express.js",
    "HTML",
    "CSS",
    "Django",
    "PostgreSQL",
    "MongoDB",
  ];

  const checkValue: boolean = requiredValues.some(
    (value: string) => paramName === value
  );

  if (checkValue) {
    return next();
  } else {
    return res.status(404).json({
      message: "Technology not supported",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }
};

const checkIfTechExistsInProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const projectId: number = +req.params.id;
  const techName: string = req.params.name;

  const queryStringFindTech: string = `
  SELECT 
      * 
  FROM 
      technologies 
  WHERE 
      "name" = $1`;

  const queryConfigFindTech: QueryConfig = {
    text: queryStringFindTech,
    values: [techName],
  };

  const queryResultFindTech: resTech = await client.query(queryConfigFindTech);
  const foundTechId = +queryResultFindTech.rows[0].id;

  const queryString = `
  SELECT 
      *
  FROM
      projects_technologies 
  WHERE 
      "technologyId" = $1  
  AND 
      "projectId" = $2;`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [foundTechId, projectId],
  };

  const queryResult: resProjectAndTech = await client.query(queryConfig);

  if (queryResult.rowCount > 0) {
    return next();
  } else
    res.status(404).json({
      message: `Technology ${req.params.name} was not found in this project`,
    });
};

export {
  checkTechInvalidKeys,
  checkIfTechExists,
  checkIfTechExistsInProject,
  checkIfParamTechExists,
};
