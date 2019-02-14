import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Board from '../components/Board.vue'
import Card from '../components/Card.vue'
import NotFound from '../components/NotFound.vue'
import store from '../store'

// 미들웨어 설정
Vue.use(VueRouter)

// 라우터 beforeEnter 에서 token 체크 - localStorage에 저장된 token 없으면 로그인페이지로 이동
// const requireAuth = () => (from, to, next) => {
//   const loginPath = `/login?returnPath=${encodeURIComponent(from.path)}`
//   !!store.state.accessToken ? next() : next(loginPath)
// }

// vue-router
const router = new VueRouter({
  mode: 'history', // not 'hashbang mode' but 'history mode'
  routes: [{
      path: '/',
      component: Home
      // beforeEnter: requireAuth()
    },
    // {
    //     path: '/login',
    //     component: Login
    // },
    {
      path: '/board/:id',
      component: Board,
      // beforeEnter: requireAuth(),
      children: [{
        path: 'card/:cid',
        component: Card
      }]
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})

export default router
