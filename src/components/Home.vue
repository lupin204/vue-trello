<template>
    <div>
        <div class="home-title">Personal Boards</div>
        <div class="board-list" ref="boardList">
            <div class="board-item" v-for="board in boards" :key="board.id"
                :data-bgcolor="board.bgColor" ref="boardItem">
                <router-link :to="`/board/${board.id}`">
                    <div class="board-item-title">{{board.title}}</div>
                </router-link>
            </div>
            <div class="board-item board-item-new">
                <a class="new-board-btn" href="" @click.prevent="addBoard">
                    Create new board
                </a>
            </div>
        </div>
        <!-- AddBoard.vue : close() method 실행되면 isAddBoard=false로 바꾸고, v-if에서 false니까 AddBoard는 안보임 -->
        <!-- AddBoard.vue : submit() method 실행되면 Home.vue : onAddBoard() method가 실행된다 -->
        <AddBoard v-if="isAddBoard" @close="isAddBoard=false" @submit="onAddBoard"></AddBoard>
    </div>
</template>

<script>
import { board } from '../api'
import AddBoard from './AddBoard.vue'

export default {
    components: {
        AddBoard
    },
    data() {
        return {
            loading: false,
            boards: [],
            error: '',
            isAddBoard: false       // AddBoard 모달창 활성화여부
        }
    },
    created() {
        this.fetchData()
    },
    updated() {
        console.log(this.$refs.boardItem)
        this.$refs.boardItem.forEach(elem => {
            elem.style.backgroundColor = elem.dataset.bgcolor
        })
    },
    methods: {
        fetchData() {
            this.loading = true

            board.fetch()
                .then(data => {
                    console.log(data.list)
                    this.boards = data.list
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
        },
        addBoard() {
            this.isAddBoard = true
        },
        onAddBoard(title) {
            console.log(title)
            board.create(title)
                .then(() => this.fetchData())
        }
    }
}
</script>

<style>
.home-title {
    padding: 10px;
    font-size: 18px;
    font-weight: bold;
}
.board-list {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
}
.board-item {
    width: 23%;
    height: 100px;
    margin: 0 2% 20px 0;
    border-radius: 3px;
}
.board-item-new {
    background-color: #ddd;
}
.board-item a {
    text-decoration: none;
    display: block;
    width: 100%;
    height: 100%;
}
.board-item a:hover,
.board-item a:focus {
    background-color: rgba(0,0,0, .1);
    color: #666;
}
.board-item-title {
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    padding: 10px;
}
.board-item a.new-board-btn {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    height: 100px;
    width: inherit;
    color: #888;
    font-weight: 700;
}
</style>