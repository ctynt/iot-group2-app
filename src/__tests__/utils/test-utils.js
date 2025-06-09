import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/store/user';

/**
 * 创建测试用的Redux store
 * @param {Object} preloadedState - 预加载的状态
 * @returns {Object} Redux store
 */
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState,
  });
}

/**
 * 使用Redux Provider包装组件进行渲染
 * @param {React.ReactElement} ui - 要渲染的React组件
 * @param {Object} options - 配置选项
 * @param {Object} options.preloadedState - 预加载的Redux状态
 * @param {Object} options.store - 自定义的Redux store
 * @param {Object} options.renderOptions - 传递给render的其他选项
 * @returns {Object} 渲染结果
 */
export function renderWithProvider(ui, {
  preloadedState = {},
  store = createTestStore(preloadedState),
  ...renderOptions
} = {}) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

/**
 * 模拟API响应
 * @param {Object} data - 响应数据
 * @param {number} status - HTTP状态码
 * @param {Object} headers - 响应头
 * @returns {Object} 模拟的响应对象
 */
export function mockApiResponse(data = {}, status = 200, headers = {}) {
  return {
    data: {
      code: status === 200 ? 0 : status,
      msg: status === 200 ? 'success' : 'error',
      data,
    },
    statusCode: status,
    header: headers,
  };
}

/**
 * 模拟API错误
 * @param {string} message - 错误信息
 * @param {number} status - HTTP状态码
 * @returns {Error} 模拟的错误对象
 */
export function mockApiError(message = 'API Error', status = 500) {
  const error = new Error(message);
  error.statusCode = status;
  return error;
}

/**
 * 模拟用户数据
 * @param {Object} overrides - 覆盖默认用户数据的字段
 * @returns {Object} 模拟的用户数据
 */
export function mockUserData(overrides = {}) {
  return {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    mobile: '13800138000',
    nickname: 'Test User',
    avatar: '',
    gender: 0,
    createTime: '2023-01-01T00:00:00.000Z',
    accessToken: 'fake-token-12345',
    ...overrides,
  };
}