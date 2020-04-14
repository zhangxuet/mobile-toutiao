import request from '@/utils/request'
import store from '@/store'
const CHANNEL_KEY = '1234'

// export const getChannels = () => {
//   return request('/app/v1_0/user/channels', 'get')
// }

export const getChannels = () => {
  return new Promise(async (resolve, reject) => {
    const { user } = store.state
    if (user.token) {
      const data = await request('/app/v1_0/user/channels', 'get')
      resolve(data)
    } else {
      const channelsStr = window.localStorage.getItem(CHANNEL_KEY)
      if (channelsStr) {
        const channelsJson = JSON.parse(channelsStr)
        resolve({ channels: channelsJson })
      } else {
        const data = await request('/app/v1_0/user/channels', 'get')
        window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(data.channels))
        resolve(data)
      }
    }
  })
}

export const delChannel = (channelId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { user } = store.state
      if (user.token) {
        await request(`/app/v1_0/user/channels/${channelId}`, 'delete')
        resolve()
      } else {
        const localChannel = JSON.parse(window.localStorage.getItem(CHANNEL_KEY))
        const index = localChannel.findIndex(item => item.id === channelId)
        localChannel.splice(index, 1)
        window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(localChannel))
        resolve()
      }
    } catch (e) {
      reject(e)
    }
  })
}

export const addChannel = (newChannel) => {
  return new Promise(async (resolve, reject) => {
    const { user } = store.state
    if (user.token) {
      await request('/app/v1_0/user/channels', 'put', {
        channels: newChannel
      })
      resolve()
    } else {
      const localChannel = JSON.parse(window.localStorage.getItem(CHANNEL_KEY))
      const { id, name } = newChannel[newChannel.length - 1]
      localChannel.push({ id, name })
      window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(localChannel))
      resolve()
    }
  })
}

export const getAllChannels = () => {
  return request('/app/v1_0/channels', 'get')
}
