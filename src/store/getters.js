const getters = {
    isAuth: (state) => {
        return !!state.token    // !!해서 존재여부를 boolean값으로 바꿔줌
    }
}

export default getters