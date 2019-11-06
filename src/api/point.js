import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/service_point',
    method: 'post',
    data
  })
}

export function detail(data) {
  return request({
    url: '/service_point/info',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/service_point/add',
    method: 'post',
    data
  })
}

export function updateState(data) {
  return request({
    url: '/service_point/state',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/service_point/update',
    method: 'post',
    data
  })
}

export function staff(data) {
  return request({
    url: '/staff',
    method: 'post',
    data
  })
}

export function staffAdd(data) {
  return request({
    url: '/staff/add',
    method: 'post',
    data
  })
}

export function staffInfo(data) {
  return request({
    url: '/staff/info',
    method: 'post',
    data
  })
}

export function staffUpdate(data) {
  return request({
    url: '/staff/update',
    method: 'post',
    data
  })
}

export function goodsList(data) {
  return request({
    url: '/goods',
    method: 'post',
    data
  })
}

export function orderList(data) {
  return request({
    url: '/order',
    method: 'post',
    data
  })
}

export function rechargeAdd(data) {
  return request({
    url: '/recharge_point/add',
    method: 'post',
    data
  })
}

export function rechargeList(data) {
  return request({
    url: '/recharge_point',
    method: 'post',
    data
  })
}

