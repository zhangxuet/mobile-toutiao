// 工具函数、过滤器、自定义指令
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)

const $sleep = () => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, 1000)
  })
}

const relTime = (strDate) => {
  return dayjs().locale('zh-cn').from(strDate)
}
export default {
  install (Vue) {
    Vue.prototype.$sleep = $sleep
    Vue.filter('relTime', relTime)
  }
}
