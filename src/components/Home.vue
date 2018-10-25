<template>
    <div>
        Home
        <div>
            Board List:
            <div v-if="loading">Loading...</div>
            <div v-else>
                <div v-for="board in boards" :key="board.id">
                    {{board}}
                </div>
            </div>
            <ul>
                <li>
                    <router-link to="/board/1">Board 1</router-link>
                </li>
                <li>
                    <router-link to="/board/2">Board 2</router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {board} from '../api'

export default {
    data() {
        return {
            loading: false,
            boards: []
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            this.loading = true

            board.fetch()
                .then(data => {
                    this.boards = data
                })
                .finally(_ => {             // () => {console.log(11)}  같은 표현  _ => {console.log(11)}
                    this.loading = false
                })

            /*
            axios.get('http://localhost:3000/boards')
                .then(res => {
                    this.boards = res.data
                })
                .catch(res => {
                    //console.log(res.response.data)
                    // auth token이 없는 경우 401 ERROR - 로그인 페이지 리다이렉트($router객체 활용)
                    this.$router.replace('/login')
                })
                .finally(() => {
                    this.loading = false
                })
            */
        }
    }
}
</script>

<style>
</style>