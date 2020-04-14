import axios from 'axios'
import JSONBIG from 'json-bigint'
import store from '@/store'
import router from '@/router'

const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  transefromResponse: [(data) => {
    try {
      return JSONBIG.parse(data)
    } catch (e) {
      return data
    }
  }]
})

instance.interceptors.request.use(config => {
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, err => Promise.reject(err))

instance.interceptors.response.use(res => {
  try {
    return res.data.data
  } catch (e) {
    return res.data
  }
}, async err => {
  if (err.response && err.response.status === 401) {
    const user = store.state.user
    const login = { path: '/login', query: { redirect: router.currentRoute.path } }
    if (!user.token || !user.refresh_token) {
      router.push(login)
      // return
      return Promise.reject(err)
    }
    try {
      const { data: { data } } = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      store.commit('setUser', {
        token: data.token,
        refresh_token: user.refresh_token
      })
      return instance(err.config)
    } catch (e) {
      store.commit('delUser')
      router.push(login)
      // 出错，要抛出错误，不抛出不会阻碍程序运行
      return Promise.reject(err)
    }
  }
  return Promise.reject(err)
})

export default (url, method, data) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}
