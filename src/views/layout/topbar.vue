<template>
  <header class="site-topbar">
    <div class="site-topbar__header">
      <h1 class="site-logo" @click="$router.push({ name: 'home' })">
        <!-- <a class="site-logo__lg" href="javascript:;"></a>
        <a class="site-logo__mini" href="javascript:;"></a> -->
        <a class="site-logo__lg" href="javascript:;"></a>
      </h1>
    </div>
    <div class="site-topbar__body clearfix">

      <!-- search -->
      <el-autocomplete
        class="site-topbar__autocomplete"
        v-model="searchWord"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
        size="mini"
        ref="searchInput"
        @focus="handleSearchFocus"
        @blur="handleSearchFocus"
        @select="handleSearchSelect"
      >
        <template slot-scope="{ item }">
          <span class="search-item"><i :class="item.icon"></i>{{item.value}}</span>
        </template>
      </el-autocomplete>

      <el-menu
        class="site-topbar__menu site-topbar__menu--right"
        background-color="#2d4152"
        text-color="#ffffff"
        mode="horizontal">
        <el-menu-item class="site-topbar__avatar" text-color="#ffffff" index="1-2">
          <el-dropdown placement="bottom" :hide-on-click="false">
            <span class="el-dropdown-link">
              <img src="~@/assets/img/avatar.png" :alt="$store.state.user.name">
              {{ $store.state.user.name }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </header>
</template>

<script>
import UpdatePassword from './update-password';
import API from '@/api';
import { transformMenu, getRouteNameByUrl } from '@/utils';
import { mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      updatePassowrdVisible: false,
      searchWord: '',
      searchCollapse: false,
      logoStyle: {
        background: 'url(../img/cignacmb_logo_white.png) no-repeat center center;',
        backgroundSize: '160px'
      }
    };
  },
  components: {
    UpdatePassword
  },
  methods: {
    // 异步搜索
    querySearchAsync(queryString, cb) {
      let data = transformMenu([...this.$store.state.menuNavList]);
      const result = queryString ? data.filter(this.createFilter(queryString)) : data;
      cb(result);
    },
    createFilter(queryString) {
      return restaurant => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },

    handleSearchSelect(nav) {
      this.gotoRouteHandle(nav.url, nav.menuId);
    },
    handleSearchFocus(event) {
      this.searchCollapse = !this.searchCollapse;
      this.$refs.searchInput.$el.classList[this.searchCollapse ? 'add' : 'remove']('search-flex');
    },

    // 修改密码
    updatePasswordHandle() {
      this.updatePassowrdVisible = true;
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init();
      });
    },
    // 退出
    logoutHandle() {
      this.$confirm(`确定进行[退出]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.common.logout().then(({ data }) => {
          if (data && data.code === 0) {
            this.DELETE_CONTENT_TABS([]);
            this.$cookie.delete('token');
            this.$router.replace({ name: 'login' });
          }
        });
      });
    },

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
    ...mapMutations(['UPDATE_MENU_NAV_ACTIVE', 'UPDATE_CONTENT_TABS_ACTIVE_NAME'])
  }
};
</script>
