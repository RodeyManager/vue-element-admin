  <template>
    <el-submenu
      v-if="menuNav.list && menuNav.list.length >= 1"
      class="has-submenu"
      :data-idx="menuNav.menuId + ''"
      :data-pid="menuNav.parentId + ''"
      :index="menuNav.menuId + ''" rel="menu">
      <template slot="title">
        <i :class="['site-sidebar__menu-icon', menuNav.icon ? menuNav.icon : 'fa fa-circle-o']"></i>
        <span>{{ menuNav.name }}</span>
      </template>
      <sub-menu-nav
        v-for="item in menuNav.list"
        :key="item.menuId"
        :menu-nav="item">
      </sub-menu-nav>
    </el-submenu>
    <el-menu-item
      v-else
      :index="menuNav.menuId + ''"
      :data-idx="menuNav.menuId + ''"
      :data-pid="menuNav.parentId + ''"
      @click="gotoRouteHandle(menuNav.url, menuNav.menuId)"  rel="menu">
      <i :class="['site-sidebar__menu-icon', menuNav.icon ? menuNav.icon : 'fa fa-circle-o']"></i>
      <span slot="title">{{ menuNav.name }}</span>
    </el-menu-item>
  </template>

  <script>
import SubMenuNav from '../sub-menu-nav';
import { getRouteNameByUrl } from '@/utils';
import { mapMutations, mapActions } from 'vuex';

export default {
  name: 'sub-menu-nav',
  props: {
    menuNav: Object,
    required: true,
  },
  components: {
    SubMenuNav
  },
  methods: {
    // 跳转到菜单导航对应路由
    gotoRouteHandle(url, menuId) {
      this.UPDATE_MENU_NAV_ACTIVE({ menuId });
      this.updateMenuActive({ $el: this.$el, menuId, state: this.$store.state, sidebarCollapse: false });
      menuId === '0' && this.closeMenu({ index: menuId });

      var routeName = getRouteNameByUrl(url);
      if (/\S/.test(routeName)) {
        this.$router.push({ name: routeName });
      }
    },
    ...mapActions(['updateMenuActive', 'closeMenu']),
    ...mapMutations(['UPDATE_MENU_NAV_ACTIVE'])
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
  left: 0px;
}
.el-menu-item.is-active:after {
  left: 3px;
  top: 50%;
  width: 8px;
  height: 8px;
  background-color: #8cc5ff;
  transform: translate(-6px, -50%) rotate(45deg);
}
</style>
