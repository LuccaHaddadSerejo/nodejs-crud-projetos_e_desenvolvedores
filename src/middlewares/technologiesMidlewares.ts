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
  const transformValues = values.map((value: any) => value.toLowerCase());

  const requiredValues = [
    "Python",
    "Javascript",
    "MongoDB",
    "PostgreSQL",
    "HTML",
    "CSS",
    "HTML",
    "React",
    "Express.js",
  ];
  const transformRequiredValues = requiredValues.map((value: string) =>
    value.toLowerCase()
  );

  const checkValue: string | undefined = transformRequiredValues.find(
    (value: string) => value === transformValues[0]
  );

  if (checkValue!.length > 0) {
    return next();
  } else {
    return res.status(404).json({
      message: "Technology not supported",
      options: [
        "Javascript",
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
  const value: string = req.params.name;
  const transformValue = value.toLowerCase();

  const requiredValues = [
    "Python",
    "Javascript",
    "MongoDB",
    "PostgreSQL",
    "HTML",
    "CSS",
    "HTML",
    "React",
    "Express.js",
  ];
  const transformRequiredValues = requiredValues.map((value: string) =>
    value.toLowerCase()
  );

  const checkValue: string | undefined = transformRequiredValues.find(
    (value: string) => value === transformValue
  );

  if (checkValue!.length > 0) {
    return next();
  } else {
    return res.status(404).json({
      message: "Technology not supported",
      options: [
        "Javascript",
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
  const formatFirstLetter: string = techName[0].toUpperCase();
  const sliceName: string = techName.slice(1);
  const formatedName: string = formatFirstLetter.concat(sliceName);

  const queryStringFindTech: string = `
  SELECT 
      * 
  FROM 
      technologies 
  WHERE 
      "name" = $1`;

  const queryConfigFindTech: QueryConfig = {
    text: queryStringFindTech,
    values: [formatedName],
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
