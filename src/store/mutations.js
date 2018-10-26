import { setAuthInHeader } from '../api'

const mutations = {
    // MUTATION_NAME (Vuex의state, param)
    SET_IS_ADD_BOARD (state, toggle) {
        state.isAddBoard = toggle
    },
    SET_BOARDS (state, boards) {
        state.boards = boards
    },
    LOGIN (state, token) {
        if (!state) return
        state.token = token                     // state에 token 저장
        localStorage.setItem('token', token)    // localStorage에 token 저장
        setAuthInHeader(token)              // request header에 token 셋팅
    },
    LOGOUT (state, token) {
        state.token = null                      // state의 token null
        delete localStorage.token               // localStorage의 token 삭제
    }
}

export default mutations