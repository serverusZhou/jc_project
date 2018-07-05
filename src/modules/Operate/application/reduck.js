import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from '../apis'
import { ReduckHelper } from 'Utils/helper'
import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

const GET_APPLICATION_LIST = 'spa/operate/application/GET_APPLICATION_LIST'  // 应用列表
const GET_CATE_LIST = 'spa/operate/application/GET_CATE_LIST'  // 分类列表
const GET_APPLICATION_DETAIL = 'spa/operate/application/GET_APPLICATION_DETAIL'  // 应用详情

// ===========================> Actions <=========================== //

// 列表
export const applicationList = arg => dispatch => {
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.application.applicationList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_APPLICATION_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 分类列表
export const cateList = arg => dispatch => {
  fetchData(apis.application.appCate, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_CATE_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 详情页
export const getDetail = arg => dispatch => {
  return new Promise((resolve) => {
    fetchData(dispatch)(apis.application.detail, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_APPLICATION_DETAIL)(res.data))
        resolve({ status: 'success', data: res.data })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 新增&&修改
export const modifyApplication = arg => dispatch => {
  let url = apis.application.add
  if (arg.appId) {
    url = apis.application.edit
  }
  return new Promise((resolve) => {
    fetchData(dispatch)(url, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 更新
export const updateApp = arg => dispatch => {
  return new Promise((resolve) => {
    fetchData(dispatch)(apis.application.update, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 提交审核
export const auditApp = arg => dispatch => {
  return new Promise((resolve) => {
    fetchData(dispatch)(apis.common.auditConfirm, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 上下架
export const lowerApp = arg => dispatch => {
  return new Promise((resolve) => {
    fetchData(dispatch)(apis.application.updateEnabled, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 审核记录
export const auditRecord = arg => dispatch => {
  return new Promise((resolve) => {
    fetchData(dispatch)(apis.application.audit, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success', data: res.data })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 删除
export const deleteApp = arg => dispatch => {
  return new Promise((resolve) => {
    fetchData(dispatch)(apis.application.delete, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  ...ReduckHelper.genListState('application', {})
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_LIST:
      return ReduckHelper.resolveListState('application', state, action.payload)
    case GET_APPLICATION_DETAIL:
      return {
        ...state,
        detail: action.payload,
      }
    case GET_CATE_LIST:
      return {
        ...state,
        cateList: action.payload,
      }
    default:
      return state
  }
}
