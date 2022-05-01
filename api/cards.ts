import axios from "axios";

export const getCardsByListId = async (payload: {
  list_id: string | number;
}) => {
  const res = await axios.get("/api/cards/", {
    params: {
      list_id: payload.list_id,
    },
  });

  return res.data.data;
};

export const postCard = async (payload: {
  body: {
    title: string;
    list_id: string | number;
  };
}) => {
  const res = await axios.post("/api/cards", payload.body);

  return res.data.data;
};

export const putCardById = async (payload: {
  id: string | number;
  body: {
    title?: string;
    description?: string;
    index?: number;
  };
}) => {
  const res = await axios.put(`/api/cards/${payload.id}`, payload.body);

  return res.data.data;
};

export const deleteCardById = async (payload: { id: string | number }) => {
  const res = await axios.delete(`/api/cards/${payload.id}`);

  return res.data.data;
};
