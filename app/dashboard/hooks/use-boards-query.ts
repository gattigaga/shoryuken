import axios from "axios";
import { useQuery } from "react-query";

import { Board } from "../../types/models";

type Response = Board[];

export const action = async (): Promise<Response> => {
  const res = await axios.get("/api/boards");
  const data = res.data.data;

  return data;
};

const useBoardsQuery = () => {
  return useQuery<Board[], Error>("boards", action);
};

export default useBoardsQuery;
