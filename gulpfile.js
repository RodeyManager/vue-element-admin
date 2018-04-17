var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var path = require('path');
var del = require('del');

var distPath = path.resolve('./dist');
var env = ''; // 环境

// 编译
gulp.task('build', $.shell.task(['node build/build.js']));

// 替换${versionPath}/static/js/manifest.js window.SITE_CONFIG.cdnUrl占位变量
gulp.task('replace:cdnUrl', ['build'], function() {
  return gulp
    .src(`${distPath}/static/js/manifest.js`)
    .pipe($.replace(new RegExp(`"${require('./config').build.assetsPublicPath}"`, 'g'), 'window.SITE_CONFIG.cdnUrl + "/"'))
    .pipe(gulp.dest(`${distPath}/static/js/`));
});

// 替换${versionPath}/static/config/index-${env}.js window.SITE_CONFIG.staticFileName配置变量
gulp.task('replace:staticFileName', ['build'], function() {
  return gulp
    .src(`${distPath}/static/config/index-${env}.js`)
    .pipe($.replace(/window.SITE_CONFIG.staticFileName = \'.*\'/g, `window.SITE_CONFIG.staticFileName = \'\.\/\'`))
    .pipe(gulp.dest(`${distPath}/static/config/`));
});

// 合并${versionPath}/static/config/[index-${env}, init].js 至 ${distPath}/config/index.js
gulp.task('concat:config', ['replace:staticFileName'], function() {
  return gulp
    .src([`${distPath}/static/config/index-${env}.js`, `${distPath}/static/config/init.js`])
    .pipe($.concat('index.js'))
    .pipe(gulp.dest(`${distPath}/static/js/`));
});

// 清空
gulp.task('clean', function() {
  return del([distPath]);
});

gulp.task('default', ['clean'], function() {
  // 获取环境配置
  env = process.env.npm_config_sit ? 'sit' : process.env.npm_config_uat ? 'uat' : 'prod';
  // 开始打包编译
  gulp.start(['build', 'replace:cdnUrl', 'replace:staticFileName', 'concat:config'], function() {
    // 清除, 编译 / 处理项目中产生的文件
    del([`${distPath}/static/config`]);
  });
});
