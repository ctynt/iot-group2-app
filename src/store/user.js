import { createSlice } from '@reduxjs/toolkit'

/**
 * @typedef {Object} UserState
 * @property {number} id - 用户ID
 * @property {string} mobile - 手机号
 * @property {string} email - 邮箱
 * @property {number} tenantId - 用户ID
 * @property {string} nickname - 昵称
 * @property {string} avatar - 头像
 * @property {number} gender - 性别
 * @property {string} createTime - 创建时间
 * @property {string} accessToken - 访问令牌
 */

/** @type {UserState} */
const initialState = {
  id: 0,
  mobile: '',
  email: '',
  nickname: '',
  tenantId: 10000,
  avatar: '',
  gender: 0,
  createTime: '',
  accessToken: ''
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * 设置用户信息
     * @param {UserState} state - 当前状态
     * @param {Object} action - Action对象
     * @param {UserState} action.payload - 用户信息
     */
    setUserInfo: (state, action) => {
      Object.assign(state, action.payload)
    },
    /**
     * 清除用户信息
     * @param {UserState} state - 当前状态
     */
    clearUserInfo: (state) => {
      Object.assign(state, initialState)
    }
  }
})

export const { setUserInfo, clearUserInfo } = userSlice.actions

export default userSlice.reducer
