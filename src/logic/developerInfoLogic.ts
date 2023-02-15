import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";
import { resDev, resDevInfo } from "../@types/developerTypes";

const updateDeveloperInfo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = +req.params.id;
  const dataKeys = Object.keys(req.info.handledDevInfo);
  const dataValues = Object.values(req.info.handledDevInfo);

  const queryStringFindDev = `
  SELECT 
      *
  FROM
      developers
  WHERE 
      id = $1`;

  const queryConfigFindDev: QueryConfig = {
    text: queryStringFindDev,
    values: [id],
  };

  const queryResultFindDev: resDev = await client.query(queryConfigFindDev);

  const foundDev = queryResultFindDev.rows[0];

  const infoID = foundDev.developerInfoID;

  const queryString: string = format(
    `
      UPDATE 
          developers_info
      SET (%I) = ROW(%L)
      WHERE 
          id = $1
      RETURNING *;
      `,
    dataKeys,
    dataValues
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [infoID],
  };

  const queryResult: resDevInfo = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
};

export { updateDeveloperInfo };
