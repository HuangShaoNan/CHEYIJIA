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