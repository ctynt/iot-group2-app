import { http } from "@/utils/http";

/**
 * @typedef {Object} MobileLoginDTO
 * @property {string} mobile - 手机号
 * @property {string} code - 验证码
 */

/**
 * @typedef {Object} MobileLoginVO
 * @property {number} id - 用户ID
 * @property {string} mobile - 手机号
 * @property {number} tenantId 租户Id
 * @property {string} accessToken - 访问令牌
 */

/**
 * @typedef {Object} UserVO
 * @property {number} id - 用户ID
 * @property {string} mobile - 手机号
 * @property {string} email - 邮箱
 * @property {string} nickname - 昵称
 * @property {number} tenantId 租户Id
 * @property {string} avatar - 头像
 * @property {number} gender - 性别
 * @property {string} createTime - 创建时间
 */

/**
 * @typedef {Object} AccountLoginDTO
 * @property {string} username - 用户名
 * @property {string} password - 密码
 */

/**
 * @typedef {Object} AccountLoginVO
 * @property {number} id - 用户ID
 * @property {string} username - 用户名
 * @property {string} accessToken - 访问令牌
 * @property {number} tenantId 租户Id
 */

/**
 * @typedef {Object} UserDTO
 * @property {number} id - 用户ID
 * @property {string} username - 用户名
 * @property {string} nickname - 昵称
 * @property {string} avatar - 头像
 * @property {string} mobile - 手机号
 * @property {string} email - 邮箱
 * @property {number} gender - 性别
 * @property {number} communityId - 社区ID
 * @property {number} tenantId - 租户ID
 */

/**
 * 发送验证码
 * @param {string} mobile - 手机号
 * @returns {Promise<null>}
 */
export const sendCode = (mobile) => {
  return http({
    method: "POST",
    url: `/api/auth/send/code?mobile=${mobile}`,
  });
};

/**
 * 手机号验证码登录
 * @param {MobileLoginDTO} data - 登录数据
 * @returns {Promise<MobileLoginVO>}
 */
export const mobileLogin = (data) => {
  return http({
    method: "POST",
    url: `/api/auth/mobile`,
    data,
  });
};

/**
 * 账号密码登录
 * @param {AccountLoginDTO} data - 登录数据
 * @returns {Promise<AccountLoginVO>}
 */
export const accountLogin = (data) => {
  return http({
    method: "POST",
    url: `/api/auth/login`,
    data,
  });
};

/**
 * 获取当前登录用户信息
 * @returns {Promise<UserVO>}
 */
export const getUserInfo = () => {
  return http({
    method: "GET",
    url: `/api/user/info`,
  });
};

/**
 * 更新用户信息
 * @param {UserDTO} data - 用户数据
 * @returns {Promise<string>}
 */
export const updateUser = (data) => {
  return http({
    method: "PUT",
    url: `/api/user/update`,
    data,
  });
};

/**
 * 用户注册
 * @param {UserDTO} data - 用户注册数据
 * @returns {Promise<string>}
 */
export const register = (data) => {
  return http({
    method: "POST",
    url: `/api/user/register`,
    data,
  });
};
