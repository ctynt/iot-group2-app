import Taro from "@tarojs/taro";

const BASE_URL = process.env.TARO_APP_API_BASE_URL || 'http://localhost:8080';

/**
 * 通用 HTTP 请求函数
 * @template T
 * @param {HttpConfig} config - 请求配置
 * @returns {Promise<T>}
 */
export const http = async (config) => {
  const { url, method = 'GET', data, params, headers = {} } = config;

  // 获取 token
  const token = Taro.getStorageSync('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // 构建完整 URL（含 query 参数）
  let fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    fullUrl += `?${searchParams.toString()}`;
  }

  try {
    const response = await Taro.request({
      url: fullUrl,
      method,
      header: {
        'content-type': 'application/json',
        ...headers,
      },
      data,
    });

    const result = response.data;

    // 状态码异常处理
    if (response.statusCode < 200 || response.statusCode >= 300) {
      Taro.showToast({ icon: 'error', title: result.msg || '请求失败' });
      throw new Error(result.msg || '请求失败');
    }

    // 自定义业务码处理
    if (result.code === 401) {
      Taro.showToast({ icon: 'error', title: result.msg || '未登录' });
      Taro.navigateTo({ url: '/pages/login/index' });
      throw new Error('未登录');
    } else if (result.code !== 0) {
      Taro.showToast({ icon: 'error', title: result.msg || '请求错误' });
      throw new Error(result.msg || '请求错误');
    }

    return result.data;
  } catch (error) {
    console.error('请求错误:', error);
    Taro.showToast({ icon: 'none', title: error.message || '网络异常' });
    throw error;
  }
};

/**
 * 请求拦截器：处理 baseURL 拼接和 token 注入
 */
const httpInterceptor = (chain) => {
  const requestParams = chain.requestParams;

  if (!requestParams.url.startsWith('http')) {
    requestParams.url = BASE_URL + requestParams.url;
  }

  const token = Taro.getStorageSync('token');
  if (token) {
    requestParams.header = {
      ...requestParams.header,
      Authorization: `Bearer ${token}`,
    };
  }

  return chain.proceed(requestParams).then((res) => res);
};

Taro.addInterceptor(httpInterceptor);
