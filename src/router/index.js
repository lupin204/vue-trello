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
const requireAuth = (to, from, next) => {
  const loginPath = `/login?rPath=${encodeURIComponent(to.path)}`

  /* 
  const isAuth = localStorage.getItem('token')    // 'tokenValue' || undefined
  isAuth ? next() : next(loginPath)   // if (isAuth == true) Then next() Else next(loginPath)
  */
 //인증관련 로직은 store에서 수행하도록 변경..
 store.getters.isAuth ? next() : next(loginPath)
}

// vue-router
const router = new VueRouter({
  mode: 'history',    // not 'hashbang mode' but 'history mode'
  routes: [
    {
      path: '/',
      component: Home,
      beforeEnter: requireAuth
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/board/:bid',
      component: Board,
      beforeEnter: requireAuth,
      children: [{  // bid라는 변수
        path: 'card/:cid',
        component: Card,
        beforeEnter: requireAuth
      }]
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})

export default router