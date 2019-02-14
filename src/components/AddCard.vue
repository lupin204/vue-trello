<template>
  <modal>
    <div slot="header">
      <h2>
        Create new card
        <a href="" class="modal-default-button" @click.prevent="onCloseAddCard">&times;</a>
      </h2>
    </div>
    <div slot="body">
      <form id="add-card-form" @submit.prevent="onSubmitNewCard" >
        <label>Key</label><input class="form-control" type="text" v-model="inputCardTitle" ref="inputCardTitle">
        <label>Value</label><input class="form-control" type="text"  v-model="test" ref="test">
      </form>
    </div>
    <div slot="footer">
      <button class="btn" :class="{'btn-success' : isValidInput}" type="submit" form="add-card-form"
      :disabled="!isValidInput">Create Card </button>
    </div>
  </modal>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Modal from './Modal.vue'

export default {
  components: { Modal },
  // 부모 Component로부터 listId를 받아온다
  // List.vue(부모) 에서 AddCard Component 등록할때 listId를 v-bind로 넘긴다
  props: [ 'pos', 'listId', 'boardId'],
  data() {
    return {
      inputCardTitle: '',
      isValidInput: false,
      test: ''
    }
  },
  watch: {
    inputCardTitle(val) {
      this.isValidInput = !!val.trim().length
    }
  },
  mounted() {
    this.$refs.inputCardTitle.focus()
    //this.setupClickOutside(this.$el)
  },
  methods: {
    ...mapActions([
      'ADD_CARD',
      "FETCH_BOARD"
    ]),
    onSubmitNewCard() {
      // if (this.invalidInput) return
      if (!this.inputCardTitle.trim()) return

      //const pos = this.newCardPos()

      // const inputTitle = this.inputTitle;  const listId = this.listId;
      const { inputCardTitle, pos, listId } = this
      this.ADD_CARD({title: inputCardTitle, listId, pos})
        //.then(_ => this.$router.push(`/board/${boardId}`))
        .finally(_ => {
          // this.SET_IS_ADD_CARD(false)
          this.$emit('close')
        })
    },
    onCloseAddCard() {
      this.$emit('close')
      // this.SET_IS_ADD_CARD(false)
    }
    // newCardPos() {
    //     const curList = this.$store.state.board.lists.filter(elem => elem.id === this.listId)[0]
    //     if (!curList) return 65535
    //     const { cards } = curList
    //     if (!cards.length) return 65535
    //     return cards[cards.length -1].pos * 2
    // },
    // // AddCard Component 밖 영역을 클릭하면 AddCard Component가 닫힌다 
    // // --> 클릭된 e.target이 AddCard 전체영역(this.$el) 안에 포함되면(contains) 닫지않는다(just return)
    // setupClickOutside(el) {
    //     document.querySelector('body').addEventListener('click', e => {
    //         if (el.contains(e.target)) return
    //         this.$emit('close')
    //     })
    // }
  }
}
</script>

<style>
.add-card {
  padding: 10px;
  display: block;
  position: relative;
}
.add-card .cancel-add-btn {
  display: inline-block;
  margin-left: 10px;
  vertical-align: middle;
  text-decoration: none;
  color: #888;
  font-size: 24px;
}
.add-card .cancel-add-btn:hover,
.add-card .cancel-add-btn:focus {
  color: #666;
}
</style>
