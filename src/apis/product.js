import axiosClient from "./axios-client";

export const apiGetListProduct = (params) =>
  axiosClient({
    url: "/products",
    method: "get",
    params,
  });
