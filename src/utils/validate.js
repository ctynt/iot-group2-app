/**
 * 验证手机号格式
 * @param {string} mobile - 手机号
 * @returns {boolean} 是否是有效的手机号
 */
export const isMobile = (mobile) => {
  return /^1[3-9]\d{9}$/.test(mobile)
}

/**
 * 验证密码格式（至少包含数字和字母，长度8-20位）
 * @param {string} password - 密码
 * @returns {boolean} 是否是有效的密码
 */
export const isValidPassword = (password) => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(password)
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱
 * @returns {boolean} 是否是有效的邮箱
 */
export const isEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}