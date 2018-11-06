import axios from 'axios'
import router from '../router'

const DOMAIN = 'http://localhost:3000'
const UNAUTHORIZED = 401
const onUnauthorized = () => {
    router.push(`/login?rPath=${encodeURIComponent(location.pathname)}`)
}

const request = (method, url, data) => {
    return axios({
        method,
        url: DOMAIN + url,
        data
    }).then(result => result.data)
      .catch(result => {
          const {status} = result.response
          if (status === UNAUTHORIZED) onUnauthorized()
          throw result.response
      })
}

// header에 accessToken을 담는다 -->  'Authorization' = 'Bearer accessTokenValue'
const setAuthInHeader = token => {
  axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : null;
}

// login API
const auth = {
    // Login  /  curl -X POST localhost:3000/login -d 'email=test@test.com&password=123123'
    login(email, password) {
        return request('post', '/login', {email, password})
    }
}

// boards API
const board = {
    // GET board list  /  curl localhost:3000/boards -H 'Authorization: Bearer token'
    // Get board  /  curl localhost:3000/boards/1 -H 'Authorization: Bearer token'
    fetch(id) {
        return id ? request('get', `/boards/${id}`) : request('get', '/boards')
    },
    // Add board  /  curl -X POST localhost:3000/boards -H 'Authorization: Bearer token' -d "title=string"
    create(title) {
        return request('post', '/boards', { title })
    },
    // Edit board  /  curl -X PUT localhost:3000/boards/1 -H 'Authorization: Bearer token' -d "title=string&bgColor=string"
    update(id, payload) {
        return request('put', `/boards/${id}`, payload)
    },
    // Delete board  /  curl -X DELETE localhost:3000/boards/1 -H 'Authorization: Bearer token'"
    destroy(id) {
        return request('delete', `/boards/${id}`)
    }
}

// list API
const list = {
    // Add list  / curl -X POST localhost:3000/lists -H 'Authorization: Bearer token' -d "title=string&boardId=number&pos=number"
    create(payload) {
        return request('post', '/lists', payload)
    },
    // Edit list  / curl -X PUT localhost:3000/lists/1 -H 'Authorization: Bearer token' -d "title=string&pos=number"
    update(id, payload) {
        return request ('put', `/lists/${id}`, payload)
    },
    // Delete list  / curl -X DELETE localhost:3000/lists/1 -H 'Authorization: Bearer token'
    destroy(id) {
        return request('delete', `/lists/${id}`)
    }
}

// card API
const card = {
    // Add card  /  curl -X POST localhost:3000/cards -H 'Authorization: Bearer token' -d "title=string&listId=number&pos=number"
    create(title, listId, pos) {
        return request('post', '/cards', {title, listId, pos})
    },
    // Get card  /  curl localhost:3000/cards/1 -H 'Authorization: Bearer token'
    fetch(id) {
        return request('get', `/cards/${id}`)
    },
    // Edit card  /  curl -X PUT localhost:3000/cards/1 -H 'Authorization: Bearer token' -d "title=string&description=string&listId=number&pos=number"
    update(id, payload) {
        return request('put', `/cards/${id}`, payload)
    },
    // Delete card  /  curl -X DELETE localhost:3000/cards/1 -H 'Authorization: Bearer token'
    destroy(id) {
        return request('delete', `/cards/${id}`)
    }
}

export {
    setAuthInHeader,
    auth,
    board,
    list,
    card
}