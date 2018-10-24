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