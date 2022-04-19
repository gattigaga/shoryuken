import axios from "axios";

export const getBoards = async () => {
  const res = await axios.get("/api/boards");

  return res.data.data;
};

export const postBoard = async (body: { title: string }) => {
  const res = await axios.post("/api/boards", body);

  return res.data.data;
};

export const getBoardById = (id: string | number) => async () => {
  const res = await axios.get(`/api/boards/${id}`);

  return res.data.data;
};

export const putBoardById =
  (id: string | number) => async (body: { title: string }) => {
    const res = await axios.put(`/api/boards/${id}`, body);

    return res.data.data;
  };
