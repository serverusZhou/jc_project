import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from '../apis'
import { ReduckHelper } from 'Utils/helper'
import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //
const GET_CATEGORY_LIST = 'spa/oTTResource/category/GET_CHANNEL_LIST'  // 频道分类列表
const GET_CHANNEL_CHILD_LIST = 'spa/oTTResource/category/GET_CHANNEL_CHILD_LIST'  // 频道分类列表
const GET_SOURCE_LIST = 'spa/oTTResource/category/GET_SOURCE_LIST'  // 频道分类列表

// ===========================> Actions <=========================== //

// 获取总的分类列表
export const categoryList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.category.categorylList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_CATEGORY_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })
// 增加新的分类
export const addCategory = (arg, callback) => dispatch =>
  fetchData(dispatch)(apis.category.addCategory, arg).then(res => {
    if (res.code === 0) {
      message.success('新增分类成功！')
      callback()
    } else {
      message.error(res.errmsg)
    }
  })
// 删除分类
export const deleteCategory = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.category.deleteCategory, arg).then(res => {
    if (res.code === 0) {
      message.success('删除成功！')
      dispatch(categoryList(filter))
    } else {
      message.error(res.errmsg)
    }
  })
// 编辑分类
export const editCategory = (arg, callback) => dispatch =>
  fetchData(dispatch)(apis.category.editCategory, arg).then(res => {
    if (res.code === 0) {
      message.success('修改分类成功！')
      callback()
    } else {
      message.error(res.errmsg)
    }
  })
// 是否启用分类
export const enableChannel = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.category.enableChannel, arg).then(res => {
    if (res.code === 0) {
      message.success(arg.isEnabled ? '启用成功！' : '禁用成功！')
      dispatch(categoryList(filter))
    } else {
      message.error(res.errmsg)
    }
  })
// 增加新的子分类
export const addChildCategory = (arg, callback) => dispatch =>
  fetchData(dispatch)(apis.category.addCategory, arg).then(res => {
    if (res.code === 0) {
      message.success('新增分类成功！')
      callback()
    } else {
      message.error(res.errmsg)
    }
  })
// 获取子分类列表
export const channelChildList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.category.categorylList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_CHANNEL_CHILD_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })
  // 删除子分类
export const deleteChannelChild = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.category.deleteCategory, arg).then(res => {
    if (res.code === 0) {
      message.success('删除成功！')
      dispatch(channelChildList(filter))
    } else {
      message.error(res.errmsg)
    }
  })
// 编辑子分类
export const editChannelChild = (arg, callback) => dispatch =>
  fetchData(dispatch)(apis.category.editCategory, arg).then(res => {
    if (res.code === 0) {
      message.success('修改子频道成功！')
      callback()
    } else {
      message.error(res.errmsg)
    }
  })
// 禁用子频道
export const cancelEnableChannelChild = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.category.enableChannel, { ...arg, isEnabled: false }).then(res => {
    if (res.code === 0) {
      message.success('禁用成功！')
      dispatch(channelChildList(filter))
    } else {
      message.error(res.errmsg)
    }
  })
// 启用子频道
export const enableChannelChild = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.category.enableChannel, { ...arg, isEnabled: true }).then(res => {
    if (res.code === 0) {
      message.success('启用成功！')
      dispatch(channelChildList(filter))
    } else {
      message.error(res.errmsg)
    }
  })

export const sourceList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.category.sourceList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_SOURCE_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })

export const deleteResource = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.category.deleteResource, arg).then(res => {
    if (res.code === 0) {
      message.success('删除成功！')
      dispatch(sourceList(filter))
    } else {
      message.error(res.errmsg)
    }
  })

export const addChannelResource = (arg, filter, onCancel) => dispatch =>
  fetchData(dispatch)(apis.category.addCategoryResource, arg).then(res => {
    const successCal = () => {
      message.success('新增资源成功！')
      onCancel && onCancel()
      dispatch(channelChildList(filter))
    }
    if (res.code === 0) {
      if (arg.operaterPic) {
        const param = { operaterPic: arg.operaterPic, sourceId: res.data, source: '2' }
        fetchData(apis.operaterpic.add, param).then(res => {
          if (res.code === 0) {
            successCal()
          } else {
            message.error(res.errmsg)
          }
        })
      } else {
        successCal()
      }
    } else {
      message.error(res.errmsg)
    }
  })

// ===========================> Reducer <=========================== //

const initialState = {
  ...ReduckHelper.genListState('channel', {}),
  ...ReduckHelper.genListState('channelChild', {}),
  ...ReduckHelper.genListState('source', {}),
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_CATEGORY_LIST:
      return ReduckHelper.resolveListState('channel', state, action.payload)
    case GET_CHANNEL_CHILD_LIST:
      return ReduckHelper.resolveListState('channelChild', state, action.payload)
    case GET_SOURCE_LIST:
      return ReduckHelper.resolveListState('source', state, action.payload)
    default:
      return state
  }
}
