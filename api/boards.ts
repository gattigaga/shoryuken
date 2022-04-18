import axios from "axios";

export const getBoards = () => {
  return axios.get("/api/boards");
};

export const postBoard = (body: { title: string }) => {
  return axios.post("/api/boards", body);
};
