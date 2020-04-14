<template>
    <van-action-sheet :value="value" @closed="editing=false"
                  @input="$emit('input', $event)" title="编辑频道">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true"
                    size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false"
                    size="mini" type="danger"  plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,i) in channels" :key="item.id">
          <span class="f12" :class="{red: i === activeIndex}" @click="enterChannel(i)">{{item.name}}</span>
          <van-icon v-show="editing" v-if="i!==0" class="btn" name="cross" @click="delChannel(i,item.id)"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <van-icon class="btn" name="plus" @click="addChannel(item)"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</template>

<script>
import { getAllChannels, delChannel, addChannel } from '@/api/channels'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    channels: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      editing: false,
      allChannels: []
    }
  },
  computed: {
    optionChannels () {
      return this.allChannels.filter(item => this.channels.findIndex(myitem => myitem.id === item.id) === -1)
    }
  },
  created () {
    this.getAllChannels()
  },
  methods: {
    // 添加频道
    async addChannel ({ id, name }) {
      try {
        const orderChannel = this.channels.map((item, i) => ({
          id: item.id,
          name: item.name,
          seq: i
        }))
        orderChannel.splice(0, 1)
        orderChannel.push({ id, name, seq: orderChannel.length + 1 })
        await addChannel(orderChannel)
        this.$toast({ type: 'success', message: '添加成功' })
        this.channels.push({
          id,
          name,
          upLoading: false,
          downLoading: false,
          finished: false,
          articles: [],
          timestamp: Date.now(),
          scrollTop: 0
        })
      } catch (e) {
        this.$toast({ type: 'success', message: '添加失败' })
      }
    },
    // 删除频道
    async delChannel (index, channelId) {
      await delChannel(channelId)
      this.$toast({ type: 'success', message: '删除成功' })
      if (index <= this.activeIndex) {
        this.$emit('update:activeIndex', this.activeIndex - 1)
      }
      this.channels.splice(index, 1)
    },
    // 进入频道
    enterChannel (index) {
      this.$emit('input', false)
      this.$emit('update:activeIndex', index)
    },
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels
    }
  }
}
</script>

<style lang="less" scoped>
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.channel {
  padding: 10px;
  .tit{
    line-height: 3;
    .tip {
      font-size: 10px;
      color: #999;
    }
  }
  .van-button {
    float: right;
    margin-top: 7px;
  }
  .btn{
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ddd;
    font-size: 12px;
    color: #fff;
  }
  .f12{
      font-size:12px;
      color: #555;
  }
  .red{
    color: red;
  }
}
</style>
