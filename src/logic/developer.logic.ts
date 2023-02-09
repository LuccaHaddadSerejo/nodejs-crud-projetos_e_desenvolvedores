import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";
import { resDeveloper } from "../@types/types";

const createDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const dataKeys = Object.keys(req.developer.treatedBody);
  const dataValues = Object.values(req.developer.treatedBody);
  const queryString: string = format(
    `
      INSERT INTO 
        developers (%I)
      VALUES 
        (%L)
      RETURNING 
        *;
      `,
    dataKeys,
    dataValues
  );

  const QueryResult: resDeveloper = await client.query(queryString);
  return res.status(201).json(QueryResult.rows[0]);
};

export { createDeveloper };
