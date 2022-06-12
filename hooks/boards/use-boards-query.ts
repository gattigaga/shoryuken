import axios from "axios";
import { useQuery } from "react-query";

type Board = {
  id: number;
  user_id: string;
  title: string;
  slug: string;
  created_at: string;
};

type Response = Board[];

export const getBoards = async (): Promise<Response> => {
  const res = await axios.get("/api/boards");
  const data = res.data.data;

  return data;
};

const useBoardsQuery = () => {
  return useQuery<Board[], Error>("boards", getBoards);
};

export default useBoardsQuery;
