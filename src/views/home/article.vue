<template>
    <div class='container' @scroll="remember($event)" ref="wrapper">
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{articleList.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="articleList.aut_photo" />
        <div class="text">
          <p class="name">{{articleList.aut_name}}</p>
          <p class="time">{{articleList.pubdate | relTime}}</p>
        </div>
        <van-button @click="followings" round size="small" type="info">{{articleList.is_followed?'取消关注':'+ 关注'}}</van-button>
      </div>
      <div class="content">
        <p v-html="articleList.content"></p>
      </div>
      <div class="zan">
        <van-button @click="attitude(1)" round size="small" plain icon="like-o" :class="{active: articleList.attitude===1}">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button @click="attitude(0)" round size="small" plain icon="delete" :class="{active: articleList.attitude===0}">不喜欢</van-button>
      </div>
      <comment></comment>
    </div>
  </div>
</template>

<script>
import Comment from './components/comment'
import { getArticleData, disLikes, undisLikes, likings, unlikings } from '@/api/articles'
import { followings, unfollowings } from '@/api/user'
export default {
  components: { Comment },
  data () {
    return {
      scrollTop: 0,
      articleList: {}
    }
  },
  computed: {
    articleId () {
      return this.$route.params.id
    }
  },
  activated () {
    if (this.articleList.art_id && this.articleId === this.articleList.art_id.toString()) {
      this.$refs['wrapper'].scrollTop = this.scrollTop
    } else {
      this.articleList = {}
      this.scrollTop = 0
      this.getArticleData()
    }
  },
  methods: {
    // 关注取消关注
    async followings () {
      if (this.articleList.is_followed) {
        await unfollowings(this.articleList.aut_id)
        this.articleList.is_followed = false
        this.$toast.success('关注成功')
      } else {
        await followings(this.articleList.aut_id)
        this.articleList.is_followed = true
        this.$toast.success('取消关注成功')
      }
    },
    // 点赞与不喜欢
    async attitude (type) {
      if (type === 1) {
        if (this.articleList.attitude === 1) {
          await unlikings(this.articleId)
          this.articleList.attitude = -1
        } else {
          await likings(this.articleId)
          this.articleList.attitude = 1
        }
      } else {
        if (this.articleList.attitude === 0) {
          await undisLikes(this.articleId)
          this.articleList.attitude = -1
        } else {
          await disLikes(this.articleId)
          this.articleList.attitude = 0
        }
      }
    },
    // 滚动
    remember (e) {
      this.scrollTop = e.target.scrollTop
    },
    // 获取文章详情
    async getArticleData () {
      const data = await getArticleData(this.articleId)
      this.articleList = data
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>
