<template>
  <div class="container">
    <van-tabs swipeable v-model="activeIndex">
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <div class="scroll-wrapper">
          <van-pull-refresh
            v-model="activeChannel.downLoading"
            @refresh="onRefresh"
            :success-text="refreshSuccessText"
          >
            <van-list v-model="activeChannel.upLoading" :finished="activeChannel.finished" finished-text="没有更多了" @load="onLoad">
              <van-cell v-for="item in activeChannel.articles" :key="item.art_id.toString()">
                <div class="article_item">
                  <h3 class="van-ellipsis">{{item.title}}</h3>
                  <div class="img_box" v-if="item.cover.type === 3">
                    <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                    <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                    <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
                  </div>
                  <div class="img_box" v-if="item.cover.type === 1">
                    <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]" />
                  </div>
                  <div class="info_box">
                    <span>{{item.title}}</span>
                    <span>{{item.m_count}}评论</span>
                    <span>{{item.pubdate | relTime}}</span>
                    <span class="close">
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
    <span class="bar_btn" slot="nav-right">
      <van-icon name="wap-nav"></van-icon>
    </span>
  </div>
</template>

<script>
import { getChannels } from '@/api/channelId'
import { getArticles } from '@/api/articles'
export default {
  name: 'home-index',
  data () {
    return {
      refreshSuccessText: '',
      channels: [],
      activeIndex: 0
    }
  },
  created () {
    this.getChannels()
  },
  computed: {
    activeChannel () {
      return this.channels[this.activeIndex]
    }
  },
  methods: {
    // 频道列表
    async getChannels () {
      const data = await getChannels()
      this.channels = data.channels.map(item => ({
        id: item.id,
        name: item.name,
        upLoading: false,
        finished: false,
        articles: [],
        downLoading: false,
        timestamp: Date.now()
      }))
    },
    // 下拉后，送手后触发的函数(获取数据，替换，进行列表渲染)
    async onRefresh () {
      this.activeChannel.timestamp = Date.now()
      const data = await getArticles(this.activeChannel.id, this.activeChannel.timestamp)
      this.activeChannel.downLoading = false
      if (data.results.length) {
        this.activeChannel.articles = data.results
        this.activeChannel.timestamp = data.pre_timestamp
        this.activeChannel.finished = false
        this.refreshSuccessText = '更新成功'
        this.onLoad()
      } else {
        this.refreshSuccessText = '暂无更新'
      }
      // window.setTimeout(() => {
      //   const data = [1, 2, 3, 4, 5]
      //   if (data.length) {
      //     this.articles = data
      //     this.downLoading = false
      //     // 防止数据不够一屏，再来一次上拉加载数据
      //     this.finished = false
      //     this.onLoad()
      //     this.refreshSuccessText = '更新成功'
      //   } else {
      //     this.refreshSuccessText = '暂无更新'
      //   }
      // }, 1000)
    },
    async onLoad () {
      const data = await getArticles(this.activeChannel.id, this.activeChannel.timestamp)
      this.activeChannel.articles.push(...data.results)
      this.activeChannel.upLoading = false
      if (data.pre_timestamp) {
        this.activeChannel.timestamp = data.pre_timestamp
      } else {
        this.activeChannel.finished = true
      }

      // console.log(data)
      // console.log(this.activeChannel)

      // window.setTimeout(() => {
      //   const data = []
      //   for (
      //     let i = this.articles.length + 1;
      //     i <= this.articles.length + 10;
      //     i++
      //   ) {
      //     data.push(i)
      //   }
      //   this.articles.push(...data)
      //   // console.log(data)
      //   this.upLoading = false
      //   if (this.articles.length >= 50) {
      //     this.finished = true
      //   }
      // }, 1000)
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
//文章列表样式
.article_item{
  h3{
    font-weight: normal;
    line-height: 2;
  }
  .img_box{
    display: flex;
    justify-content: space-between;
    .w33{
      width: 33%;
      height: 90px;
    }
    .w100{
      width: 100%;
      height: 180px;
    }
  }
  .info_box{
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span{
      padding-right: 10px;
      &.close{
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
