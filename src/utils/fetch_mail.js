import storage from './storage'
import axios from 'axios'
import { baseUrl } from './config'
import { globalShowSpinAction, globalShowSpinTipAction } from '../global/globalReduck'
import { notification } from 'antd'

const userInfo = storage.get('userInfo')
const ticket = (userInfo && userInfo.ticket) ? userInfo.ticket : ''

let fetcher = axios.create({
  method: 'post',
  baseURL: baseUrl,
  withCredentials: true,
  transformRequest: [
    function (data) {
      return JSON.stringify(data)
    }
  ],
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }
})

fetcher.interceptors.request.use(
  function (config) {
    if (config && config.data) {
      config.data.accessToken = ticket
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

fetcher.interceptors.response.use(function (response) {
  if (response.data.code === 60001 || response.data.code === 60002 || response.data.code === 60003 ||
    response.data.code === 60004 || response.data.code === 60005) {
    notification['error']({
      message: '警告',
      description: response.data && response.data.errmsg
    })
    setTimeout(() => {
      // todo:测试用
      // storage.clear()
      // location.href = daxiang
    }, 1000)
  } else {
    return response.data
  }
}, function (err) {
  if (err.toString().indexOf('Network Error') >= 0) {
    notification['warning']({
      message: '警告',
      description: '网络异常，请检查当前互联网状态'
    })
  } else if (err.toString().indexOf('Request failed with status code 404')) {
    notification['warning']({
      message: '警告',
      description: '接口异常'
    })
  } else {
    notification['warning']({
      message: '警告',
      description: err.toString()
    })
  }
})

export default function fetch(dispatch, apiUrl, arg, showLoading = true, content = '') {
  showLoading && dispatch(globalShowSpinAction(true))
  content && dispatch(globalShowSpinTipAction(content))
  // request interceptors 已经做过处理，但是偶现accessToken为空的情况，故多加一层判断
  if (arg && !arg.accessToken) {
    arg.accessToken = ticket
  }
  return fetcher.post(apiUrl, arg)
    .then(data => {
      showLoading && dispatch(globalShowSpinAction(false))
      content && dispatch(globalShowSpinTipAction(''))
      if (data) {
        return data
      } else {
        return Promise.reject(data)
      }
    })
}
