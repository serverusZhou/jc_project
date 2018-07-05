import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchResource as fetchData } from 'Utils/fetch'
import apis from '../apis'
import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

const SET_CLASS_LIST = '/spa/resource/SET_CLASS_LIST' // 分类管理
const SET_TEMPLATE_LIST = '/spa/resource/SET_TEMPLATE_LIST' // 字段模板管理

// ===========================> Actions <=========================== //

// 获取分类列表
export const getClassList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.class.list, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_CLASS_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 新增/修改分类
export const addClass = (arg, isEdit) => dispatch => {
  let url = apis.class.add
  if (isEdit) {
    url = apis.class.update
  }
  return new Promise(function (resolve, reject) {
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

// 删除分类
export const deleteClass = (arg) => dispatch => {
  return new Promise((resolve) => {
    fetchData(apis.class.delete, arg).then(res => {
      if (res.code === 0) {
        dispatch(getClassList())
        message.success('删除成功！')
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 获取字段模板列表
export const getTemplateList = arg => dispatch => {
  dispatch(createAction(SET_TEMPLATE_LIST)([]))
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.template.list, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_TEMPLATE_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 新增/修改字段模板
export const addTemplate = (arg, isEdit) => dispatch => {
  let url = apis.template.add
  if (isEdit) {
    url = apis.template.update
  }
  return new Promise(function (resolve, reject) {
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

// 删除字段模板
export const deleteTemplate = (arg) => dispatch => {
  return new Promise((resolve) => {
    fetchData(apis.template.delete, arg).then(res => {
      if (res.code === 0) {
        message.success('删除成功！')
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
  classList: [],
  templateList: [],
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case SET_CLASS_LIST:
      return {
        ...state,
        classList: action.payload,
      }
    case SET_TEMPLATE_LIST:
      return {
        ...state,
        templateList: action.payload,
      }
    default:
      return state
  }
}
