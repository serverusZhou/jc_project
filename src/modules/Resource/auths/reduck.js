import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from './../apis'
import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

export const GET_AUTHS_LIST = '/spa/auths/GET_AUTHS_LIST' // 列表
export const GET_ROLE_LIST = '/spa/auths/GET_ROLE_LIST' // 角色列表
export const GET_ROLE_EDIT = '/spa/auths/GET_ROLE_EDIT' // 角色详情
export const SHOW_AUTHS_ADD_MODAL = '/spa/auths/SWITCH_AUTHS_ADD_MODAL' // 新增
export const SHOW_AUTHS_EDIT_MODAL = '/spa/auths/SWITCH_AUTHS_EDIT_MODAL' // 编辑
export const GET_AUTHS_DETAIL = '/spa/auths/GET_AUTHS_DETAIL' // 详情
const SET_AUTHS_QUERY_PAR = '/spa/resource/SET_AUTHS_QUERY_PAR' // 演员管理 设置查询参数
const RESET_AUTHS_QUERY_PAR = '/spa/resource/RESET_AUTHS_QUERY_PAR' // 演员管理 重置查询参数

// ===========================> Actions <=========================== //

// 设置查询参数
export const setQueryPar = createAction(SET_AUTHS_QUERY_PAR)

// 重置查询参数
export const resetQueryPar = createAction(RESET_AUTHS_QUERY_PAR)

// 管理员列表
export const getList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.auths.list, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_AUTHS_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 查询所有角色
export const getRoleList = () => {
  return dispatch => {
    fetchData(apis.auths.allrole).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_ROLE_LIST)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 显示弹窗
export const isShowModal = (flag, value) => {
  return dispatch => {
    if (flag) {
      dispatch(createAction(SHOW_AUTHS_EDIT_MODAL)(value))
    } else {
      dispatch(createAction(SHOW_AUTHS_ADD_MODAL)(value))
    }
  }
}

// 新增管理员
export const add = (values, callBack) => dispatch => {
  return new Promise((resolve) => {
    fetchData(dispatch)(apis.auths.add, values, '正在保存...').then(res => {
      if (res.code === 0) {
        dispatch(createAction(SHOW_AUTHS_ADD_MODAL)(false))
        callBack && callBack()
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 编辑管理员
export const edit = (values, callBack) => dispatch => {
  return new Promise((resolve) => {
    fetchData(dispatch)(apis.auths.update, values, '正在保存...').then(res => {
      if (res.code === 0) {
        dispatch(createAction(SHOW_AUTHS_EDIT_MODAL)(false))
        callBack && callBack()
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 管理员详情
export const detail = arg => dispatch => {
  return new Promise((resolve) => {
    fetchData(dispatch)(apis.auths.detail, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_AUTHS_DETAIL)(res.data))
        resolve({ status: 'success', result: res.data })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 查询角色详情
export const getRoleDetail = arg => dispatch => {
  return new Promise((resolve) => {
    fetchData(dispatch, SHOW_LIST_SPIN)(apis.role.detail, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_ROLE_EDIT)(res.data))
        resolve({ status: 'success', result: res.data })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 冻结管理员
export const unfreeze = (values) => dispatch => {
  return new Promise((resolve) => {
    fetchData(apis.auths.unfreeze, values).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 解冻管理员
export const freeze = (values) => dispatch => {
  return new Promise((resolve) => {
    fetchData(apis.auths.freeze, values).then(res => {
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
  list: [],
  detail: {},
  showAddModal: false,
  showEditModal: false,
  roleList: [],
  roleDetail: {},
  pagination: {
    pageNo: 1,
    records: 0,
    pageSize: 10
  },
  initQueryPar: {
    searchKey: '',
  },
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_AUTHS_LIST:
      return {
        ...state,
        list: action.payload.data,
        pagination: {
          pageNo: action.payload.pageNo,
          records: action.payload.records,
          pageSize: action.payload.pageSize
        }
      }
    case GET_ROLE_LIST:
      return {
        ...state,
        roleList: action.payload
      }
    case GET_ROLE_EDIT:
      return {
        ...state,
        roleDetail: action.payload
      }
    case SHOW_AUTHS_ADD_MODAL:
      return {
        ...state,
        showAddModal: action.payload,
      }
    case SHOW_AUTHS_EDIT_MODAL:
      return {
        ...state,
        showEditModal: action.payload,
      }
    case GET_AUTHS_DETAIL:
      return {
        ...state,
        detail: action.payload,
      }
    case SET_AUTHS_QUERY_PAR:
      return {
        ...state,
        initQueryPar: action.payload,
      }
    case RESET_AUTHS_QUERY_PAR:
      return {
        ...state,
        initQueryPar: initialState.initQueryPar,
        pagination: initialState.pagination
      }
    default:
      return state
  }
}
