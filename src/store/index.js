import Vue from 'vue'
import Vuex from 'vuex'
import * as api from '../api'

// 미들웨어 설정
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        isAddBoard: false,      // Home Component (AddBoard 모달창 활성화여부)
        boards: []              // 보드목록
    },
    mutations: {
        SET_IS_ADD_BOARD (state, toggle) {
            state.isAddBoard = toggle
        },
        SET_BOARDS(state, boards) {
            state.boards = boards
        }
    },
    actions: {
        ADD_BOARD (_, { title }) {
            return api.board.create(title)
        },
        FETCH_BOARDS ({ commit }) {
            return api.board.fetch().then(data => {
                commit('SET_BOARDS', data.list)
            })
        }
    }
})

export default store