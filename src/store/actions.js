import * as api from '../api'

// ACTION_NAME ({context객체}, {payloads})
// state{} 객체  -->  vuex의 state를 가져온다
// dispatch() 함수  -->  vuex의 action 실행한다
// commit() 함수  -->  vuex의 mutation 실행한다
const actions = {
    
    LOGIN ({ commit }, {email, password}) {
        return api.auth.login(email, password)
            .then(({ accessToken }) => commit('LOGIN', accessToken))
    },
    // BOARD-----------------------------------------------------------------
    ADD_BOARD (_, { title }) {
        return api.board.create(title).then(data => data.item)
    },
    FETCH_BOARDS ({ commit }) {
        return api.board.fetch().then(data => {
            commit('SET_BOARDS', data.list)
        })
    },
    FETCH_BOARD ({ commit }, { id }) {
        return api.board.fetch(id).then(data => {
            commit('SET_BOARD', data.item)
        })
    },
    UPDATE_BOARD({ dispatch, state }, {id, title, bgColor}) {
        return api.board.update(id, {title, bgColor})
            .then(() => dispatch('FETCH_BOARD', {id: state.board.id}))
    },
    DELETE_BOARD (_, {id}) {
        return api.board.destroy(id)
    },
    // LIST-----------------------------------------------------------------
    ADD_LIST ({ dispatch, state }, { title, boardId, pos }) {
        return api.list.create({title, boardId, pos})
            .then(() => dispatch('FETCH_BOARD', {id: state.board.id}))
    },
    UPDATE_LIST ({ dispatch, state }, {id, title, pos}) {
        return api.list.update(id, {title, pos})
            .then(() => dispatch('FETCH_BOARD', {id: state.board.id}))
    },
    DELETE_LIST ({ dispatch, state }, {id}) {
        return api.list.destroy(id)
            .then(() => dispatch('FETCH_BOARD', {id: state.board.id}))
    },
    // CARD-----------------------------------------------------------------
    ADD_CARD ({ dispatch, state }, {title, listId, pos}) {
        return api.card.create(title, listId, pos)
            .then(() => dispatch('FETCH_BOARD', {id: state.board.id}))
    },
    FETCH_CARD ({ commit }, { id }) {
        return api.card.fetch(id).then(data => {
            commit('SET_CARD', data.item)
        })
    },
    UPDATE_CARD ({ dispatch, state }, {id, title, description, pos, listId}) {
        return api.card.update(id, {title, description, pos, listId})
            .then(() => dispatch('FETCH_BOARD', {id: state.board.id}))
    },
    DELETE_CARD ({ dispatch, state }, { id }) {
        return api.card.destroy(id)
            .then(() => dispatch('FETCH_BOARD', {id: state.board.id}))
    }



}

export default actions