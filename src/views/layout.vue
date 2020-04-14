<template>
  <div class="container">
    <van-nav-bar
      title="黑马头条"
      fixed
      right-text="搜索"
      @click-right="$router.push('/search')"
      v-if="path !== '/user'"
    />
    <div class="my-wrapper" :class="{noTop:path==='/user'}">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
    <van-tabbar route>
      <van-tabbar-item name="home" to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item name="question" to="/question" icon="search">问答</van-tabbar-item>
      <van-tabbar-item name="video" to="/video" icon="friends-o">视频</van-tabbar-item>
      <van-tabbar-item name="user" to="/user" icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      //   active: 'home'
    }
  },
  computed: {
    path () {
      return this.$route.path
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop {
      padding-top: 0;
    }
  }
}
</style>
