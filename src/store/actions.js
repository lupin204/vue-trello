import { auth, board, list, card } from '../api'

/*
ACTION_NAME ({context객체}, {payloads})
state{} 객체  -->  vuex의 state를 가져온다
dispatch() 함수  -->  vuex의 action 실행한다
commit() 함수  -->  vuex의 mutation 실행한다
*/
const actions = {
  LOGIN ({ commit }, { email, password }) {
    return auth.login(email, password)
      .then(({ accessToken }) => commit('LOGIN', { accessToken }))
  },
  // BOARD-----------------------------------------------------------------
  FETCH_BOARD_LIST ({ commit }) {
    return board.fetchAll()
      .then(data => commit('SET_BOARD_LIST', data))
  },
  FETCH_BOARD ({ commit }, id) {
    return board.fetch(id)
      .then(data => commit('SET_BOARD', data))
  },
  ADD_BOARD (_, title) {
    return board.create(title)
      .then(({ item }) => item.id)
  },
  UPDATE_BOARD({ state, dispatch }, { id, title, bgColor }) {
      return board.update(id, { title, bgColor })
          .then(_ => dispatch('FETCH_BOARD', state.board.id))
  },
  DELETE_BOARD (_, id) {
      return board.destroy(id)
  },
  // LIST-----------------------------------------------------------------
  ADD_LIST ({ state, dispatch }, { title, boardId, pos }) {
      return list.create(boardId, { title, pos, boardId })
          .then(_ => dispatch('FETCH_BOARD', state.board.id))
  },
  UPDATE_LIST ({ state, dispatch }, { id, title, pos }) {
      return list.update(id, { title, pos })
          .then(_ => dispatch('FETCH_BOARD', state.board.id))
  },
  DELETE_LIST ({ state, dispatch }, { id, pos, title }) {
    return list.destroy(id, { pos, title })
      .then(_ => dispatch('FETCH_BOARD',  state.board.id))
  },
  // CARD-----------------------------------------------------------------
  FETCH_CARD ({ commit }, id) {
    return card.fetch(id)
      .then(({ item }) => commit('SET_CARD', item))
  },
  ADD_CARD ({ state, dispatch }, { title, pos, listId }) {
    return card.create({ title, pos, listId })
      .then(_ => dispatch('FETCH_BOARD', state.board.id))
  },
  UPDATE_CARD ({ state, dispatch }, { id, title, description, pos, listId }) {
    return card.update(id, { pos, title, description, listId})
      .then(_ => dispatch('FETCH_BOARD', state.board.id))
  },
  DELETE_CARD ({ state, dispatch }, id) {
    return card.destroy(id)
      .then(_ => dispatch('FETCH_BOARD', state.board.id))
  }



}

export default actions