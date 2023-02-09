import { Request, Response, NextFunction } from "express";
import { createdDevInfo } from "../@types/types";
import { QueryConfig } from "pg";
import { client } from "../database";

const checkInfoRequiredKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const keys = Object.keys(req.body);
  const requiredKeys = ["developerSince", "preferredOS"];

  const checkKeys = requiredKeys.every((key) => keys.includes(key));

  if (checkKeys) {
    return next();
  } else {
    res.status(400).json({
      message:
        "missing one or both of required keys: developerSince, preferredOS",
    });
  }
};

const checkInfoInvalidKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const newBody: createdDevInfo = {
    developerSince: req.body.developerSince,
    preferredOS: req.body.preferredOS,
  };

  return next();
};

// const checkUniqueInfo = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<Response | void> => {
//   const getEmail = req.developer.treatedBody.email;

//   const queryString = `
//   SELECT
//     email
//   FROM
//     developers
//   WHERE
//     email = $1
//     `;

//   const queryConfig: QueryConfig = {
//     text: queryString,
//     values: [getEmail],
//   };

//   const queryResult: any = await client.query(queryConfig);

//   if (queryResult.rowCount === 0) {
//     return next();
//   } else {
//     res.status(409).json({
//       message: "Email already exists",
//     });
//   }
// };

export { checkInfoRequiredKeys, checkInfoInvalidKeys };
