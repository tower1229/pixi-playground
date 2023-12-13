import instance from "./axiosInstance";

export const upload = (params: { content: string }) => {
  return instance.post(`/api/upload`, params);
};
