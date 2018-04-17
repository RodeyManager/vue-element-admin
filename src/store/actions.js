export default {
  // 更新当前激活菜单样式
  updateMenuActive({ commit }, payload) {
    const { $el, menuId, state = {}, sidebarCollapse } = payload;
    const IS_ACTIVE = 'is-active';

    const $menuDom = document.querySelector('#menu');
    const $elItems = [].slice.call($menuDom.querySelectorAll('.el-menu-item'));
    const $subItems = [].slice.call($menuDom.querySelectorAll('.el-submenu'));

    $elItems &&
      $elItems.map(item => {
        _upDom(item, 'remove');
      });
    $subItems &&
      $subItems.map(item => {
        item.querySelector('.el-submenu__title').style.color = 'rgb(255, 255, 255)';
      });

    if (state.sidebarCollapse || !sidebarCollapse) {
      let lis;
      if ($el && $el.parentNode) {
        lis = $el.parentNode.querySelectorAll('li');
        [].slice.call(lis).map(nodeLi => {
          if (nodeLi.classList) {
            _upDom(nodeLi, 'remove');
          }
        });
        _upDom($el);
      }
    } else {
      const $activeMenuItem = $menuDom.querySelector(`[data-idx="${menuId}"]`);
      if ($activeMenuItem) {
        _upDom($activeMenuItem);
      }
    }

    function _upDom(dom, md = 'add') {
      dom.classList[md](IS_ACTIVE);
      dom.style.color = md !== 'add' ? 'rgb(255, 255, 255)' : 'rgb(140, 197, 255)';
    }
  },
  // 菜单折叠回调
  closeMenu({ commit }, payload) {
    const { index } = payload;
    if (!index) return;
    const $menuDom = document.querySelector('#menu');
    const $opened = $menuDom.querySelector(`[data-idx="${index}"]`);
    const isActived = $opened.querySelector(`.el-menu-item.is-active`);
    if (isActived) {
      $opened.querySelector('.el-submenu__title').style.color = 'rgb(140, 197, 255)';
    } else {
      $opened.querySelector('.el-submenu__title').style.color = 'rgb(255, 255, 255)';
    }
  }
};
