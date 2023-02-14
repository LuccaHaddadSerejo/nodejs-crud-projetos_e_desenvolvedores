import { QueryResult } from "pg";

interface iReqTech {
  name: string;
}

interface iTech extends iReqTech {
  id: number;
}

type resTech = QueryResult<iTech>;

export { iReqTech, iTech, resTech };
