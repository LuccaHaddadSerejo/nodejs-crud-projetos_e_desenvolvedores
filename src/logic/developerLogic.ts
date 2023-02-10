import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";
import { resDev, resDevInfo, resDevWithInfo } from "../@types/types";

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
  RETURNING *;
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

  const queryResult: resDevInfo = await client.query(queryString);

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

const getAllDevelopers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const queryString = `
	SELECT
   		d.*,
      di."developerSince",
      di."preferredOS"
  FROM 
   		developers AS d 
  LEFT JOIN
   		developers_info AS di ON di.id = d."developerInfoID"
  `;

  const queryResult: resDevWithInfo = await client.query(queryString);

  return res.status(200).json(queryResult.rows);
};

const getDeveloperByid = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const id = req.params.id;

  const queryString = `
  SELECT
      d.*,
      di."developerSince",
      di."preferredOS"
  FROM 
      developers AS d 
  LEFT JOIN
      developers_info AS di ON di.id = d."developerInfoID"
  WHERE
      d.id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: resDevWithInfo = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
};

const updateDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;
  const dataKeys = Object.keys(req.developer.handledBody);
  const dataValues = Object.values(req.developer.handledBody);
  const queryString: string = format(
    `
    UPDATE 
      developers
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

  const queryResult: resDevWithInfo = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
};

const deleteDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;
  const queryString = `
  DELETE FROM 
      developers 
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
  createDeveloper,
  createDeveloperInfo,
  getAllDevelopers,
  getDeveloperByid,
  updateDeveloper,
  deleteDeveloper,
};
