import { QueryResult } from "pg";

interface iReqDeveloper {
  name: string;
  email: string;
  iDeveloperInfo?: number | null;
}

interface iDeveloper extends iReqDeveloper {
  id: number;
}

type resDeveloper = QueryResult<iDeveloper>;
type createdDeveloper = Omit<iDeveloper, "id">;

export { iReqDeveloper, iDeveloper, resDeveloper, createdDeveloper };
