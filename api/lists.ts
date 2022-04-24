import axios from "axios";

export const getListsByBoardId = (boardId: string | number) => async () => {
  const res = await axios.get("/api/lists/", {
    params: {
      board_id: boardId,
    },
  });

  return res.data.data;
};

export const postList = async (body: {
  title: string;
  index: number;
  board_id: string | number;
}) => {
  const res = await axios.post("/api/lists", body);

  return res.data.data;
};

export const putListById =
  (id: string | number) => async (body: { title?: string; index?: number }) => {
    const res = await axios.put(`/api/lists/${id}`, body);

    return res.data.data;
  };

export const deleteListById = (id: string | number) => async () => {
  const res = await axios.delete(`/api/lists/${id}`);

  return res.data.data;
};
