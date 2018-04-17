import * as types from './mutation-types';

export default {
  // sidebar 伸缩切换
  [types.SWITCH_SIDEBAR_COLLAPSE](state, { collapse }) {
    state.sidebarCollapse = collapse;
  },
  // 窗口更改时更新高度
  [types.UPDATE_DOCUMENT_CLIENT_HEIGHT](state, { height }) {
    state.documentClientHeight = height;
  },
  // 更新导航菜单
  [types.UPDATE_MENU_NAV_LIST](state, list) {
    state.menuNavList = list;
  },
  // 更新当前激活的菜单
  [types.UPDATE_MENU_NAV_ACTIVE](state, { menuId }) {
    state.menuActiveId = menuId;
  },

  // 添加tab标签页
  [types.ADD_CONTENT_TAB](state, tab) {
    state.contentTabs.push(tab);
  },
  // 更新所有标签页
  [types.UPDATE_CONTENT_TABS](state, tabs) {
    state.contentTabs = tabs;
  },
  // 删除tab标签
  [types.DELETE_CONTENT_TABS](state) {
    state.contentTabs = [];
  },
  // 更新当前被激活的tab
  [types.UPDATE_CONTENT_TABS_ACTIVE_NAME](state, { name }) {
    state.contentTabsActiveName = name;
  }
};
