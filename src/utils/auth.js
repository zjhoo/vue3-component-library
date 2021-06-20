import Cookies from 'js-cookie'

// const TokenKey = 'Admin-Token'  身份验证
//coockies
export function getToken(TokenKey) {
  return Cookies.get()
}

export function setToken(TokenKey,token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken(TokenKey) {
  return Cookies.remove(TokenKey)
}



//localstorage
export function getStorage(key) {
  return localStorage.getItem(key)
}

export function setStorage(key,val) {
  return localStorage.setItem(key, val)
}

export function removeStorage(key) {
  return localStorage.removeItem(key)
}
