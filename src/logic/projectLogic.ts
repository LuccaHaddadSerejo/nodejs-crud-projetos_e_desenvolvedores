import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
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

  const queryResult: any = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

export { createProject };
