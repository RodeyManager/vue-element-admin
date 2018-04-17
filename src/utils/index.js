/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth(key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false;
}

/**
 * 获取路由名称, 根据url地址
 * @param {*} url
 */
export function getRouteNameByUrl(url) {
  let val = /.*\/(.*)\.html/.exec(url);
  return val && val.length >= 1 ? val[1] : '';
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate(data, id = 'id', pid = 'parentId') {
  var res = [];
  var temp = {};
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i];
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = [];
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1;
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1;
      temp[data[k][pid]]['children'].push(data[k]);
    } else {
      res.push(data[k]);
    }
  }
  return res;
}

export function treeDataTranslateExpandAll(data, id, pid) {
  const dataList = treeDataTranslate(data, id, pid),
    result = [];
  _res(dataList);
  function _res(ds) {
    ds.map(d => {
      result.push(d);
      const children = d.children;
      d['paddingLeft'] = (d['_level'] > 1 ? d['_level'] * 7 : 0) + 'px';
      if (children && children.length > 0) {
        d['visible'] = 'visible';
        d['iconExpand'] = 'el-icon-caret-bottom';
        _res(children);
      } else {
        d['visible'] = 'hidden';
        d['paddingLeft'] = (d['_level'] > 1 ? d['_level'] * 7 : 0) + 20 + 'px';
      }
      d.children = [];
    });
  }
  return result;
}

/**
 *
 * @param {Array} menuList 获取所有子目录列表
 */
export function transformMenu(menuList) {
  if (!menuList || menuList.length === 0) return [];
  var result = [];

  _res(menuList);

  function _res(ds) {
    ds.map(d => {
      d.value = d.name;
      const children = d.list;
      if (children && children.length > 0) {
        _res(children);
      } else {
        result.push(d);
      }
    });
  }
  return result;
}

/**
 * 获取字符串字节长度
 * @param {*} s
 */
export function getStringLength(s) {
  return s.replace(/[\u4e00-\u9fa5\uff00-\uffff]/g, '**').length;
}

/**
 * 获取uuid
 */
export function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16) | 0 : 'r&0x3' | '0x8').toString(16);
  });
}
