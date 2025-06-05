import Taro from "@tarojs/taro";
import { http } from "../utils/http";

export function getDeviceList(params) {
  return http({
    url: "/iot/api/device/list",
    method: "GET",
    data: {
      page: params.page,
      limit: params.limit,
    },
  });
}

// 获取设备详情
export function getDeviceDetail(deviceId) {
  return http({
    url: `/iot/api/device/${deviceId}`,
    method: "GET",
  });
}

// 新增设备
export function addDevice(params) {
  return http({
    url: "/iot/api/device/save",
    method: "POST",
    data: params,
  });
}

// 删除设备
export function deleteDevice(id) {
  return http({
    url: `/iot/api/device/delete/${id}`,
    method: "POST",
  });
}
