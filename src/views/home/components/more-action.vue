<template>
    <van-popup :value="value" @input="$emit('input', $event)" @open="isReport=false">
    <van-cell-group v-if="!isReport">
      <van-cell @click="disLikes()">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell v-for="item in reportType" :key="item.value" @click="report(item.value)">
        {{item.label}}
      </van-cell>
    </van-cell-group>
  </van-popup>
</template>

<script>
import { disLikes, report } from '@/api/articles'
import { reportType } from '@/api/constancts'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    articleId: {
      type: [Object, Number],
      default: null
    }
  },
  data () {
    return {
      isReport: false,
      reportType
    }
  },
  methods: {
    // 举报文章
    async report (type) {
      try {
        await report(this.articleId, type)
        this.$toast({ type: 'success', message: '删除成功' })
        this.$emit('input', false)
        this.$emit('on-report')
      } catch (e) {
        if (e.response.status === 409) {
          this.$toast('文章已举报')
        } else {
          this.$toast({ type: 'success', message: '删除失败' })
        }
      }
    },
    // 不喜欢
    async disLikes () {
      // console.log(this.articleId)
      try {
        await disLikes(this.articleId)
        this.$toast({ type: 'success', message: '操作成功' })
        this.$emit('input', false)
        this.$emit('on-disLikes')
      } catch (e) {
        // console.log(e)
        this.$toast({ type: 'fail', message: '操作失败' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-popup {
  width: 80%;
  border-radius: 4px;
}
</style>
