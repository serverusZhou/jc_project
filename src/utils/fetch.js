import storage from './storage'
import axios from 'axios'
import { message } from 'antd'
import { operateUrl, resourceUrl, tvmallReqUrl } from '../config'
import * as urls from 'Global/urls'
import { showSpin, showBtnSpin, showListSpin, SHOW_BUTTON_SPIN, SHOW_LIST_SPIN } from 'Global/action'

function fetcherCreator(url, userInfo) {
  const fetcher = axios.create({
    method: 'post',
    baseURL: url,
    withCredentials: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'ticket': userInfo && userInfo.ticket,
    }
  })

  fetcher.interceptors.request.use(function (config) {
    const userInfo = storage.get('userInfo')
    config.headers = {
      ...config.headers,
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'ticket': userInfo && userInfo.ticket
    }
    if (!config.data) { // 解决不传参时，Content-Type 不生效，服务器返回 415 的问题
      config.data = {}
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })

  fetcher.interceptors.response.use(function (response) {
    if (response.data.code === 120101) {
      storage.clear()
      location.href = urls.LOGIN
      return
    }
    return response.data
  }, function (error) {
    return Promise.reject(error)
  })

  return fetcher
}

// 根据类型获取loading action
const getLoadingFn = (spinType) => {
  let loadingFn = showSpin
  if (spinType === SHOW_LIST_SPIN) {
    loadingFn = showListSpin
  } else if (spinType === SHOW_BUTTON_SPIN) {
    loadingFn = showBtnSpin
  }
  return loadingFn
}

// 包装fetch
const fetchGenerator = poster => (dispatch, spinType) => {
// 如果dispatch不为函数，则说明不需要loading效果，直接发送请求
  if (typeof dispatch === 'function') {
    const loadingFn = getLoadingFn(spinType)
    return (api, arg, mes = '正在加载数据...') =>
      new Promise((resolve, reject) => {
        dispatch(loadingFn({ bool: true, content: mes }))
        return poster(api, arg)
          .then(res => {
            dispatch(loadingFn({ bool: false, content: '' }))
            resolve(res)
          }).catch(error => {
            console.error('*** fetch error ***', error)
            dispatch(loadingFn({ bool: false, content: '' }))
            message.error('请求异常')
            reject(error)
          })
      })
  } else {
    const api = dispatch
    const arg = spinType
    return new Promise((resolve, reject) => {
      return poster(api, arg)
        .then(res => {
          resolve(res)
        }).catch(error => {
          console.error('*** fetch error ***', error)
          message.error('请求异常')
          reject(error)
        })
    })
  }
}

const userInfo = storage.get('userInfo')
const defaultFetcher = fetcherCreator(operateUrl, userInfo)
const resourceFetcher = fetcherCreator(resourceUrl, userInfo)
const tvMallFetcher = fetcherCreator(tvmallReqUrl, userInfo)

export default fetchGenerator(defaultFetcher.post)
export const fetchResource = fetchGenerator(resourceFetcher.post)
export const fetchTvMall = fetchGenerator(tvMallFetcher.post)
