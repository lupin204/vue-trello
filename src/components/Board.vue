<template>
    <div>
        <div class="board-wrapper">
            <div class="board">
                <div class="board-header">
                    <input class="form-control" v-if="isEditTitle" type="text" v-model="inputTitle"
                        ref="inputTitle" v-on:blur="onSubmitTitle" v-on:keyup.enter="onSubmitTitle">
                    <span v-else class="board-title" v-on:click="onClickTitle" >{{board.title}}</span>
                    <a class="board-header-btn show-menu" href="" v-on:click.prevent="onShowSettings">... Show Menu</a>
                </div>
                <div class="list-section-wrapper">
                    <div class="list-section">
                        <div class="list-wrapper" v-for="list in board.lists" :key="list.pos" v-bind:data-list-id="list.id">
                            <List :data="list" />
                        </div>
                        <div class="list-wrapper">
                            <AddList />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <BoardSettings v-if="isShowBoardSettings" />
        <router-view></router-view>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import List from './List.vue'
import AddList from './AddList.vue'
import BoardSettings from './BoardSettings.vue'
import dragger from '../utils/dragger'

export default {
    components: { List, AddList, BoardSettings },
    data() {
        return {
            bid: 0,
            loading: false,
            cardDragger: null,          // card 이동 관련 dragula 모듈 객체
            listDragger: null,          // list 이동 관련 dragula 모듈 객체
            isEditTitle: false,         // board 타이틀 수정하는 input영역 토글 여부
            inputTitle: ''
        }
    },
    computed: {
        ...mapState({
            board: 'board',
            isShowBoardSettings: 'isShowBoardSettings'
        })
    },
    created() {
        this.fetchData().then(() => {
            this.inputTitle = this.board.title
            this.SET_THEME(this.board.bgColor)
        })
        this.SET_IS_SHOW_BOARD_SETTINGS(false)
    },
    updated() {         // 자식이 모두 mounted() 되는 시점
        this.setCardDraggable()
        this.setListDraggable()
    },
    methods: {
        ...mapMutations([
            'SET_THEME',
            'SET_IS_SHOW_BOARD_SETTINGS'
        ]),
        ...mapActions([
            'FETCH_BOARD',
            'UPDATE_CARD',
            'UPDATE_BOARD',
            'UPDATE_LIST'
        ]),
        fetchData() {
            this.loading = true
            return this.FETCH_BOARD({id: this.$route.params.bid})
                .then(() => this.loading = false);
        },
        onShowSettings() {
            this.SET_IS_SHOW_BOARD_SETTINGS(true)
        },
        onClickTitle() {
            this.isEditTitle = true
            // $nextTick() : 약간의 setTimeout 트릭을 제공
            this.$nextTick(() => this.$refs.inputTitle.focus())
        },
        onSubmitTitle() {
            this.isEditTitle = false

            this.inputTitle = this.inputTitle.trim()
            if (!this.inputTitle) return

            const id = this.board.id
            const title = this.inputTitle
            if (title === this.board.title) return

            this.UPDATE_BOARD({ id, title })
        },
        setCardDraggable() {
            if (this.cardDragger) this.cardDragger.destroy()

            // 유사배열 -> 배열로 변환하여 Array함수(forEach, reduce...) 사용하도록 변환
            //let cDraggerContainer = Array.from(this.$el.querySelectorAll('.card-list'))
            this.cardDragger = dragger.init(Array.from(this.$el.querySelectorAll('.card-list')))

            this.cardDragger.on('drop', (elem, wrapper, target, siblings) => {
                const targetCard = {
                    id: parseInt(elem.dataset.cardId),
                    listId: parseInt(wrapper.dataset.listId),
                    pos: 65535
                }

                const { prevCard, nextCard } = dragger.siblings({
                    elem,
                    wrapper,
                    candidates: Array.from(wrapper.querySelectorAll('.card-item')),
                    type: 'card'
                })

                // 이동하려는 card의 drop위치(이동된위치)가 맨앞에 있는 경우 -> 이동하려는 card의 position 값은 다음 card position값의 절반
                if (!prevCard && nextCard) targetCard.pos = nextCard.pos / 2
                // 이동하려는 card의 drop위치(이동된위치)가 맨뒤에 있는 경우 -> 이동하려는 card의 position 값은 이전 card position값의 2배
                else if (!nextCard && prevCard) targetCard.pos = prevCard.pos * 2
                // 이동하려는 card의 drop위치(이동된위치)가 중간에 있는 경우 -> 이동하려는 card의 position 값은 이전 card position, 다음 card position 의 사이값
                else if (prevCard && nextCard) targetCard.pos = (prevCard.pos + nextCard.pos) / 2

                this.UPDATE_CARD(targetCard)
                console.log('move-card')
                console.log(this.board)
            })
        },
        setListDraggable() {
            if (this.listDragger) this.listDragger.destroy()

            const options = {
                invalid: (el, handle) => !/^list/.test(handle.className)
            }

            // 유사배열 -> 배열로 변환하여 Array함수(forEach, reduce...) 사용하도록 변환
            //let listDraggerContainer = Array.from(this.$el.querySelectorAll('.list-section'))
            this.listDragger = dragger.init(Array.from(this.$el.querySelectorAll('.list-section')), options)

            this.listDragger.on('drop', (elem, wrapper, target, siblings) => {
                const targetList = {
                    id: parseInt(elem.dataset.listId),      // dataset.listId  =  v-bind:data-list-id="list.id"
                    pos: 65535
                }

                const { prevList, nextList } = dragger.siblings({
                    elem,
                    wrapper,
                    candidates: Array.from(wrapper.querySelectorAll('.list')),
                    type: 'list'
                })

                // 이동하려는 list의 drop위치(이동된위치)가 맨앞에 있는 경우 -> 이동하려는 list의 position 값은 다음 list position값의 절반
                if (!prevList && nextList) targetList.pos = nextList.pos / 2
                // 이동하려는 list의 drop위치(이동된위치)가 맨뒤에 있는 경우 -> 이동하려는 list의 position 값은 이전 list position값의 2배
                else if (!nextList && prevList) targetList.pos = prevList.pos * 2
                // 이동하려는 list의 drop위치(이동된위치)가 중간에 있는 경우 -> 이동하려는 list의 position 값은 이전 list position, 다음 list position 의 사이값
                else if (prevList && nextList) targetList.pos = (prevList.pos + nextList.pos) / 2

                this.UPDATE_LIST(targetList)
                console.log('move-list')
                console.log(this.board)
            })
        }
    }
}
</script>

<style>
.board-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
.board {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.board-header {
  flex: none;
  padding: 8px 4px 8px 8px;
  margin: 0;
  height: 32px;
  line-height: 32px;
} 
.board-header input[type=text] {
  width: 200px;
}
.board-header-btn {
  border-radius: 4px;
  padding: 2px 10px;
  height: 30px;
  margin-bottom: 15px;
  display: inline-block;
  color: #fff;
}
.board-header-btn:hover,
.board-header-btn:focus {
  background-color: rgba(0,0,0,.15);
  cursor: pointer;
}
.board-title {
  font-weight: 700;
  font-size: 18px;
}
.show-menu {
  font-size: 14px;
  position: absolute;
  right: 15px;
}
.list-section-wrapper {
  flex-grow: 1;
  position: relative;
}
.list-section {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 0 10px;
}
.list-wrapper {
  display: inline-block;
  height: 100%;
  width: 272px;
  vertical-align: top;
  margin-right: 5px;
}
.card-item.gu-transit {
  background-color: #555 !important;
}
.card-item.gu-mirror {
  opacity: 1 !important;
  background-color: #fff !important;
  transform: rotate(3deg) !important;
}
</style>