import api from "./axios";

export const getGymList = (params) => {
  return api.get("/gym/gym-list", {
    params,
  });
};