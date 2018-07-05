import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from '../apis'
import { ReduckHelper } from 'Utils/helper'
import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //
export const GET_USER_LIST = 'spa/operate/user/GET_USER_LIST'
export const GET_COLLECT_LIST = 'spa/operate/user/GET_COLLECT_LIST'
export const GET_MAC_LIST = 'spa/operate/user/GET_MAC_LIST'
export const GET_ACCOUNT_LIST = 'spa/operate/user/GET_ACCOUNT_LIST'

// ===========================> Actions <=========================== //
export const userList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.user.userList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_USER_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })

export const collectList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.user.collectList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_COLLECT_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })

export const macList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.user.macList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_MAC_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })

export const accountList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.user.accountList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_ACCOUNT_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })

export const enableUser = arg => dispatch => {
  return new Promise((resolve) => {
    fetchData(dispatch)(apis.user.userEnable, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success' })
      } else {
        message.error(res.errmsg)
        resolve({ status: 'error' })
      }
    })
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  ...ReduckHelper.genListState('user', {}),
  ...ReduckHelper.genListState('collect', {}),
  ...ReduckHelper.genListState('mac', {}),
  ...ReduckHelper.genListState('account', {}),
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_USER_LIST:
      return ReduckHelper.resolveListState('user', state, action.payload)
    case GET_COLLECT_LIST:
      return ReduckHelper.resolveListState('collect', state, action.payload)
    case GET_MAC_LIST:
      return ReduckHelper.resolveListState('mac', state, action.payload)
    case GET_ACCOUNT_LIST:
      return ReduckHelper.resolveListState('account', state, action.payload)
    default:
      return state
  }
}
