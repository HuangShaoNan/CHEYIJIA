// 充值 api模块
import request from '@/utils/request'

/**
 * @info list模块 获取列表
 * @param data name(可为空) page_index page_size
 * @returns
 */
export function getRechargeList(data) {
  return request({
    url: '/recharge',
    method: 'post',
    data
  })
}

// 确认充值
export function verify(data) {
  return request({
    url: '/recharge/verify',
    method: 'post',
    data
  })
}

// 物流公司 新增充值
export function rechargeAdd(data) {
  return request({
    url: '/recharge/add',
    method: 'post',
    data
  })
}

// 物流公司 开具发票
export function openInvoice(data) {
  return request({
    url: '/recharge/invoice',
    method: 'post',
    data
  })
}

