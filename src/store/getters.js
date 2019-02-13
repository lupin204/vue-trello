const getters = {
    isAuthenticated(state) {
        return !!state.accessToken  // !!해서 존재여부를 boolean값으로 바꿔줌
    },
    hasBoardList(state) {
        return state.boardList.length > 0
    }
}

export default getters