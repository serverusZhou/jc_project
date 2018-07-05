import { message } from 'antd'
import fetchData, { fetchResource } from 'Utils/fetch'
import { createAction } from 'redux-actions'
import apis from './apis'
import { SHOW_LIST_SPIN } from 'Global/action'
import { ReduckHelper } from 'Utils/helper'

import { reducer as advertise } from './advertise/reduck'
import { reducer as homeReco } from './homeReco/reduck'
import { reducer as game } from './game/reduck'
import { reducer as order } from './order/reduck'
import { reducer as service } from './service/reduck'
import { reducer as user } from './user/reduck'
import { reducer as channel } from './channel/reduck'
import { reducer as vedio } from './vedio/reduck'
import { reducer as lookLoop } from './lookLoop/reduck'
import { reducer as application } from './application/reduck'

// ===========================> Action Types <=========================== //

const GET_EPISODE_LIST = 'Operate/GET_EPISODE_LIST'
const GET_CATE_LIST = 'Operate/GET_CATE_LIST'
const AUDIT_DETAILS = 'Operate/AUDIT_DETAILS'

// ===========================> Actions <=========================== //
// 审核
export const auditConfirm = (arg, callback) => dispatch => {
  return new Promise((resolve, reject) => {
    fetchData(dispatch)(apis.common.auditConfirm, arg).then(res => {
      if (res.code === 0) {
        message.success('提交成功！')
        callback && callback()
        resolve({ status: 'success' })
      } else {
        message.error(res.errmsg)
        resolve({ status: 'error' })
      }
    })
  })
}
export const auditDetails = (arg) => dispatch => {
  return new Promise((resolve, reject) => {
    fetchData(dispatch)(apis.common.auditDetails, arg).then(res => {
      if (res.code === 0) {
        // message.success('操作成功')
        dispatch(createAction(AUDIT_DETAILS)({ ...res }))
        resolve({ ...res.data, status: 'success' })
      } else {
        message.error(res.errmsg)
        resolve({ status: 'error' })
      }
    })
  })
}
// 视频资源
export const getEpisodeList = (arg, callback) => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.common.episodeList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_EPISODE_LIST)({ ...res.data, filter: arg }))
      // message.success('提交成功！')
      // callback(res)
    } else {
      message.error(res.errmsg)
    }
  })
// 分类
export const getCateList = (arg, callback) => dispatch =>
  fetchResource(dispatch, SHOW_LIST_SPIN)(apis.common.cateList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_CATE_LIST)({ ...res, filter: arg }))
      return res.data
    } else {
      message.error(res.errmsg)
      return false
    }
  })

// ===========================> Reducer <=========================== //

const initialState = {
  ...ReduckHelper.genListState('episode', {}),
}

const resolveListState = (key, state, payload) => {
  const { filter, result, data, msEpisodeVOList, ...page } = payload
  return {
    ...state,
    [`${key}Filter`]: filter,
    [`${key}List`]: result || data || msEpisodeVOList,
    [`${key}Page`]: page,
  }
}
export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_EPISODE_LIST: {
      return resolveListState('episode', state, action.payload)
    }
    case GET_CATE_LIST: {
      return { ...state, cateList: action.payload.data }
    }
    case AUDIT_DETAILS: {
      return { ...state, auditDetails: action.payload.data }
    }
    default:
      return state
  }
}

export const reducers = {
  operateCommon: reducer,
  advertise,
  homeReco,
  game,
  order,
  service,
  user,
  channel,
  lookLoop,
  vedio,
  application,
}
