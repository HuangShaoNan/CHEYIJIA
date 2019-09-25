// 公司员工管理 api模块
import request from '@/utils/request'

/**
 * @info list模块 获取列表
 * @param data name(可为空) page_index page_size
 * @returns
 */
export function getList(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

// 添加
export function add(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

// 修改
export function update(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo(data) {
  return request({
    url: '/user/info',
    method: 'post',
    data
  })
}
