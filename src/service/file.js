import { http } from "@/utils/http";
import Taro from "@tarojs/taro";

/**
 * @typedef {Object} FileUploadResult
 * @property {string} url - 上传后的文件URL
 */

/**
 * 上传文件
 * @param {string} filePath - 要上传的文件路径
 * @returns {Promise<string>} - 返回上传后的文件URL
 */
export const uploadFile = (filePath) => {
  return new Promise((resolve, reject) => {
    Taro.uploadFile({
      url: "http://localhost:8080/content/api/file/upload", // 使用与http.js中相同的BASE_URL
      filePath: filePath,
      name: "file",
      header: {
        // 添加token到请求头
        Authorization: Taro.getStorageSync("token") || ""
      },
      success: (res) => {
        if (res.statusCode !== 200) {
          reject(new Error("上传失败"));
          return;
        }
        // 解析响应数据
        const result = JSON.parse(res.data);
        if (result.code !== 0) {
          reject(new Error(result.msg || "上传失败"));
          return;
        }
        resolve(result.data);
      },
      fail: (err) => {
        reject(new Error(err.errMsg || "上传失败"));
      }
    });
  });
};
