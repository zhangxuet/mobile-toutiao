import request from '@/utils/request'
export const login = ({ mobile, code }) => {
  return request('/app/v1_0/authorizations', 'post', {
    mobile,
    code
  })
}

// 关注
export const followings = (userId) => {
  return request('/app/v1_0/user/followings', 'post', {
    target: userId
  })
}

// 取消关注用户
export const unfollowings = (userId) => {
  return request('/app/v1_0/user/followings/' + userId, 'delete')
}

// 获取用户资料
export const getUserInfo = () => {
  return request('/app/v1_0/user', 'get')
}

// 获取用户个人资料
export const getUserProfile = () => {
  return request('/app/v1_0/user/profile', 'get')
}

// 编辑用户头像
export const updatePhoto = (formData) => {
  return request('/app/v1_0/user/photo', 'patch', formData)
}

// 编辑用户个人资料
export const updateProfile = ({ name, gender, birthday }) => {
  return request('/app/v1_0/user/profile', 'patch', { name, gender, birthday })
}
