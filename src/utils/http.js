import Taro from "@tarojs/taro";

const BASE_URL = "http://localhost:8080"; // TODO: 根据实际环境配置API地址

/**
 * 发送HTTP请求
 * @template T
 * @param {HttpConfig} config - 请求配置
 * @returns {Promise<T>}
 */
export const http = async (config) => {
  const { url, method = "GET", data, headers = {} } = config;

  // 添加token到请求头
  const token = Taro.getStorageSync("token");
  if (token) {
    headers.Authorization = ` ${token}`; // 添加 Bearer 前缀
  }

  try {
    const response = await Taro.request({
      url: `${BASE_URL}${url}`,
      method,
      header: {
        "content-type": "application/json",
        ...headers,
      },
      // GET 请求直接传入 data 对象，非 GET 请求才进行 JSON.stringify
      data: method.toUpperCase() === "GET" ? data : JSON.stringify(data),
    });

    const result = response.data;

    if (response.statusCode !== 200) {
      throw new Error(result.msg || "请求失败");
    }

    if (result.code !== 0) {
      throw new Error(result.msg);
    }

    return result.data;
  } catch (error) {
    console.error("请求错误:", error);
    throw error;
  }
};
