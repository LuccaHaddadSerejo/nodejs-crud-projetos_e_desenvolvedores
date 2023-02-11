import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { resProject, resProjectTechnology } from "../@types/types";
import { client } from "../database";

const createProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const dataKeys = Object.keys(req.project.handledProjectBody);
  const dataValues = Object.values(req.project.handledProjectBody);

  const queryString: string = format(
    `
    INSERT INTO 
        projects (%I)
    VALUES 
        (%L)
    RETURNING *;
    `,
    dataKeys,
    dataValues
  );

  const queryResult: resProject = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const getAllProjects = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const queryString = `
	SELECT 
	p."id" AS "projectId",
  p."name" AS "projectName",
  p."description" AS "projectDescription",
  p."estimatedTime" AS "projectEstimatedTime",
  p."repository" AS "projectRepository",
  p."startDate" AS "projectStartDate",
  p."endDate" AS "projectEndDate",
  p."developerId" AS "projectDeveloperId",
	pt."technologyId",
	t."name" AS "technologyName"
FROM 
	projects AS p	
LEFT JOIN	
	projects_technologies AS pt ON p."id" = pt."projectId"
LEFT JOIN 
	technologies AS t ON t."id" = pt."technologyId";`;

  const queryResult: resProjectTechnology = await client.query(queryString);

  return res.status(200).json(queryResult.rows);
};

const getProjectById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = +req.params.id;

  const queryString = `
	SELECT 
	p."id" AS "projectId",
  p."name" AS "projectName",
  p."description" AS "projectDescription",
  p."estimatedTime" AS "projectEstimatedTime",
  p."repository" AS "projectRepository",
  p."startDate" AS "projectStartDate",
  p."endDate" AS "projectEndDate",
  p."developerId" AS "projectDeveloperId",
	pt."technologyId",
	t."name" AS "technologyName"
FROM 
	projects AS p	
LEFT JOIN	
	projects_technologies AS pt ON p."id" = pt."projectId"
LEFT JOIN 
	technologies AS t ON t."id" = pt."technologyId"
  WHERE p."id" = $1`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: resProjectTechnology = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
};

const updateProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = +req.params.id;
  const dataKeys = Object.keys(req.project.handledProjectBody);
  const dataValues = Object.values(req.project.handledProjectBody);
  const queryString: string = format(
    `
      UPDATE 
        projects
      SET (%I) = ROW(%L)
      WHERE 
        id = $1
      RETURNING *;
      `,
    dataKeys,
    dataValues,
    id
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: resProject = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
};

const deleteProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = +req.params.id;
  const queryString = `
  DELETE FROM 
      projects 
  WHERE 
      id = $1 
  RETURNING *;`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return res.status(204).json();
};

export {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
