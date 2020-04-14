<template>
  <div class="comment">
    <!-- 评论列表 -->
    <van-list :immediate-check="false" @load="getComments" v-model="loading" :finished="finished" finished-text="没有更多了">
      <div class="item van-hairline--bottom van-hairline--top" v-for="item in comments" :key="item.com_id.toString()">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="item.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{item.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{item.like_count}}</span>
            </span>
          </p>
          <p>{{item.content}}</p>
          <p>
            <span class="time">{{item.pubdate | relTime}}</span>&nbsp;
            <van-tag plain @click="openReply(item.com_id)">{{item.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 底部输入框 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button" @click="commentOrReply">提交</span>
      </van-field>
    </div>

        <!-- 回复 -->
    <van-action-sheet v-model="showReply" class="reply_dailog" title="回复评论" @closed="reply.commentId=null,value=''">
      <van-list @load="getReply" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了" :immediate-check="false" >
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in reply.list" :key="item.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo"/>
          <div class="info">
            <p><span class="name">{{item.aut_name}}</span></p>
            <p>{{item.content}}</p>
            <p><span class="time">{{item.pubdate | relTime}}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>
</template>

<script>
import { getComments, commentOrReply } from '@/api/articles'
export default {
  data () {
    return {
      loading: false,
      finished: false,
      comments: [],
      offset: null,
      submiting: false,
      value: '',
      showReply: false,
      reply: {
        loading: false,
        finished: false,
        offset: null,
        commentId: null,
        list: []
      }
    }
  },
  computed: {
    articleId () {
      return this.$route.params.id
    }
  },
  activated () {
    this.loading = true
    this.comments = []
    this.finished = false
    this.offset = null
    this.getComments()
  },
  methods: {
    async commentOrReply () {
      await this.$sleep()
      this.submiting = true
      if (this.reply.commentId) {
        const data = await commentOrReply(this.reply.commentId, this.value, this.articleId)
        // console.log(data)
        this.reply.list.unshift(data.new_obj)
        const comment = this.comments.find(item => item.com_id === this.reply.commentId)
        const index = this.comments.findIndex(item => item.com_id === this.reply.commentId)
        comment.reply_count++
        this.comments[index].reply_count++
        console.log(this.comments)
        this.value = ''
      } else {
        const data = await commentOrReply(this.articleId, this.value)
        this.comments.unshift(data.new_obj)
        this.value = ''
        this.submiting = false
      }
    },
    // 打开对话框
    async openReply (id) {
      this.showReply = true
      this.reply.commentId = id
      this.reply.loading = true
      this.reply.finished = false
      this.reply.offset = null
      this.reply.list = []
      this.getReply()
    },
    // 获取回复内容
    async getReply () {
      const data = await getComments('c', this.reply.commentId.toString(), this.reply.offset)
      this.reply.list.push(...data.results)
      // console.log(data)
      this.reply.loading = false
      if (data.end_id < data.last_id) {
        this.reply.offset = data.last_id
      } else {
        this.reply.finished = true
      }
    },
    // 获取评论内容
    async getComments () {
      await this.$sleep()
      const data = await getComments('a', this.articleId, this.offset)
      this.comments.push(...data.results)
      this.loading = false
      if (data.end_id < data.last_id) {
        this.offset = data.last_id
      } else {
        this.finished = true
        // 1163292073298755584   评论文章
      }
    }
  }
}
</script>

<style lang="less" scoped>
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name {
        color: #069;
      }
      .zan {
        vertical-align: middle;
        padding-right: 2px;
      }
      .count {
        vertical-align: middle;
        font-size: 10px;
        color: #666;
      }
      .time {
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
.reply_dailog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
</style>
