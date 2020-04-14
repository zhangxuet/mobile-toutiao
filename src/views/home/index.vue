<template>
  <div class="container">
    <van-tabs swipeable v-model="activeIndex" :lazy-render="false" @change="changeChannel">
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <div class="scroll-wrapper" @scroll="remember($event)" ref="scroll-wrapper">
          <van-pull-refresh
            v-model="activeChannel.downLoading"
            @refresh="onRefresh"
            :success-text="refreshSuccessText"
          >
            &nbsp;
            <van-list
              v-model="activeChannel.upLoading"
              :finished="activeChannel.finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell @click="$router.push('/article/'+article.art_id)" v-for="article in activeChannel.articles" :key="article.art_id.toString()">
                <div class="article_item">
                  <h3 class="van-ellipsis">{{article.title}}</h3>
                  <div class="img_box" v-if="article.cover.type === 3">
                    <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[0]" />
                    <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[1]" />
                    <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[2]" />
                  </div>
                  <div class="img_box" v-if="article.cover.type === 1">
                    <van-image lazy-load class="w100" fit="cover" :src="article.cover.images[0]" />
                  </div>
                  <div class="info_box">
                    <span>{{article.aut_name}}</span>
                    <span>{{article.comm_count}}评论</span>
                    <span>{{article.pubdate | relTime}}</span>
                    <span v-if="user.token" class="close" @click="openPopup(article.art_id)">
                      <van-icon name="cross"></van-icon>
                    </span>
                  </div>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
    <span class="bar_btn" slot="nav-right" @click="showChannelEdit=true">
      <van-icon name="wap-nav"></van-icon>
    </span>
    <more-action
      v-if="user.token"
      v-model="show"
      :articleId="articleId"
      @on-disLikes="removeArticle()"
      @on-report="removeArticle()"
    ></more-action>
    <channel-edit v-model="showChannelEdit"
    :channels="channels"
    :activeIndex.sync="activeIndex"
    ></channel-edit>
  </div>
</template>

<script>
import ChannelEdit from './components/channel-edit'
import MoreAction from './components/more-action'
import { getChannels } from '@/api/channels'
import { getArticles } from '@/api/articles'
import { mapState } from 'vuex'
export default {
  name: 'home-index',
  components: { MoreAction, ChannelEdit },
  data () {
    return {
      articleId: null,
      show: false,
      showChannelEdit: false,
      refreshSuccessText: '',
      activeIndex: 0,
      channels: []
    }
  },
  computed: {
    // 当前激活的频道
    activeChannel () {
      return this.channels[this.activeIndex]
    },
    ...mapState(['user'])
  },
  // 监听用户登录
  watch: {
    user () {
      this.activeIndex = 0
      this.getMyChannels()
      this.onLoad()
    }
  },
  // 组件缓存激活钩子
  activated () {
    const domArr = this.$refs['scroll-wrapper']
    if (domArr) {
      const scrollWrapper = domArr[this.activeIndex]
      scrollWrapper.scrollTop = this.activeChannel.scrollTop
    }
  },
  created () {
    this.getMyChannels()
  },
  methods: {
    // 移除文章
    removeArticle () {
      const articles = this.activeChannel.articles
      const index = articles.findIndex(item => item.art_id === this.articleId)
      articles.splice(index, 1)
    },
    // 打开对话框
    openPopup (artId) {
      this.show = true
      this.articleId = artId
      // console.log(this.articleId)
    },
    // 切换频道
    changeChannel () {
      if (!this.activeChannel.articles.length) {
        this.activeChannel.upLoading = true
        this.onLoad()
      } else {
        this.$nextTick(() => {
          const scrollWrapper = this.$refs['scroll-wrapper'][this.activeIndex]
          scrollWrapper.scrollTop = this.activeChannel.scrollTop
        })
      }
    },
    // 滚动事件
    remember (e) {
      this.activeChannel.scrollTop = e.target.scrollTop
    },
    // 获取频道列表
    async getMyChannels () {
      this.channels = []
      const data = await getChannels()
      this.channels = data.channels.map(item => ({
        id: item.id,
        name: item.name,
        upLoading: false,
        downLoading: false,
        finished: false,
        articles: [],
        timestamp: Date.now(),
        scrollTop: 0
      }))
    },
    // 下拉刷新
    async onRefresh () {
      await this.$sleep()
      this.activeChannel.timestamp = Date.now()
      const data = await getArticles(
        this.activeChannel.id,
        this.activeChannel.timestamp
      )
      this.activeChannel.downLoading = false
      if (data.results.length) {
        this.activeChannel.articles = data.results
        this.refreshSuccessText = '更新成功'
        this.activeChannel.finished = false
        this.activeChannel.timestamp = data.pre_timestamp
        this.onLoad()
      } else {
        this.refreshSuccessText = '更新失败'
      }

      //   window.setTimeout(() => {
      //     this.downLoading = false
      //     const data = [1, 2, 3, 4, 5]
      //     if (data.length) {
      //       this.articles = data
      //       this.refreshSuccessText = '更新成功'
      //       this.onLoad()
      //       this.finished = false
      //     } else {
      //       this.refreshSuccessText = '更新失败'
      //     }
      //   }, 1000)
    },
    // 下拉加载
    async onLoad () {
      await this.$sleep()
      const data = await getArticles(
        this.activeChannel.id,
        this.activeChannel.timestamp
      )
      this.activeChannel.articles.push(...data.results)
      this.activeChannel.upLoading = false
      if (data.pre_timestamp) {
        this.activeChannel.timestamp = data.pre_timestamp
      } else {
        this.activeChannel.finished = true
      }

      //   window.setTimeout(() => {
      //     const data = []
      //     for (
      //       let i = this.articles.length + 1;
      //       i <= this.articles.length + 10;
      //       i++
      //     ) {
      //       data.push(i)
      //     }
      //     console.log(data)
      //     this.articles.push(...data)
      //     this.upLoading = false
      //     if (this.articles.length >= 30) {
      //       this.finished = true
      //     }
      //   }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
