import { http } from "../utils/http";
import Taro from "@tarojs/taro";

// 获取场景列表
export function getSceneList(params) {
  return http({
    url: "/iot/api/scene/list",
    method: "GET",
    data: {
      page: params.page,
      limit: params.limit,
      userId: params.userId,
    },
  });
}

// 获取场景详情
export function getSceneDetail(sceneId) {
  return http({
    url: `/iot/api/scene/${sceneId}`,
    method: "GET",
  });
}

// 新增场景
export function addScene(params) {
  return http({
    url: "/iot/api/scene/save",
    method: "POST",
    data: params,
  });
}

// 删除场景
// 删除场景
export function deleteScene(id) {
  return http({
    url: `/iot/api/scene/delete/${id}`,
    method: "POST",
  });
}

// 修改场景
export function editScene(params) {
  return http({
    url: "/iot/api/scene/edit",
    method: "POST",
    data: params,
  });
}
