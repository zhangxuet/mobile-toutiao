import request from '@/utils/request'

/**
 *
 * @param {*} channelId
 * @param {*} timestamp
 */
// 获取文章
export const getArticles = (channelId, timestamp) => {
  return request('/app/v1_1/articles', 'get', {
    channel_id: channelId,
    timestamp,
    with_top: 1
  })
}

// 对文章不喜欢
export const disLikes = (articleId) => {
  try {
    return request('/app/v1_0/article/dislikes', 'post', {
      target: articleId
    })
  } catch (e) {
    console.log(e)
  }
}

// 取消文章不喜欢
export const undisLikes = (articleId) => {
  return request('/app/v1_0/article/dislikes/' + articleId, 'delete')
}

// 对文章点赞
// export const likings = (articleId) => {
//   return request('/app/v1_0/article/likings', 'post', {
//     target: articleId
//   })
// }

export const likings = (articleId) => {
  try {
    return request('/app/v1_0/article/likings', 'post', {
      target: articleId
    })
  } catch (e) {
    console.log(e)
  }
}

// 取消点赞
export const unlikings = (articleId) => {
  return request('/app/v1_0/article/likings/' + articleId, 'delete')
}

// 举报文章
export const report = (articleId, type) => {
  return request('/app/v1_0/article/reports', 'post', {
    target: articleId,
    type
  })
}

// 联想建议
export const suggestion = (text) => {
  return request('/app/v1_0/suggestion', 'get', {
    q: text
  })
}

// 文章搜索
export const search = ({ page, perPage = 10, q }) => {
  return request('/app/v1_0/search', 'get', {
    page,
    per_page: perPage,
    q
  })
}

export const getArticleData = (articleId) => {
  return request('/app/v1_0/articles/' + articleId, 'get')
}

// 获取评论或评论回复
export const getComments = (type, source, offset) => {
  return request('/app/v1_0/comments', 'get', {
    type,
    source,
    offset
  })
}

// 添加评论或回复
export const commentOrReply = (target, content, artId) => {
  return request('/app/v1_0/comments', 'post', {
    target,
    content,
    art_id: artId
  })
}
