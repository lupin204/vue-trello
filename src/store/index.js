import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

// 미들웨어 설정
Vue.use(Vuex);

/*
const store1 = new Vuex.Store({
    modules: {
        // card.js / board.js, auth.js 파일 생성하여 각각마다 state, getter, mutation, action 넣는다
        card,
        board,
        auth
    }
})
*/

const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})

const { token } = localStorage
store.commit('LOGIN', token)

export default store