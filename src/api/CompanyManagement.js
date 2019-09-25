// 车易加 公司管理api模块
import request from '@/utils/request'

/**
 * @info list模块 获取列表
 * @param data name(可为空) page_index page_size
 * @returns
 */
export function getList(data) {
  return request({
    url: '/company',
    method: 'post',
    data
  })
}

// 添加
export function add(data) {
  return request({
    url: '/company/add',
    method: 'post',
    data
  })
}

// 获取详情
export function detail(data) {
  return request({
    url: '/company/info',
    method: 'post',
    data
  })
}

// 修改
export function update(data) {
  return request({
    url: '/company/update',
    method: 'post',
    data
  })
}
