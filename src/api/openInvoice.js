// 开票 api模块
import request from '@/utils/request'

/**
 * @info list模块 获取列表
 * @param data name(可为空) page_index page_size
 * @returns
 */
export function getInvoiceList(data) {
  return request({
    url: '/recharge/invoice_list',
    method: 'post',
    data
  })
}

// 确认开票
export function verifyInvoice(data) {
  return request({
    url: '/recharge/verify_invoice',
    method: 'post',
    data
  })
}
