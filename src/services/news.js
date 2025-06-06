import { http } from "../utils/http";

// 获取新闻列表
export const getNewsList = () => {
  return http({
    url: "/content/api/news/list",
    method: "GET",
  });
};
