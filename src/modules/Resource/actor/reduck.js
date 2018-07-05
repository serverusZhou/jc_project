import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchResource as fetchData } from 'Utils/fetch'
import apis from '../apis'
import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

const SET_ACTOR_LIST = '/spa/resource/SET_ACTOR_LIST' // 演员管理
const SET_ACTOR_DETAIL = '/spa/resource/SET_ACTOR_DETAIL' // 演员管理 演员详情
const RESET_ACTOR_DETAIL = '/spa/resource/RESET_ACTOR_DETAIL' // 演员管理 演员详情重置
const SET_ACTOR_QUERY_PAR = '/spa/resource/SET_ACTOR_QUERY_PAR' // 演员管理 设置查询参数
const RESET_ACTOR_QUERY_PAR = '/spa/resource/RESET_ACTOR_QUERY_PAR' // 演员管理 重置查询参数

// ===========================> Actions <=========================== //

// 设置演员详情
export const setActorDetail = createAction(SET_ACTOR_DETAIL)

// 重置演员详情
export const resetActorDetail = createAction(RESET_ACTOR_DETAIL)

// 设置查询参数
export const setQueryPar = createAction(SET_ACTOR_QUERY_PAR)

// 重置查询参数
export const resetQueryPar = createAction(RESET_ACTOR_QUERY_PAR)

// 获取演员列表
export const getActorList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.actor.list, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_ACTOR_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 新增/修改演员
export const addActor = (arg, isEdit) => dispatch => {
  let url = apis.actor.add
  if (isEdit) {
    url = apis.actor.update
  }
  return new Promise((resolve) => {
    fetchData(dispatch)(url, arg, '正在保存...').then(res => {
      if (res.code === 0) {
        message.success('提交成功')
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 获取演员
export const getActorDetail = arg => dispatch => {
  dispatch(resetActorDetail())
  return new Promise((resolve, reject) => {
    fetchData(dispatch)(apis.actor.detail, arg).then(res => {
      if (res.code === 0) {
        dispatch(setActorDetail(res.data))
        resolve({ status: 'success', result: res.data })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 上下架所有作品
export const shelves = arg => dispatch => {
  return new Promise((resolve) => {
    fetchData(apis.actor.shelvesMedia, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success', result: res.data })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  actorList: [],
  actorInfo: {},
  initQueryPar: {
    auditStatus: '',
    name: '',
  },
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case SET_ACTOR_LIST:
      return {
        ...state,
        actorList: action.payload,
      }
    case SET_ACTOR_DETAIL:
      return {
        ...state,
        actorInfo: action.payload
      }
    case RESET_ACTOR_DETAIL:
      return {
        ...state,
        actorInfo: {}
      }
    case SET_ACTOR_QUERY_PAR:
      return {
        ...state,
        initQueryPar: action.payload,
      }
    case RESET_ACTOR_QUERY_PAR:
      return {
        ...state,
        initQueryPar: initialState.initQueryPar,
        page: initialState.page
      }
    default:
      return state
  }
}
