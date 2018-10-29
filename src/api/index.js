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

// GET boards
const board = {
    fetch(id) {
        return id ? request('get', `/boards/${id}`) : request('get', '/boards')
    },
    create(title) {
        return request('post', '/boards', { title })
    }
}

// POST login
const auth = {
    login(email, password) {
        return request('post', '/login', {email, password})
    }
}

export {
    setAuthInHeader,
    board,
    auth
}