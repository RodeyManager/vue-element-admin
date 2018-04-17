import request from '../../request';
import requestUrl from '../../requestUrl';
import requestParam from '../../requestParam';
import isInteger from 'lodash/isInteger';

// 获取字典列表
export function list(params) {
  return request({
    url: requestUrl('/data/dictionary/list'),
    method: 'get',
    params: requestParam(params, 'get')
  });
}

// 获取字典信息
export function info(id) {
  return request({
    url: requestUrl('/data/dictionary/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: requestParam({}, 'get')
  });
}

// 添加字典
export function add(params) {
  return request({
    url: requestUrl('/data/dictionary/save'),
    method: 'post',
    data: requestParam(params)
  });
}

// 修改字典
export function update(params) {
  return request({
    url: requestUrl('/data/dictionary/update'),
    method: 'post',
    data: requestParam(params)
  });
}

// 删除字典
export function del(params) {
  return request({
    url: requestUrl('/data/dictionary/delete'),
    method: 'post',
    data: requestParam(params, 'post', false)
  });
}
