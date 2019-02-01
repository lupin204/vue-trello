# Vue.js로 Trello 만들기 (Clone Coding)

- 셋팅
  - vue-cli 모듈 설치
  ```sh
  >npm install -g vue-cli
  ```
  - vue 프로젝트 생성
  ```sh
  >vue init webpack-simple vue-trello
  Use sass? No (나머지는 그냥 엔터)
  ```
  >**`(참고) vue-cli template 종류`**<br>
  명령어 = vue list<br>
    <b>browserify</b> - A full-featured Browserify + vueify setup with hot-reload, linting & unit testing.<br>
    <b>browserify-simple</b> - A simple Browserify + vueify setup for quick prototyping.<br>
    <b>pwa</b> - PWA template for vue-cli based on the webpack template<br>
    <b>simple</b> - The simplest possible Vue setup in a single HTML file<br>
    <b>webpack</b> - A full-featured Webpack + vue-loader setup with hot reload, linting, testing & css extraction.<br>
    <b>webpack-simple</b> - A simple Webpack + vue-loader setup for quick prototyping.<br>


  - 서버 구동 후 <http://localhost:8080> 에서 "Vue.js App" 확인
  ```sh
  >cd vue-trello
  >npm install
  >npm run dev
  ```
  - GIT repository
  ```sh
  >git init
  >git remote add origin https://github.com/lupin204/vue-trello.git
  >git add .
  >git commit -m "setup"
  >git push origin master
  ```

- dependencies
  ```sh
  >npm i vue-router --save
  >npm i vue-router --save-dev    // 배포시 반영x
  ```
  - vue-router
  - axios
  - dragula   (drag n drop lib.)
  - vuex

- axios
  - axios는 CORS(Cross-Origin Resource Sharing) 에 대하여 
  항상 request(GET/POST/PUT/DELETE) 보내기 전에 request(OPTIONS)를 먼저 보낸다 (보안때문인거같다)
    - (관련링크) https://developer.mozilla.org/ko/docs/Web/HTTP/Access_control_CORS#%EC%82%AC%EC%A0%84_%EC%9A%94%EC%B2%AD
  - axios는 'application/json' 사용하고, jQuery는 'application/x-www-form-urlencoded' 사용한다
  - 'application/json' - axios 는 항상 preflighted(사전전달)을 수행한다 = request(OPTIONS)를 먼저 보낸다

- vuex
  - 상태  -  state  -  mapState
  - Component 간에 공유할 data 속성
    ```js
    // 기본컨셉
    this.$store.state.isAddBoard
    // vuex
    computed: ...mapState([
      'isAddBoard'
    ])
    ```
  - 게터  -  getter  -  mapGetter  (computed와 유사한 성격)
    ```js
    computed: ...mapGetters([
      'isAddBoard'
    ])
    ```
  - 변이  -  mutation  -  mapMutations  (동적 변이)
    ```js
    // 기본컨셉
    this.$store.commit('SET_IS_ADD_BOARD', true)
    // vuex
    methods: ...mapMutations([
      'SET_IS_ADD_BOARD'
    ])
    this.SET_IS_ADD_BOARD(false)
    ```
  - 액션  -  action  -  mapActionss  (비동기 로직)
    ```js
    // 기본컨셉
    this.$store.dispatch('ADD_BOARD', {title: this.input})    // (action함수, {payload})
    // vuex
    methods: ...mapActions([
      'ADD_BOARD'
    ])
    this.ADD_BOARD({title: this.input})
    ```
- Component의 this
  - $attrs
  - $children
  - $createElement
  - $el
  - $listeners
  - $options
  - $parent
  - $refs
  - $root
  - $scopedSlots
  - $slots
  - $store
  - $vnode

- API 추가 과정
  1. /api/index.js 에 request api 추가
  2. actions.js 에 action 추가
  3. 필요시 mutations.js 추가 & state.js 추가


- 배열과 유사배열
  - 배열  :  Array.isArray(arr) = true
  - 유사배열  :  Array.isArray(nodes) = false
    - key가 숫자 이고, length 속성을 가지고 있는 객체
    - Array 함수 (forEach, map, reduce 등) 사용할 수 없다
    - { 0 : 'a', 1: 'b', length: 2} 와 같은식으로 key를 숫자로 만들고 length 속성을 넣어주면 배열처럼 보임
  ```js
    var arr = [1, 2, 3]     // 배열 
    var nodes = document.querySelectorAll('div')    // 유사배열
    var qqq = { 0 : 'a', 1: 'b', length: 2}         // 일부러 생성한 유사배열

    Array.isArray(arr) = true     // arr instanceof Array = true
    Array.isArray(nodes) = false  // nodes instanceof Array = false

    arr.forEach(function(elem) { console.log(elem) })
    nodes.forEach(function(elem) { console.log(elem) })     // ERROR !!

    // 유사배열에서 배열함수를 사용하려면??
    Array.from(qqq).forEach(elem => console.log(elem))    // ES6 ( IE x <-- Array.from() )
    Array.prototype.forEach.call(qqq, function(elem) { console.log(elem) })   // ES5
  ```