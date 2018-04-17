<template>
  <div class="site-wrapper site-page--login" :class="[bgCls]">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info" id="particles-js"></div>
        <div class="login-main">
          <div class="login-title__wrapper">
            <img src="~@/assets/img/cignacmb_logo_r.png" alt="">
            <h3 class="login-title">电商平台后台管理系统</h3>
          </div>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" placeholder="帐号"></el-input><i class="fa fa-user"></i>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input><i class="fa fa-lock"></i>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" maxlength="5" minlength="5" min="5" max="5" placeholder="验证码">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt="">
                </el-col>
              </el-row>
              <i class="fa fa-qrcode" aria-hidden="true"></i>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" :type="buttonType" :loading="isPosting" @click="dataFormSubmit()">登录{{ isPosting && '中......' || ''}}</el-button>
            </el-form-item>
          </el-form>
          <p class="login-tips">{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '@/api';
import { getUUID } from '@/utils';
import ParticlesJS from '@/assets/libs/particles';

export default {
  data() {
    return {
      dataForm: {
        userName: '',
        password: '',
        uuid: '',
        captcha: ''
      },
      dataRule: {
        userName: [{ required: true, message: '帐号不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        captcha: [{ required: true, min: 5, max: 5, message: '验证码不能为空', trigger: 'blur' }]
      },
      captchaStyle: {
        background: 'url()',
        backgroundSize: '200px 20px'
      },
      captchaPath: '',
      message: '',
      buttonType: 'primary',
      isPosting: false,
      bgCls: ''
    };
  },
  created() {
    this.getCaptcha();
  },
  mounted() {
    this.$nextTick(() => {
      ParticlesJS('particles-js');
      const date = new Date(),
        hours = date.getHours();
      if (hours >= 18 || hours <= 6) {
        // 晚间
        this.bgCls = 'bg-night';
        this.message = '现在已是晚间，请注意休息！(～﹃～)~zZ';
        this.buttonType = 'warning';
      } else {
        // 白间
        this.bgCls = 'bg' + Math.ceil(Math.random() * 5);
        this.message = '白间，努力奋斗的时刻！↖(^ω^)↗';
        this.buttonType = 'primary';
      }
      // this.$el.classList.add(bgCls);
    });
  },
  methods: {
    // 提交表单
    dataFormSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          var params = {
            username: this.dataForm.userName,
            password: this.dataForm.password,
            uuid: this.dataForm.uuid,
            captcha: this.dataForm.captcha
          };
          this.isPosting = true;
          API.common.login(params).then(({ data }) => {
            this.isPosting = false;
            if (data && data.code === 0) {
              this.$cookie.set('token', data.token, { expires: `${data.expire || 0}s` });
              this.$router.replace({ name: 'home' });
            } else {
              this.getCaptcha();
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    // 获取验证码
    getCaptcha() {
      this.dataForm.uuid = getUUID();
      this.captchaPath = API.common.captcha(this.dataForm.uuid);
    }
  }
};
</script>

<style lang="scss">
.site-wrapper.site-page--login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(38, 50, 56, 0.75);
  overflow: hidden;
  &:after {
    display: block;
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 0;
    width: 250px;
    height: 50px;
    opacity: 0.6;
    content: '';
    background-image: url(~@/assets/img/cignacmb_logo_white.png);
  }
  &:before {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -2;
    width: 100%;
    height: 100%;
    content: '';
  }
  &.bg1:before {
    background-image: url(~@/assets/img/login_bg.jpg);
    background-size: cover;
  }
  &.bg2:before {
    background-image: url(~@/assets/img/login_bg2.jpg);
    background-size: cover;
  }
  &.bg3:before {
    background-image: url(~@/assets/img/login_bg3.jpg);
    background-size: cover;
  }
  &.bg4:before {
    background-image: url(~@/assets/img/login_bg4.jpg);
    background-size: cover;
  }
  &.bg5:before {
    background-image: url(~@/assets/img/login_bg5.jpg);
    background-size: cover;
  }
  &.bg-night:before {
    background-image: url(~@/assets/img/login_bg_night.jpg);
    background-size: cover;
  }
  .site-content__wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .site-content {
    min-height: 100%;
  }
  .brand-info {
    color: #fff;
  }
  .brand-info__text {
    margin: 0 0 22px 0;
    font-size: 48px;
    font-weight: 400;
    text-transform: uppercase;
  }
  .brand-info__intro {
    margin: 10px 0;
    font-size: 16px;
    line-height: 1.58;
    opacity: 0.6;
  }
  .login-main {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -40%);
    padding: 0 40px;
    width: 360px;
    // background-color: #fff;
    .login-tips {
      color: rgba(255, 255, 255, 0.5);
    }
  }
  .login-title__wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    align-items: center;
    img {
      display: inline-flex;
      margin-right: 10px;
    }
    .login-title {
      font-size: 20px;
      color: rgba(255, 255, 255, 0.7);
      font-weight: normal;
    }
  }
  .login-captcha {
    overflow: hidden;
    > img {
      width: 100%;
      height: 32px;
      vertical-align: middle;
      cursor: pointer;
    }
  }
  .login-btn-submit {
    width: 100%;
    border-radius: 0;
  }
  .el-form-item {
    margin-bottom: 20px;
    .el-form-item__content {
      line-height: inherit;
      > i {
        position: absolute;
        left: 8px;
        top: 22%;
        color: rgba(255, 255, 255, 0.7);
        font-size: 18px;
      }
    }
  }
  .el-input__inner {
    border-radius: 0;
    background-color: rgba(38, 50, 56, 0.6);
    border-color: rgba(38, 50, 56, 0.6);
    box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.15);
    color: white;
    padding: 0 15px 0 25px;
  }
}
</style>
