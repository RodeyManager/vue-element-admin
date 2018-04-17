<template>
  <div class="site-content site-content--home">
    <el-card :style="contentViewStyles">
      <h3>项目介绍</h3>
      <ul>
        <li>轻量级的快速开发平台，能快速开发项目并交付</li>
        <li>完善的XSS防范及脚本过滤，彻底杜绝XSS攻击，包括更安全的CRSF控制</li>
        <li>实现完全前后端分离，通过token进行数据交互</li>
        <li>前后台独立部署，极大降低依赖度</li>
        <li>采用目前流行的扁平化设计，提高视觉效果和用户交互体验</li>
      </ul>

    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    contentViewStyles() {
      var height = this.$store.state.documentClientHeight;
      height -= 50; // site-topbar
      height -= 15; // site-content padding-top
      height -= 15; // site-content padding-bottom
      height += 'px';
      return [{ minHeight: height }];
    }
  }
};
</script>

<style>
.site-content--home {
  line-height: 1.5;
}
</style>
