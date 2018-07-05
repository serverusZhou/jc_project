import { createAction } from 'redux-actions'
import { message } from 'antd'
import storage from 'Utils/storage.js'
import fetchData from 'Utils/fetch_mail'
import { UPLOAD_CONST } from 'Utils/config'
import { mailApi as api } from 'Global/apis'

// ===========================> Action Types <=========================== //
const GLOBAL_TABLE_DATA_LIST = 'GLOBAL_TABLE_DATA_LIST'
const GLOBAL_PAGING_BOJECT = 'GLOBAL_PAGING_BOJECT'
const GLOBAL_SWITCH_LOADING = 'GLOBAL_LOADING'
const GLOBAL_QINIU_TOKEN = 'GLOBAL_QINIU_TOKEN' // 七牛token
const GLOBAL_SHOW_SPIN = 'GLOBAL_SHOW_SPIN'
const GLOBAL_SHOW_SPIN_TIP = 'GLOBAL_SHOW_SPIN_TIP'
const SET_LOGIN_USER = 'SET_LOGIN_USER'

// ===========================> Actions <=========================== //
export const globalTableListAction = payload => createAction(GLOBAL_TABLE_DATA_LIST)(payload)
export const globalPagingAction = payload => createAction(GLOBAL_PAGING_BOJECT)(payload)
export const globalQiniuTokenAction = payload => createAction(GLOBAL_QINIU_TOKEN)(payload)
export const globalShowSpinAction = payload => createAction(GLOBAL_SHOW_SPIN)(payload)
export const globalShowSpinTipAction = payload => createAction(GLOBAL_SHOW_SPIN_TIP)(payload)
export const setLoginUser = payload => createAction(SET_LOGIN_USER)(payload)

// 获取七牛token  ajax命名规范， 前面加fetch，便于识别
export const fetchQiniuToken = key => dispatch => {
  const timeStr = String(new Date().getSeconds().toString(16) + Math.random())
  fetchData(dispatch, api.qiniuToken, { key: timeStr }).then(res => {
    if (res && res.code === 0) {
      dispatch(globalQiniuTokenAction(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const getLoginMenu = args => dispatch => {
  fetchData(dispatch, api.getLoginMenu, args).then(res => {
    if (res && res.code === 0) {
      storage.set('user', res.data)
      dispatch(setLoginUser(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// ===========================> Reducer <=========================== //
const initialState = {
  list: [],
  currentPage: 1,
  pageSize: 10,
  total: 0,
  showSpinBool: false,
  showSpinTip: '',
  isLoading: false,
  loginUser: {}
  // treeData: [],
  // citySelect: [],
}

export const globalReduck = (state = initialState, action) => {
  switch (action.type) {
    case GLOBAL_TABLE_DATA_LIST:
      return {
        ...state,
        list: action.payload
      }
    case GLOBAL_PAGING_BOJECT:
      return {
        ...state,
        currentPage: action.payload.currentPage,
        pageSize: action.payload.pageSize,
        total: action.payload.total
      }
    case GLOBAL_SWITCH_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    case GLOBAL_QINIU_TOKEN:
      return {
        ...state,
        qiniuToken: {
          accessKeyId: action.payload.accessKeyId,
          securityToken: action.payload.securityToken,
          bucket: action.payload.bucket,
          accessKeySecret: action.payload.accessKeySecret,
          domain: action.payload.domain,
          expiration: action.payload.expiration,
          region: UPLOAD_CONST.region,
        }
      }
    case GLOBAL_SHOW_SPIN:
      return {
        ...state,
        showSpinBool: action.payload
      }
    case GLOBAL_SHOW_SPIN_TIP:
      return {
        ...state,
        showSpinTip: action.payload
      }
    case SET_LOGIN_USER:
      return {
        ...state,
        loginUser: action.payload
      }
    default:
      return state
  }
}
