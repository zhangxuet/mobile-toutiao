import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

const Layout = () => import('@/views/layout')
const Home = () => import('@/views/home')
const Article = () => import('@/views/home/article')
const Question = () => import('@/views/question')
const Search = () => import('@/views/search')
const SearchResult = () => import('@/views/search/result')
const User = () => import('@/views/user')
const UserChat = () => import('@/views/user/chat')
const Login = () => import('@/views/user/login')
const UserProfile = () => import('@/views/user/profile')
const Video = () => import('@/views/video')

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/',
      component: Layout,
      children:
      [
        { path: '/', name: 'home', component: Home, meta: { keepAlive: true } },
        { path: '/question', name: 'question', component: Question },
        { path: '/video', name: 'video', component: Video },
        { path: '/user', name: 'user', component: User }
      ]
    },
    { path: '/user/profile', name: 'profile', component: UserProfile },
    { path: '/user/chat', name: 'chat', component: UserChat },
    { path: '/login', name: 'login', component: Login },
    { path: '/search', name: 'search', component: Search },
    { path: '/search/result', name: 'result', component: SearchResult },
    { path: '/article/:id', name: 'article', component: Article, meta: { keepAlive: true } }
  ]
})
router.beforeEach((to, from, next) => {
  const login = { path: '/login', query: { redirect: to.path } }
  if (to.path.startsWith('/user') && !store.state.user.token) return next(login)
  next()
})
export default router
