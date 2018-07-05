import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from '../apis'
import { ReduckHelper } from 'Utils/helper'
import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //
const GET_HOMERECO_LIST = 'spa/operate/homeReco/GET_HOMERECO_LIST'  // 订单列表
export const GET_LAYOUT_LIST = 'spa/operate/homeReco/GET_LAYOUT_LIST'  // 订单列表
const GET_NEW_CHANNEL = 'spa/operate/homeReco/GET_NEW_CHANNEL'  // 新增频道
// ===========================> Actions <=========================== //
export const homeRecoList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.homeReco.homeRecoList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_HOMERECO_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })
export const addLayout = arg => dispatch =>
  fetchData(dispatch)(apis.homeReco.addLayout, arg).then(res => {
    if (res.code === 0) {
      message.success('新增成功')
      // dispatch(createAction(GET_HOMERECO_LIST)({ ...res.data, filter: arg }))
      dispatch(listLayout({ channelId: arg.channelId }))
    } else {
      message.error(res.errmsg)
    }
  })

export const deleteLayout = (arg, channelId) => dispatch =>
  fetchData(dispatch)(apis.homeReco.deleteLayout, arg).then(res => {
    if (res.code === 0) {
      message.success('删除成功')
      // dispatch(createAction(GET_HOMERECO_LIST)({ ...res.data, filter: arg }))
      dispatch(listLayout({ channelId }))
    } else {
      message.error(res.errmsg)
    }
  })

export const bindContent = (arg, channelId, callback) => dispatch =>
  fetchData(dispatch)(apis.homeReco.bindContent, arg).then(res => {
    if (res.code === 0) {
      // 处理运营图 如果运营图为空默认调用删除接口
      const url = arg.operaterPic ? apis.operaterpic.add : apis.operaterpic.delete
      const param = { operaterPic: arg.operaterPic, sourceId: arg.layoutBindId, source: '1' }
      fetchData(url, param).then(result => {
        if (result.code === 0) {
          message.success('新增成功')
          callback()
          dispatch(listLayout({ channelId }))
        } else {
          message.error(result.errmsg)
        }
      })
    } else {
      message.error(res.errmsg)
    }
  })
export const addChannel = arg => dispatch =>
  fetchData(dispatch)(apis.homeReco.addChannel, arg).then(res => {
    if (res.code === 0) {
      message.success('新增成功')
      return res.data
    } else {
      message.error(res.errmsg)
      return false
    }
  })

export const editLayout = (arg, channelId) => dispatch =>
  fetchData(dispatch)(apis.homeReco.editLayout, arg).then(res => {
    if (res.code === 0) {
      dispatch(listLayout({ channelId }))
      return res.data
    } else {
      message.error(res.errmsg)
      return false
    }
  })

export const listLayout = arg => dispatch =>
  fetchData(dispatch)(apis.homeReco.listLayout, arg).then(res => {
    if (res.code === 0) {
      // message.success('新增成功')
      dispatch(createAction(GET_LAYOUT_LIST)({ ...res }))
    } else {
      message.error(res.errmsg)
    }
  })
export const enableChannel = arg => dispatch => {
  return new Promise((resolve, reject) => {
    fetchData(dispatch, SHOW_LIST_SPIN)(apis.homeReco.enableChannel, arg).then(res => {
      if (res.code === 0) {
        message.success('操作成功')
        resolve({ status: 'success' })
        dispatch(createAction(GET_LAYOUT_LIST)({ ...res }))
      } else {
        message.error(res.errmsg)
        resolve({ status: 'error' })
      }
    })
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  ...ReduckHelper.genListState('homeReco', {}),
}

const resolveListState = (key, state, payload) => {
  const { filter, result, data, channelVOs, channelVOResList } = payload
  return {
    ...state,
    [`${key}Filter`]: filter,
    [`${key}List`]: result || data || channelVOs || channelVOResList,
    [`${key}Page`]: {
      pageNo: payload.currentPage,
      records: payload.records,
      pageSize: payload.pageSize,
    },
  }
}
export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_HOMERECO_LIST:
      // return ReduckHelper.resolveListState('homeReco', state, action.payload)
      return resolveListState('homeReco', state, action.payload)
    case GET_NEW_CHANNEL:
      // return ReduckHelper.resolveListState('homeReco', state, action.payload)
      return ({ ...state, homeRecoChannel: action.payload })
    case GET_LAYOUT_LIST:
      return ReduckHelper.resolveListState('layout', state, action.payload)
    default:
      return state
  }
}
