import axios from 'axios'
import model from './model'
import router from '../router'

const { stor, Board, List, Card } = model

 const domain = 'http://localhost:3000'
 axios.defaults.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTQxNDkyMTEwLCJleHAiOjE1NzMwMjgxMTB9.lA5Tz546P0KaieQ830bDrgaMz3_6CIN3yaw9INCNsP4'
// const Unauthorized = 401
// const onUnauthorized = () => {
//   router.push(`/login?returnPath=${encodeURIComponent(location.pathname)}`)
// }

const request = {
  get(path) {
    return axios.get(`${domain + path}`)
      .catch(({response}) => {
        const {status} = response
        if (status === Unauthorized) return onUnauthorized()
        throw Error(response)
      })
  },
  post(path, data) {
    return axios.post(`${domain + path}`, data)
  },
  delete(path) {
    return axios.delete(`${domain + path}`)
  },
  put(path, data) {
    return axios.put(`${domain + path}`, data)
  }
}

// export const setAuthInHeader = token => {
//   axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : null;
// }

// export const auth = {
//   login(email, password) {
//     return request.post('/login', {email, password})
//       .then(({data}) => data)
//   }
// }

export const board = {
  fetchAll() {
    // return request.get('/boards').then(({data}) => data)
    return new Promise((resolve, reject) => {
      const boardArrays = stor.getBoards()
      resolve({ list: boardArrays })
    })
  },
  fetch(id) {
    // return request.get(`/boards/${id}`).then(({ data }) => data)
    return new Promise((resolve, reject) => {
      const board = stor.getBoard(parseInt(id))
      resolve({ item: board })
    })
  },
  create (title) {
    // return request.post('/boards', { title }).then(({ data }) => data)
    return new Promise((resolve, reject) => {
      const board = new Board({ title })
      resolve({ item: stor.addBoard(board) })
    })
  },
  update(id, data) {
    // return request.put(`/boards/${id}`, data).then(({ data }) => data)
    return new Promise((resolve, reject) => {
      resolve({ item: stor.updateBoard(parseInt(id), data) })
    })
  },
  destroy(id) {
    // return request.delete(`/boards/${id}`)
    return new Promise((resolve, reject) => {
      stor.deleteBoard(parseInt(id))
      resolve()
    })
  }
}

export const list = {
  create(data) {   // { title, pos, boardId }
    // return request.post(`/lists`, data).then(({ data }) => data)
    return new Promise((resolve, reject) => {
      const list = new List(data)
      resolve({ item: stor.addList(list) })
    })
  },
  update(id, data) {  // id, { title, pos })
  console.log(data)
    // return request.put(`/lists/${id}`, data).then(({ data }) => data)
    return new Promise((resolve, reject) => {
      resolve({ item: stor.updateList(parseInt(id), data) })
    })
  },
  destroy(id) {
    // return request.delete(`/lists/${id}`).then(({ data }) => data)
    return new Promise((resolve, reject) => {
      stor.deleteList(parseInt(id))
      resolve()
    })
  }
}

export const card = {
  fetch(id) {
    // return request.get(`/cards/${id}`).then(({ data }) => data)
    return new Promise((resolve, reject) => {
      const card = stor.getCard(parseInt(id))
      resolve({ item: card })
    })
  },
  create(data) {  // { title, pos, listId }
    // return request.post(`/cards`, {title, listId, pos}).then(({ data }) => data)
    return new Promise((resolve, reject) => {
      const card = new Card(data)
      resolve({ item: stor.addCard(card) })
    })
  },
  update(id, data) {  // cardId, { id, title, description, pos, listId }
    // return request.put(`/cards/${id}`, data).then(({ data }) => data)
    return new Promise((resolve, reject) => {
      resolve({ item: stor.updateCard(parseInt(id), data) })
    })
  },
  destroy(id) {
    // return request.delete(`/cards/${id}`)
    return new Promise((resolve, reject) => {
      stor.deleteCard(parseInt(id))
      resolve()
    })
  }
}
