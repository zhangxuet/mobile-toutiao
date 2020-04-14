<template>
  <div class="page-login">
    <van-nav-bar left-arrow @click-left="$router.back()" title="登 录"></van-nav-bar>
    <van-cell-group class="cell">
      <van-field label="手机号" v-model.trim="loginForm.mobile" @blur="checkMobile"
      :error-message="errMsg.mobile" placeholder="请输入手机号">
      </van-field>
      <van-field label="验证码" v-model.trim="loginForm.code" :error-message="errMsg.code"
      @blur="checkCode" placeholder="请输入验证码">
        <van-button class="p5" slot="button" size="mini" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn">
        <van-button type="info" block round @click="login">登录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      errMsg: {
        mobile: '',
        code: ''
      },
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      }
    }
  },
  methods: {
    checkMobile () {
      if (!this.loginForm.mobile) {
        this.errMsg.mobile = '请输入手机号'
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errMsg.mobile = '手机号格式错误'
        return false
      }
      this.errMsg.mobile = ''
    },
    checkCode () {
      if (!this.loginForm.code) {
        this.errMsg.code = '请输入验证码'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errMsg.code = '验证码错误'
        return false
      }
      this.errMsg.code = ''
    },
    ...mapMutations(['setUser']),
    async login () {
      this.checkMobile()
      this.checkCode()
      if (this.errMsg.mobile || this.errMsg.code) {
        return false
      }
      try {
        const data = await login(this.loginForm)
        this.$toast({ type: 'success', message: '登录成功' })
        this.setUser(data)
        const url = this.$route.query.redirect || '/user'
        this.$router.push(url)
      } catch (e) {
        console.log(e)
        this.$toast({ type: 'fail', message: '登录失败' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.p5{
  padding: 0 5px;
}
.btn {
    padding: 10px;
    .van-button{
    height: 32px;
    line-height: 30px;
  }
}
</style>
