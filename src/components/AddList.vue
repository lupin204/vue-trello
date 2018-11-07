<template>
    <div class="add-list">
        <input v-if="isAddList" type="text" class="form-control" v-model="inputTitle"
            ref="inputTitle" v-on:blur="restoreTitle" v-on:keyup.enter="onSubmitTitle">
        <a v-else href="" v-on:click.prevent="onAddList">&plus; Add another List</a>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default{
    data() {
        return {
            isAddList: false,           // 토글 상태값
            inputTitle: ''
        }
    },
    computed: {
        ...mapState({
            board: 'board'
        })
    },
    methods: {
        ...mapActions([
            'ADD_LIST'
        ]),
        onAddList() {
            this.isAddList = true
            // isAddList 상태값 토글 -> nextTick(setTimeout) -> focus()
            this.$nextTick(() => this.$refs.inputTitle.focus())
        },
        onSubmitTitle() {
            this.inputTitle = this.inputTitle.trim()
            if (!this.inputTitle) return this.restoreTitle()

            const title = this.inputTitle
            const boardId = this.board.id
            // 마지막 리스트가 있으면 그 pos의 2배값 아니면(리스트 첫 생성) 기본값 65535
            const lastList = this.board.lists[this.board.lists.length - 1]
            const pos = lastList ? lastList.pos * 2 : 65535

            this.ADD_LIST({title, boardId, pos})
                .then(() => this.restoreTitle())

        },
        restoreTitle() {    // onBlurTitle
            this.isAddList = false
            this.inputTitle = ''
        }

    }
}
</script>

<style>
.add-list {
    background-color: rgba(0,0,0,.1);
    padding: 12p;
    transition: all .3s
}
.add-list a {
    color: #ddd;
}
.add-list:hover,
.add-list:focus {
    background-color: rgba(0,0,0,.3);
}
</style>
