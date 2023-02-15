import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { resDevProjectAndTech } from "../@types/developerTypes";
import { resProject, resProjectTechnology } from "../@types/projectsTypes";
import { resTech } from "../@types/techTypes";
import { client } from "../database";

const createProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
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
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
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
	technologies AS t ON pt."technologyId" = t."id";`;

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

const insertTechnologyOnProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = +req.params.id;
  const bodyName: string = req.tech.handledTechBody.name;

  const queryStringFindTech: string = `SELECT * FROM technologies WHERE name = $1`;
  const queryConfigFindTech: QueryConfig = {
    text: queryStringFindTech,
    values: [bodyName],
  };
  const queryResultFindTech: resTech = await client.query(queryConfigFindTech);

  const queryStringFindProject: string = `SELECT id FROM projects WHERE id = $1`;
  const queryConfigFindProject: QueryConfig = {
    text: queryStringFindProject,
    values: [id],
  };
  const queryResultFindProject: resProject = await client.query(
    queryConfigFindProject
  );

  const foundProject = +queryResultFindProject.rows[0].id;
  const foundTech = +queryResultFindTech.rows[0].id;

  const date = new Date();

  const queryStringInsertData: string = `
    INSERT INTO 
        projects_technologies ("addedIn", "technologyId", "projectId") 
    VALUES 
        ($1, $2, $3)
    RETURNING *;
    `;

  const queryConfigInsertData: QueryConfig = {
    text: queryStringInsertData,
    values: [date, foundTech, foundProject],
  };

  await client.query(queryConfigInsertData);

  const queryString = `
    SELECT
        t."id" AS "technologyId",
        t."name" AS "technologyName",
        p."id" AS "projectId",
        p."name" AS "projectName",
        p."description" AS "projectDescription",
        p."repository" AS "projectRepository",
        p."startDate" AS "projectStartDate",
        p."endDate" AS "projectEndDate" 
    FROM
        projects AS p
    LEFT JOIN
        projects_technologies AS pt ON p."id" = pt."projectId"
    LEFT JOIN 
        technologies AS t ON t."id" = pt."technologyId"  
    WHERE
        p."id" = $1`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: resDevProjectAndTech = await client.query(queryConfig);

  return res.status(201).json(queryResult.rows);
};

const deleteTechFromProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
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
  DELETE FROM 
      projects_technologies 
  WHERE 
      "technologyId" = $1  
  AND 
      "projectId" = $2;`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [foundTechId, projectId],
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
  insertTechnologyOnProject,
  deleteTechFromProject,
};
