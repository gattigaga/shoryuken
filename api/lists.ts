import axios from "axios";

export const getListsByBoardId = async (payload: {
  board_id: string | number;
}) => {
  const res = await axios.get("/api/lists/", {
    params: {
      board_id: payload.board_id,
    },
  });

  return res.data.data;
};

export const postList = async (payload: {
  body: {
    title: string;
    board_id: string | number;
  };
}) => {
  const res = await axios.post("/api/lists", payload.body);

  return res.data.data;
};

export const putListById = async (payload: {
  id: string | number;
  body: {
    title?: string;
    index?: number;
  };
}) => {
  const res = await axios.put(`/api/lists/${payload.id}`, payload.body);

  return res.data.data;
};

export const deleteListById = async (payload: { id: string | number }) => {
  const res = await axios.delete(`/api/lists/${payload.id}`);

  return res.data.data;
};
