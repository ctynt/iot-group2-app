import Taro from '@tarojs/taro'

const BASE_URL = 'http://localhost:8080' // TODO: 根据实际环境配置API地址

/**
 * 发送HTTP请求
 * @template T
 * @param {HttpConfig} config - 请求配置
 * @returns {Promise<T>}
 */
export const http = async (config) => {
  const { url, method = 'GET', data, params, headers = {} } = config

  // 添加token到请求头
  const token = Taro.getStorageSync('token')
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  // 构建完整URL
  let fullUrl = `${BASE_URL}${url}`
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value)
    })
    fullUrl += `?${searchParams.toString()}`
  }

  try {
    const response = await Taro.request({
      url: fullUrl,
      method,
      header: {
        'content-type': 'application/json',
        ...headers,
      },
      data: data ? JSON.stringify(data) : undefined,
    })

    const result = response.data

    if (response.statusCode !== 200) {
      throw new Error(result.msg || '请求失败')
    }

    if (result.code !== 0) {
      throw new Error(result.msg)
    }

    return result.data
  } catch (error) {
    console.error('请求错误:', error)
    throw error
  }
}
