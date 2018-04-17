<template>
  <aside class="site-sidebar">
    <!-- 切换按钮 -->
    <i class="fa fa-outdent" :class="{ 'fa-indent': $store.state.sidebarCollapse }" @click="switchSidebarCollapseHandle()"></i>
    <div class="site-sidebar__inner" id="menu">
      <el-menu
        :default-active="menuNavActive"
        :collapse="$store.state.sidebarCollapse"
        :collapseTransition="false"
        :unique-opened="uniqueOpened"
        class="site-sidebar__menu"
        text-color="#fff"
        active-text-color="#8cc5ff"
        @close="closeMenuHandle">
        <el-menu-item index="1-1" data-idx="0" @click="gotoHome()">
          <i class="site-sidebar__menu-icon fa fa-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <sub-menu-nav
          v-for="menuNav in $store.state.menuNavList"
          :key="menuNav.menuId"
          :menu-nav="menuNav">
        </sub-menu-nav>
      </el-menu>
    </div>
    <!-- 切换按钮 -->
    <!-- <i class="fa fa-outdent" :class="{ 'fa-indent': $store.state.sidebarCollapse }" @click="switchSidebarCollapseHandle()"></i> -->
  </aside>
</template>

<script>
import SubMenuNav from '@/components/sub-menu-nav';
import API from '@/api';
import { mapMutations, mapActions } from 'vuex';
import { getRouteNameByUrl } from '@/utils';
import isEmpty from 'lodash/isEmpty';
export default {
  data() {
    return {
      menuNavActive: '1-1',
      uniqueOpened: true
    };
  },
  components: {
    SubMenuNav
  },
  watch: {
    $route: 'routeHandle'
  },
  created() {
    this.getMenuNavList().then(() => {
      this.routeHandle(this.$route);
    });
  },
  methods: {
    gotoHome(){
      this.$router.push({ name: 'home' });
      this.updateMenuActive({ menuId: '0', sidebarCollapse: false });
    },
    // 切换侧边栏, 水平折叠收起状态
    switchSidebarCollapseHandle() {
      this.SWITCH_SIDEBAR_COLLAPSE({ collapse: !this.$store.state.sidebarCollapse });
      this.updateMenuActive({ menuId: this.$store.state.menuActiveId || this.$store.state.contentTabsActiveName, state: this.$store.state });
    },
    closeMenuHandle(index) {
      this.closeMenu({ index });
    },
    // 获取菜单导航列表 / 权限
    getMenuNavList() {
      return API.sys.menu.nav().then(({ data }) => {
        if (data && data.code === 0) {
          this.UPDATE_MENU_NAV_LIST(data.menuList);
          sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'));
        } else {
          this.UPDATE_MENU_NAV_LIST([]);
          sessionStorage.setItem('permissions', '[]');
        }
      });
    },
    // 路由操作
    routeHandle(route) {
      if (/^\/n\/.*$/.test(route.path)) {
        var tab = this.$store.state.contentTabs.filter(item => item.name === route.name)[0];
        // tab不存在, 先添加
        if (isEmpty(tab)) {
          var menuNav = this.getMenuNavByRouteName(route.name, this.$store.state.menuNavList);
          if (!isEmpty(menuNav)) {
            tab = {
              id: menuNav.menuId,
              name: route.name,
              title: menuNav.name,
              type: (window.SITE_CONFIG.nestIframeRouteNameList || []).indexOf(route.name) !== -1 ? 'iframe' : 'module',
              url: menuNav.url,
              icon: menuNav.icon
            };
            this.ADD_CONTENT_TAB(tab);
          } else {
            return console.error('未能找到可用tab标签页！');
          }
        }
        this.menuNavActive = tab.id + '';
        this.UPDATE_MENU_NAV_ACTIVE({ menuId: tab.id });
        this.UPDATE_CONTENT_TABS_ACTIVE_NAME({ name: route.name });
      }
    },
    // 获取菜单导航, 根据路由名称
    getMenuNavByRouteName(name, menuNavList) {
      var temp = [];
      for (var i = 0; i < menuNavList.length; i++) {
        if (menuNavList[i].list && menuNavList[i].list.length >= 1) {
          temp = temp.concat(menuNavList[i].list);
        } else if (getRouteNameByUrl(menuNavList[i].url) === name) {
          return menuNavList[i];
        }
      }
      return temp.length >= 1 ? this.getMenuNavByRouteName(name, temp) : [];
    },
    ...mapActions(['updateMenuActive', 'closeMenu']),
    ...mapMutations(['SWITCH_SIDEBAR_COLLAPSE', 'UPDATE_MENU_NAV_LIST', 'ADD_CONTENT_TAB', 'UPDATE_CONTENT_TABS_ACTIVE_NAME', 'UPDATE_MENU_NAV_ACTIVE'])
  }
};
</script>

<style lang="scss" scoped>
.el-menu-item.is-active:before,
.el-menu-item.is-active:after {
  content: '';
  display: block;
  position: absolute;
}
.el-menu-item.is-active:before {
  width: 2px;
  height: 100%;
  background-color: #8cc5ff;
  left: 0;
}
.el-menu-item.is-active:after {
  left: 3px;
  top: 50%;
  width: 8px;
  height: 8px;
  background-color: #8cc5ff;
  transform: translate(-5px, -50%) rotate(45deg);
}
.site-sidebar {
  > i {
    color: rgba(255, 255, 255, 0.4);
    font-size: 22px;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
    cursor: pointer;
    text-align: center;
    margin: 0 auto;
    width: 100%;
    padding: 5px 0;
    background-color: #364b5d;
  }
}
</style>
