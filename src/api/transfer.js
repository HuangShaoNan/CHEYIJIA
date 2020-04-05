// 转账 api模块
import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/transfer',
    method: 'post',
    data
  })
}
export function getComList(data) {
  return request({
    url: '/company/transfer',
    method: 'post',
    data
  })
}
// 分公司转账
export function transferAdd(data) {
  return request({
    url: '/transfer/add',
    method: 'post',
    data
  })
}
