// import { setAuthInHeader } from '../api'

const mutations = {
  // MUTATION_NAME (Vuex의state, param)
  // LOGIN(state, { accessToken }) {
  //   if (!accessToken) return
  //   state.accessToken = accessToken                  // state에 token 저장
  //   localStorage.setItem('accessToken', accessToken) // localStorage에 token 저장
  //   setAuthInHeader(accessToken)                     // request header에 token 셋팅
  // },
  // LOGOUT(state) {
  //   state.accessToken = null             // state의 token null
  //   delete localStorage.accessToken      // localStorage의 token 삭제
  //   setAuthInHeader(null)                // request header token 삭제
  // },
  SET_BOARD_LIST(state, { list }) {
    state.boardList = list.map(board => board)
  },
  SET_BOARD(state, { item }) {
    state.board = item
  },
  SET_IS_ADD_BOARD(state, toggle) {
    state.isAddBoard = toggle
  },
  SET_CARD(state, card) {
    state.card = card
  },
  SET_THEME(state, color) {
    state.bodyColor = color ? color : 'rgb(255,255,255)'
    state.navbarColor = color ? 'rgba(0,0,0,.15)' : '#026aa7'
  },
  SET_IS_SHOW_BOARD_MENU(state, toggle) {
    state.isShowBoardMenu = toggle
  }
}

export default mutations
