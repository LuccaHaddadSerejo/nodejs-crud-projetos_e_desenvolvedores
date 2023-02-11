import { Request, Response, NextFunction } from "express";

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

  const deleteKeys = (body: any, unwantedKeys: string[]): any => {
    unwantedKeys.map((key: string) => delete body[key]);
    return body;
  };

  const result: any = deleteKeys(req.body, filterKey);

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

  const checkValue: boolean = requiredValues.some((value: string) =>
    requiredValues.includes(value)
  );
  console.log(checkValue);

  if (checkValue) {
    return next();
  } else {
    return res.status(404).json({
      message: "Technology not supported.",
      options: [
        "JavaScript",
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

export { checkTechInvalidKeys, checkIfTechExists };
