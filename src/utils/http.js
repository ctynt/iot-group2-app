import Taro from "@tarojs/taro";

const baseURL = process.env.TARO_APP_API_BASE_URL;

export const http = (options) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      ...options,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (res.data.code === 401) {
            Taro.showToast({
              icon: "error",
              title: res.data.msg || "请求错误",
            });
            Taro.navigateTo({ url: "/pages/login/index" });
            reject(res);
          } else if (res.data.code === 0) {
            resolve(res.data);
          } else {
            Taro.showToast({
              icon: "error",
              title: res.data.msg || "请求错误",
            });
          }
        } else {
          Taro.showToast({
            icon: "error",
            title: res.data.msg || "请求错误",
          });
          reject(res);
        }
      },
      fail(err) {
        Taro.showToast({
          icon: "none",
          title: "网络错误",
        });
        reject(err);
      },
    });
  });
};

const httpInterceptor = function (chain) {
  const requestParams = chain.requestParams;
  const { url } = requestParams;

  if (!url.startsWith("http")) {
    requestParams.url = baseURL + url;
  }

  requestParams.header = {
    ...requestParams.header,
  };

  const token = Taro.getStorageSync("token") || "no-token";
  if (token) {
    requestParams.header.Authorization = token;
  }
  return chain.proceed(requestParams).then((res) => {
    return res;
  });
};

Taro.addInterceptor(httpInterceptor);
