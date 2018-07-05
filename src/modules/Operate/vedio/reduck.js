import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from '../apis'
import { ReduckHelper } from 'Utils/helper'
import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //
const GET_VEDIO_CATE_LIST = 'spa/operate/vedio/GET_VEDIO_CATE_LIST'
const GET_CHANNEL_CHILD_LIST = 'spa/operate/channel/GET_CHANNEL_CHILD_LIST'
const GET_SOURCE_LIST = 'spa/operate/channel/GET_SOURCE_LIST'
const GET_TAGS_LIST = 'spa/operate/vedio/GET_TAGS_LIST'

// ===========================> Actions <=========================== //

export const vedioCateList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.vedio.vedioCateList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_VEDIO_CATE_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })

export const sourceList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.vedio.sourceList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_SOURCE_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })

export const deleteVedioCate = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.vedio.deleteVedioCate, arg).then(res => {
    if (res.code === 0) {
      message.success('删除成功！')
      dispatch(vedioCateList(filter))
    } else {
      message.error(res.errmsg)
    }
  })

export const deleteChannelChild = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.channel.deleteChannelChild, arg).then(res => {
    if (res.code === 0) {
      message.success('删除成功！')
      dispatch(vedioCateList(filter))
    } else {
      message.error(res.errmsg)
    }
  })

export const deleteResource = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.vedio.deleteResource, arg).then(res => {
    if (res.code === 0) {
      message.success('删除成功！')
      dispatch(sourceList(filter))
    } else {
      message.error(res.errmsg)
    }
  })

export const addVedioCate = (arg, callback) => dispatch =>
  fetchData(dispatch)(apis.vedio.addVedioCate, arg).then(res => {
    if (res.code === 0) {
      message.success('新增成功！')
      callback()
    } else {
      message.error(res.errmsg)
    }
  })

export const editVedioCate = (arg, callback) => dispatch =>
  fetchData(dispatch)(apis.vedio.editVedioCate, arg).then(res => {
    if (res.code === 0) {
      message.success('修改成功！')
      callback()
    } else {
      message.error(res.errmsg)
    }
  })

export const setRecommended = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.channel.setRecommended, arg).then(res => {
    if (res.code === 0) {
      message.success('推荐成功！')
      dispatch(channelChildList(filter))
    } else {
      message.error(res.errmsg)
    }
  })

export const cancelRecommended = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.channel.cancelRecommended, arg).then(res => {
    if (res.code === 0) {
      message.success('取消推荐成功！')
      dispatch(channelChildList(filter))
    } else {
      message.error(res.errmsg)
    }
  })

export const addResource = (arg, filter, onCancel) => dispatch =>
  fetchData(dispatch)(apis.vedio.addResource, arg).then(res => {
    if (res.code === 0) {
      message.success('新增资源成功！')
      onCancel && onCancel()
      dispatch(vedioCateList(filter))
    } else {
      message.error(res.errmsg)
    }
  })

export const enabledVedioCate = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.vedio.enabledVedioCate, arg).then(res => {
    if (res.code === 0) {
      message.success(arg.isEnabled ? '启用成功！' : '禁用成功！')
      dispatch(vedioCateList(filter))
    } else {
      message.error(res.errmsg)
    }
  })

export const getTagsList = (arg) => dispatch => {
  return fetchData(apis.vedio.queryAllTags, arg).then(res => {
    if (res.code === 0) {
      return res.data
    } else {
      message.error(res.errmsg)
    }
  })
}

// tagslist
export const vedioTagsList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.vedio.tagsList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_TAGS_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })

export const deleteTag = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.vedio.deleteTag, arg).then(res => {
    if (res.code === 0) {
      message.success('删除成功！')
      dispatch(vedioTagsList(filter))
    } else {
      message.error(res.errmsg)
    }
  })

export const addTag = (arg, filter, onCancel) => dispatch =>
  fetchData(dispatch)(apis.vedio.addTag, arg).then(res => {
    if (res.code === 0) {
      message.success('新增标签成功！')
      onCancel && onCancel()
      dispatch(vedioTagsList({ ...filter, currentPage: 1 }))
    } else {
      message.error(res.errmsg)
    }
  })

export const editTag = (arg, filter, onCancel) => dispatch =>
  fetchData(dispatch)(apis.vedio.modify, arg).then(res => {
    if (res.code === 0) {
      message.success('修改标签成功！')
      onCancel && onCancel()
      dispatch(vedioTagsList(filter))
    } else {
      message.error(res.errmsg)
    }
  })

// ===========================> Reducer <=========================== //

const initialState = {
  ...ReduckHelper.genListState('vedioCate', {}),
  ...ReduckHelper.genListState('channelChild', {}),
  ...ReduckHelper.genListState('source', {}),
  ...ReduckHelper.genListState('tag', {}),
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_VEDIO_CATE_LIST:
      return ReduckHelper.resolveListState('vedioCate', state, action.payload)
    case GET_CHANNEL_CHILD_LIST:
      return ReduckHelper.resolveListState('channelChild', state, action.payload)
    case GET_SOURCE_LIST:
      return ReduckHelper.resolveListState('source', state, action.payload)
    case GET_TAGS_LIST:
      return ReduckHelper.resolveListState('tag', state, action.payload)
    default:
      return state
  }
}
