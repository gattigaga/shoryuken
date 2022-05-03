import axios from "axios";
import { useQuery } from "react-query";

type Response = any;

export const getBoards = async (): Promise<Response> => {
  const res = await axios.get("/api/boards");
  const data = res.data.data;

  return data;
};

const useBoardsQuery = () => useQuery("boards", getBoards);

export default useBoardsQuery;
