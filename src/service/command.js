import { http } from "@/utils/http";

/**
 * 发送控制设备命令
 * @param {string} deviceId - 设备ID
 * @param {string} command - 控制命令
 * @returns {Promise<string>}
 */
export const controlDevice = (deviceId, command) => {
  return http({
    method: "POST",
    url: `/iot/api/command/controlDevice?deviceId=${deviceId}&command=${command}`,
  });
};

/**
 * 发送控制场景命令
 * @param {string} sceneId - 场景ID
 * @param {string} command - 控制命令
 * @returns {Promise<string>}
 */
export const controlScene = (sceneId, command) => {
  return http({
    method: "POST",
    url: `/iot/api/command/controlScene?sceneId=${sceneId}&command=${command}`,
  });
};

/**
 * 获取指定设备信息
 * @param {string} deviceId - 设备ID
 * @returns {Promise<Object>} 设备信息
 */
export const getDevice = (deviceId) => {
  return http({
    method: "GET",
    url: `/iot/api/device/${deviceId}`,
  });
};
