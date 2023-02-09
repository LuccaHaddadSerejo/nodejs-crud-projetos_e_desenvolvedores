import { Request, Response, text } from "express";
import { QueryConfig, QueryParse } from "pg";
import format from "pg-format";
import { client } from "../database";
import { resDev, resDevInfo } from "../@types/types";

const createDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const dataKeys = Object.keys(req.developer.handledBody);
  const dataValues = Object.values(req.developer.handledBody);
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

  const QueryResult: resDev = await client.query(queryString);
  return res.status(201).json(QueryResult.rows[0]);
};

const createDeveloperInfo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const devId: number = +req.params.id;
  const dataKeys = Object.keys(req.info.handledDevInfo);
  const dataValues = Object.values(req.info.handledDevInfo);
  let queryString: string = format(
    `
      INSERT INTO 
        developers_info (%I)
      VALUES 
        (%L)
      RETURNING *;
      `,
    dataKeys,
    dataValues
  );

  const queryResult: any = await client.query(queryString);

  queryString = `
  UPDATE
      developers
  SET
      "developerInfoID" = $1
  WHERE   
      id = $2;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [queryResult.rows[0].id, devId],
  };

  await client.query(queryConfig);

  return res.status(201).json(queryResult.rows[0]);
};

export { createDeveloper, createDeveloperInfo };
