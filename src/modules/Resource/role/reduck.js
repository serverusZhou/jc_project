import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from '../apis'
import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

export const GET_ROLE_LIST = '/spa/role/GET_ROLE_LIST' // 列表
export const SHOW_ROLE_ADD_MODAL = '/spa/role/SHOW_ROLE_ADD_MODAL' // 新增
export const SHOW_ROLE_EDIT_MODAL = '/spa/role/SHOW_ROLE_EDIT_MODAL' // 编辑
export const GET_ROLE_DETAIL = '/spa/role/GET_ROLE_DETAIL' // 详情
export const RESET_ROLE_QUERY_PAR = '/spa/resource/RESET_ROLE_QUERY_PAR' // 角色管理 重置查询参数

// ===========================> Actions <=========================== //

// 重置查询参数
export const resetQueryPar = createAction(RESET_ROLE_QUERY_PAR)

// 角色列表
export const getList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.role.list, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_ROLE_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 显示弹窗
export const isShowModal = (flag, value) => {
  return dispatch => {
    if (flag) {
      dispatch(createAction(SHOW_ROLE_EDIT_MODAL)(value))
    } else {
      dispatch(createAction(SHOW_ROLE_ADD_MODAL)(value))
    }
  }
}

// 新增角色
export const addRole = (values, callBack) => {
  return dispatch => {
    fetchData(dispatch)(apis.role.add, values, '正在保存...').then(res => {
      if (res.code === 0) {
        dispatch(createAction(SHOW_ROLE_ADD_MODAL)(false))
        dispatch(getList({ currentPage: 1, pageSize: 10 }))
        callBack && callBack()
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 编辑角色
export const editRole = (values, callBack) => {
  return dispatch => {
    fetchData(dispatch)(apis.role.update, values, '正在保存...').then(res => {
      if (res.code === 0) {
        dispatch(createAction(SHOW_ROLE_EDIT_MODAL)(false))
        dispatch(getList({ currentPage: 1, pageSize: 10 }))
        callBack && callBack()
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 角色详情
export const detail = arg => dispatch => {
  return new Promise((resolve) => {
    fetchData(dispatch)(apis.role.detail, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_ROLE_DETAIL)(res.data))
        resolve({ status: 'success', result: res.data })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 删除角色
export const deleteRole = arg => {
  return dispatch => {
    fetchData(apis.role.delete, arg, '正在删除...').then(res => {
      if (res.code === 0) {
        dispatch(getList({ currentPage: 1, pageSize: 10 }))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// ===========================> Reducer <=========================== //

const initialState = {
  list: [],
  detail: {},
  defaultMenus: [],
  showAddModal: false,
  showEditModal: false,
  pagination: {
    pageNo: 1,
    records: 1,
    pageSize: 10
  },
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_ROLE_LIST:
      return {
        ...state,
        list: action.payload.data,
        pagination: {
          pageNo: action.payload.pageNo,
          records: action.payload.records,
          pageSize: action.payload.pageSize
        }
      }
    case SHOW_ROLE_ADD_MODAL:
      return {
        ...state,
        showAddModal: action.payload,
      }
    case SHOW_ROLE_EDIT_MODAL:
      return {
        ...state,
        showEditModal: action.payload,
      }
    case GET_ROLE_DETAIL:
      return {
        ...state,
        detail: action.payload,
        defaultMenus: action.payload.menuList.map(m => {
          return m.menuTag + '/' + m.menuName
        })
      }
    case RESET_ROLE_QUERY_PAR:
      return {
        ...state,
        pagination: initialState.pagination
      }
    default:
      return state
  }
}
