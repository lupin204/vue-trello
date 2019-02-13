<template>
  <div>
    <div class="board-wrapper">
      <div class="board">
        <div class="board-header">
          <input v-if="isEditTitle" class="form-control" type="text" v-model="inputTitle"
            ref="inputTitle" @blur="onSubmitTitle" @keyup.enter="onSubmitTitle">
          <span v-else class="board-header-btn board-title" @click="onClickTitle">{{board.title}}</span>
          <a class="board-header-btn show-menu" href="" @click.prevent="onClickShowMenu">... Show Menu</a>
        </div>
        <div class="list-section-wrapper">
          <div class="list-section">
            <div class="list-wrapper" v-for="list in board.lists" :key="list.pos">
              <List :list="list"/>
            </div>
            <div class="list-wrapper">
              <add-list />
            </div>
          </div>
        </div>
        <BoardSettings v-if="isShowBoardMenu"/>
        <router-view :boardId="board.id"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import List from './List.vue'
import AddList from './AddList.vue'
import BoardSettings from './BoardSettings.vue'
import dragger from '../utils/dragger'
import dragula from 'dragula'
import 'dragula/dist/dragula.css'

export default {
  components: { List, AddList, BoardSettings },
  data() {
    return {
      drakeList: null,    // list 이동 관련 dragula 모듈 객체
      drake: null,        // card 이동 관련 dragula 모듈 객체
      isEditTitle: false, // board 타이틀 수정하는 input영역 토글 여부
      inputTitle: ''
    };
  },
  watch: {
    $route() {    // this.$route객체 : 라우팅 변경이 일어날때마다 호출
      this.fetchData()
    }
  },
  computed: {
    ...mapState({
      board: 'board',
      isShowBoardMenu: 'isShowBoardMenu'
    })
  },
  created() {
    this.fetchData().then(_ => {
      this.inputTitle = this.board.title
      this.SET_THEME(this.board.bgColor)
    })
  },
  updated() {   // 자식이 모두 mounted() 되는 시점
    this.setListDraggable()
    this.setCardDraggable()
  },
  methods: {
    ...mapMutations([
      "SET_THEME",
      "SET_IS_SHOW_BOARD_MENU"
    ]),
    ...mapActions([
      "FETCH_BOARD",
      "UPDATE_BOARD",
      "UPDATE_CARD",
      "UPDATE_LIST"
    ]),
    fetchData() {
      return this.FETCH_BOARD(this.$route.params.id)
    },
    onClickTitle() {
      this.isEditTitle = true;
      // $nextTick() : 약간의 setTimeout 트릭을 제공
      this.$nextTick(() => this.$refs.inputTitle.focus());
    },
    onClickShowMenu() {
      this.SET_IS_SHOW_BOARD_MENU(true)
    },
    onSubmitTitle() {
      this.inputTitle = this.inputTitle.trim();
      if (!this.inputTitle) return;

      const id = this.board.id;
      const title = this.inputTitle;
      if (title === this.board.title) return this.isEditTitle = false

      this.UPDATE_BOARD({ id, title })
        .then(_ => (this.isEditTitle = false))
    },
    setCardDraggable() {
      if (this.drake) this.drake.destroy()

      this.drake = dragula([...this.$el.querySelectorAll('.card-list')])
      .on('drop', (el, wrapper, target, silblings) => {
        const targetCard = {
          id: el.dataset.cardId * 1, 
          listId: wrapper.dataset.listId * 1,
          pos: 65535,
        }
        let prevCard = null
        let nextCard = null

        Array.from(wrapper.querySelectorAll('.card-item'))
          .forEach((el, idx, arr) => {
            const cardId = el.dataset.cardId * 1

            if (targetCard.id === cardId) {
              prevCard = idx > 0 ? {
                id: arr[idx - 1].dataset.cardId * 1,
                pos: arr[idx - 1].dataset.cardPos * 1,
              } : null
              nextCard = idx < arr.length - 1 ? {
                id: arr[idx + 1].dataset.cardId * 1,
                pos: arr[idx + 1].dataset.cardPos * 1,
              } : null
            }
          })

        if (!prevCard && nextCard) targetCard.pos = nextCard.pos / 2
        else if (!nextCard && prevCard) targetCard.pos = prevCard.pos * 2
        else if (nextCard && prevCard) targetCard.pos = (prevCard.pos + nextCard.pos) / 2

        this.UPDATE_CARD(targetCard)
      })
    },
    setListDraggable() {
      if (this.drakeList) this.drakeList.destroy()

      const container = this.$el.querySelectorAll('.list-section')
      const options = {
        invalid: (el, handle) => {
          console.log(handle.className)
          return !/^list/.test(handle.className)
        }
      }
      this.drakeList = dragula([...container], options)   // init dragula 'list'

      this.drakeList.on('drop', (el, wrapper, target, siblings) => {
        const targetList = {
          id: el.children[0].dataset.listId * 1, // dataset.listId  =  v-bind:data-list-id="list.id"
          pos: 65535
        }
        let prevList = null
        let nextList = null 

        // [ES6-객체비구조화]
        // const prevList = data.prev
        // const nextList = data.next
        // const { prev: prevList, next: nextList } = data

        // 유사배열 -> 배열로 변환하여 Array함수(forEach, reduce...) 사용하도록 변환
        //let listDraggerContainer = Array.from(this.$el.querySelectorAll('.list-section'))
        Array.from(wrapper.querySelectorAll('.list'))
          .forEach((el, idx, arr) => {
            const listId = null
            const listFound = targetList.id === (el.dataset.listId * 1)

            if (!listFound) return 

            prevList = idx > 0 ? {
              id: arr[idx - 1].dataset.listId * 1,
              pos: arr[idx - 1].dataset.listPos * 1,
            } : null

            nextList = idx < arr.length - 1 ? {
              id: arr[idx + 1].dataset.listId * 1,
              pos: arr[idx + 1].dataset.listPos * 1,
            } : null
          })

        // 이동하려는 list의 drop위치(이동된위치)가 맨앞에 있는 경우 -> 이동하려는 list의 position 값은 다음 list position값의 절반
        if (!prevList && nextList) targetList.pos = nextList.pos / 2
        // 이동하려는 list의 drop위치(이동된위치)가 맨뒤에 있는 경우 -> 이동하려는 list의 position 값은 이전 list position값의 2배
        else if (!nextList && prevList) targetList.pos = prevList.pos * 2
        // 이동하려는 list의 drop위치(이동된위치)가 중간에 있는 경우 -> 이동하려는 list의 position 값은 이전 list position, 다음 list position 의 사이값
        else if (prevList && nextList) targetList.pos = (prevList.pos + nextList.pos) / 2

        this.UPDATE_LIST(targetList)
      });
    }
  }
};
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
  background-color: rgba(0, 0, 0, 0.15);
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
/* .list-wrapper.gu-transit .list {
  background-color: #555 !important;
  color: #555 !important;
  opacity: 1 !important;
}
.list-wrapper.gu-mirror .list {
  opacity: 1 !important;
  background-color: #fff !important;
  transform: rotate(3deg) !important;
} */
</style>