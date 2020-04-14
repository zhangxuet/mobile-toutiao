<template>
  <div class="container">
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <van-search v-model.trim="q" placeholder="请输入搜索关键词" shape="round" @search="onSearch"/>
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell @click="onSearch(sug.replace(`<span>${q}</span>`, q))" icon="search" v-for="sug in suggestList" :key="sug"><p v-html="sug"></p></van-cell>
    </van-cell-group>
    <div class="history-box" v-else-if="historyList.length">
      <div class="head">
        <span>历史记录</span>
        <van-icon name="delete" @click="clearSuggest"></van-icon>
      </div>
      <van-cell-group>
        <van-cell v-for="item in historyList" :key="item">
          <a class="word_btn" @click="toSearch(item)">{{item}}</a>
          <van-icon @click="delSuggest(item)" class="close_btn" slot="right-icon" name="cross"/>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { suggestion } from '@/api/articles'
const KEY = 'searchKeywors'
export default {
  data () {
    return {
      q: '',
      timer: null,
      historyList: [],
      suggestList: []
    }
  },
  created () {
    this.historyList = JSON.parse(window.localStorage.getItem(KEY) || '[]')
  },
  watch: {
    q () {
      window.clearTimeout(this.timer)
      this.timer = window.setTimeout(async () => {
        if (!this.q) {
          this.suggestList = []
          return false
        }
        const data = await suggestion(this.q)
        this.suggestList = data.options.map(item => item.toLowerCase().replace(this.q, `<span>${this.q}</span>`))
      }, 200)
    }
  },
  methods: {
    toSearch (text) {
      this.$router.push({ path: '/search/result', query: { q: text } })
    },
    clearSuggest () {
      this.historyList = []
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
    },
    delSuggest (text) {
      const index = this.historyList.findIndex(item => item === text)
      this.historyList.splice(index, 1)
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
    },
    onSearch (text) {
      if (!this.q) return false
      const set = new Set(this.historyList)
      set.add(text)
      this.historyList = Array.from(set)
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
      this.$router.push({ path: '/search/result', query: { q: text } })
    }
  }
}
</script>

<style lang="less" scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
