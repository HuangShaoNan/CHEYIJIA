// 公共api模块
import request from '@/utils/request'

// 获取物流公司列表
export function getName(data) {
  return request({
    url: '/company/name',
    method: 'post',
    data
  })
}
