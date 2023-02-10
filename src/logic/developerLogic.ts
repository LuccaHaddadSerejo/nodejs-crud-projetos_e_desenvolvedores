import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";
import {
  devWithInfo,
  resDev,
  resDevInfo,
  resDevWithInfo,
} from "../@types/types";

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
  const queryStringDevInfoNotNull = `
	SELECT
   		*
  FROM 
   		developers_info AS di 
  JOIN 
   		developers AS d ON di. id = d."developerInfoID";`;

  const queryStringDevInfoNull = `
  SELECT
   		*
  FROM  	
   		developers
  WHERE 
      "developerInfoID" IS NULL;
  `;

  const queryResultNotNull: resDevWithInfo = await client.query(
    queryStringDevInfoNotNull
  );
  const queryResultNull: resDevWithInfo = await client.query(
    queryStringDevInfoNull
  );

  const resFormattingNotNull = queryResultNotNull.rows.map(
    (dev: devWithInfo) =>
      (dev = {
        id: dev.id,
        name: dev.name,
        email: dev.email,
        developerInfoID: dev.developerInfoID,
        developerSince: dev.developerSince,
        preferredOS: dev.preferredOS,
      })
  );
  const resFormattingNull = queryResultNull.rows.map(
    (dev: devWithInfo) =>
      (dev = {
        id: dev.id,
        name: dev.name,
        email: dev.email,
        developerInfoID: dev.developerInfoID,
        developerSince: null,
        preferredOS: null,
      })
  );

  const completeRes = [...resFormattingNotNull, ...resFormattingNull];

  return res.status(200).json(completeRes);
};

const getDeveloperByid = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  let resDeposit: devWithInfo[] = [];
  const id: number = +req.params.id;
  const queryString = `
  SELECT
      *
  FROM
      developers
  WHERE
      id = $1;`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult = await client.query(queryConfig);
  const foundUser = queryResult.rows[0];

  if (foundUser.developerInfoID !== null) {
    const checkInfoId: number = +foundUser.developerInfoID;
    const queryString = `
	  SELECT
   		  *
    FROM 
   		  developers_info AS di 
    JOIN 
   		  developers AS d ON di. id = d."developerInfoID"
    WHERE 
        di.id = $1;`;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [checkInfoId],
    };

    const queryResult = await client.query(queryConfig);

    const resFormat = queryResult.rows.map(
      (dev: devWithInfo) =>
        (dev = {
          id: dev.id,
          name: dev.name,
          email: dev.email,
          developerInfoID: dev.developerInfoID,
          developerSince: dev.developerSince,
          preferredOS: dev.preferredOS,
        })
    );
    resDeposit = resFormat;
  } else {
    const queryString = `
    SELECT 
        *
    FROM
        developers
    WHERE
        id = $1
    `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [id],
    };

    const queryResult = await client.query(queryConfig);

    const resFormat = queryResult.rows.map(
      (dev: devWithInfo) =>
        (dev = {
          id: dev.id,
          name: dev.name,
          email: dev.email,
          developerInfoID: dev.developerInfoID,
          developerSince: null,
          preferredOS: null,
        })
    );

    resDeposit = resFormat;
  }

  return res.status(200).json(resDeposit);
};

const updateDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = +req.params.id;
  const dataKeys = Object.keys(req.developer.handledBody);
  const dataValues = Object.values(req.developer.handledBody);
  const queryString: string = format(
    `
    UPDATE developers
    SET (%I) = ROW(%L)
    WHERE id = $1
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

  const queryResult: resDev = await client.query(queryConfig);

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
