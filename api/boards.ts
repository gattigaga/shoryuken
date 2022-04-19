import axios from "axios";

export const getBoards = async () => {
  const res = await axios.get("/api/boards");

  return res.data.data;
};

export const postBoard = async (body: { title: string }) => {
  const res = await axios.post("/api/boards", body);

  return res.data.data;
};
