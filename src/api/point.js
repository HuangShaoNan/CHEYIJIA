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
