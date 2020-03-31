<!-- 登录模块 -->
<template>
  <div>
    <el-card class="login-form-layout">
      <el-form
        ref="loginForm"
        auto-complete="on"
        :model="loginForm"
        :rules="loginRules"
        label-position="left"
      >
        <div style="text-align: center">
          <svg-icon icon-class="login-mall" style="width: 56px; height: 56px; color: #409EFF" />
        </div>
        <h2 class="login-title color-main">管理系统</h2>
        <el-form-item prop="mobile">
          <el-input
            v-model="loginForm.mobile"
            name="username"
            type="text"
            auto-complete="on"
            placeholder="请输入用户名"
          >
            <span slot="prefix">
              <svg-icon icon-class="user" class="color-main" />
            </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            ref="password"
            v-model="loginForm.password"
            name="password"
            :type="passwordType"
            auto-complete="on"
            placeholder="请输入密码"
            @keyup.enter.native="handleLogin"
          >
            <span slot="prefix">
              <svg-icon icon-class="password" class="color-main" />
            </span>
            <span slot="suffix" style="cursor: pointer;" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px;text-align: right">
          <el-button style="width: 45%" type="primary" :loading="loading" @click.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <img :src="login_center_bg" class="login-center-layout">
    <div class="bottom-bar"><a target="_black" href="http://www.beian.miit.gov.cn">沪ICP备19033539号-1</a></div>
  </div>
</template>

<script>
import { validUsername, validPasswd } from '@/utils/validate'
import login_center_bg from '@/assets/img/login_center_bg.png'

export default {
  name: 'Login',
  data() {
    // 验证用户名
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确用户名'))
      } else {
        callback()
      }
    }
    // 验证密码
    const validatePassword = (rule, value, callback) => {
      if (!validPasswd(value)) {
        callback(new Error('请输入正确密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        // 提交信息
        mobile: '',
        password: ''
      },
      loginRules: {
        // 登录信息规则验证
        mobile: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      login_center_bg
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 登录接口模块
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.bottom-bar {
  min-width: 1000px;
  background: #fff;
  text-align: center;
  color: #222;
  line-height: 80px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: 12px;
}
.login-form-layout {
  position: absolute;
  left: 0;
  right: 0;
  width: 360px;
  margin: 140px auto;
  border-top: 10px solid #409eff;
}

.login-title {
  text-align: center;
}

.login-center-layout {
  background: #409eff;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin-top: 200px;
}
</style>
