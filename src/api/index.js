import * as common from './modules/common';
import * as user from './modules/sys/user';
import * as role from './modules/sys/role';
import * as menu from './modules/sys/menu';
import * as log from './modules/sys/log';
import * as config from './modules/sys/config';
import * as oss from './modules/sys/oss';
import * as schedule from './modules/sys/schedule';

import * as dictionary from './modules/data/dictionary';

export default {
  common, // 公共
  // 系统基础管理
  sys: {
    user, // 管理员管理
    role, // 角色管理
    menu, // 菜单管理
    log, // 系统日志
    config, // 参数管理
    oss, // 文件服务
    schedule // 定时任务
  },
  // 基础数据管理
  data: {
    dictionary
  }
};
