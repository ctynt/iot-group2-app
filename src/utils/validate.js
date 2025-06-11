/**
 * 验证手机号格式
 * @param {string} mobile - 手机号
 * @returns {boolean} 是否是有效的手机号
 */
export const isPhoneAvailable= (mobile) => {
  return /^1[3-9]\d{9}$/.test(mobile)
}

/**
 * 验证密码格式（数字或字母，长度不少于6位）
 * @param {string} password - 密码
 * @returns {boolean} 是否是有效的密码
 */
export const isValidPassword = (password) => {
  return /^[A-Za-z0-9]{6,}$/.test(password)
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱
 * @returns {boolean} 是否是有效的邮箱
 */
export const isEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

/**
 * 验证短信验证码格式（4位数字）
 * @param {string} code - 验证码
 * @returns {boolean} 是否是有效的验证码
 */
export const isCodeAvailable = (code) => {
  return /^\d{4}$/.test(code)
}
