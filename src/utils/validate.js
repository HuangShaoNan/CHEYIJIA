/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str 用户名为手机号
 * @returns {Boolean}
 */
export function validUsername(str) {
  return /^1(3|4|5|6|7|8|9)\d{9}$/.test(str)
}

/**
 * @param {string} str 密码为 6-20个字母、数字、下划线
 * @returns {Boolean}
 */
export function validPasswd(str) {
  return /^(\w){6,20}$/.test(str)
}
