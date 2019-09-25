// 司机管理 api模块
import request from '@/utils/request'

/**
 * @info list模块 获取列表
 * @param data name(可为空) page_index page_size
 * @returns
 */
export function getDriverList(data) {
  return request({
    url: '/driver',
    method: 'post',
    data
  })
}
// 新增司机
export function add(data) {
  return request({
    url: '/driver/add',
    method: 'post',
    data
  })
}
// 获取司机信息
export function detail(data) {
  return request({
    url: '/driver/info',
    method: 'post',
    data
  })
}
// 修改司机信息
export function update(data) {
  return request({
    url: '/driver/update',
    method: 'post',
    data
  })
}
// 加注卡充值
export function rechargeCardAdd(data) {
  return request({
    url: '/recharge_card/add',
    method: 'post',
    data
  })
}
// 加注卡充值记录
export function rechargeCard(data) {
  return request({
    url: '/recharge_card',
    method: 'post',
    data
  })
}

// 查询卡片类型
export function QueryDriverCard(data) {
  return request({
    url: '/driver_card',
    method: 'post',
    data
  })
}
