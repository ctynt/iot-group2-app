import { http } from "../utils/http";

// ... existing code ...
export const getNewsList = (params) => {
  return http({
    url: "/content/api/news/list",
    method: "GET",
    data: params,
  });
};
