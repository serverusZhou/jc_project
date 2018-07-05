import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from '../apis'
import { ReduckHelper } from 'Utils/helper'
import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //
const GET_CHANNEL_LIST = 'spa/operate/channel/GET_CHANNEL_LIST'  // 频道分类列表
const GET_CHANNEL_CHILD_LIST = 'spa/operate/channel/GET_CHANNEL_CHILD_LIST'  // 频道分类列表
const GET_SOURCE_LIST = 'spa/operate/channel/GET_SOURCE_LIST'  // 频道分类列表

// ===========================> Actions <=========================== //

export const channelList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.channel.channelList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_CHANNEL_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })

export const channelChildList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.channel.channelChildList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_CHANNEL_CHILD_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })

export const sourceList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.channel.sourceList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_SOURCE_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })

export const deleteChannel = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.channel.deleteChannel, arg).then(res => {
    if (res.code === 0) {
      message.success('删除成功！')
      dispatch(channelList(filter))
    } else {
      message.error(res.errmsg)
    }
  })

export const deleteChannelChild = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.channel.deleteChannelChild, arg).then(res => {
    if (res.code === 0) {
      message.success('删除成功！')
      dispatch(channelChildList(filter))
    } else {
      message.error(res.errmsg)
    }
  })

export const deleteResource = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.channel.deleteResource, arg).then(res => {
    if (res.code === 0) {
      message.success('删除成功！')
      dispatch(sourceList(filter))
    } else {
      message.error(res.errmsg)
    }
  })

export const addChannel = (arg, callback) => dispatch =>
  fetchData(dispatch)(apis.channel.addChannel, arg).then(res => {
    if (res.code === 0) {
      message.success('新增频道成功！')
      callback()
    } else {
      message.error(res.errmsg)
    }
  })

export const editChannel = (arg, callback) => dispatch =>
  fetchData(dispatch)(apis.channel.editChannel, arg).then(res => {
    if (res.code === 0) {
      message.success('修改频道成功！')
      callback()
    } else {
      message.error(res.errmsg)
    }
  })

export const editChannelChild = (arg, callback) => dispatch =>
  fetchData(dispatch)(apis.channel.editChannelChild, arg).then(res => {
    if (res.code === 0) {
      message.success('修改子频道成功！')
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

export const cancelEnableChannelChild = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.channel.cancelEnableChannelChild, arg).then(res => {
    if (res.code === 0) {
      message.success('禁用成功！')
      dispatch(channelChildList(filter))
    } else {
      message.error(res.errmsg)
    }
  })

export const enableChannelChild = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.channel.enableChannelChild, arg).then(res => {
    if (res.code === 0) {
      message.success('启用成功！')
      dispatch(channelChildList(filter))
    } else {
      message.error(res.errmsg)
    }
  })

export const addChildChannel = (arg, callback) => dispatch =>
  fetchData(dispatch)(apis.channel.addChildChannel, arg).then(res => {
    if (res.code === 0) {
      message.success('新增子频道成功！')
      callback()
    } else {
      message.error(res.errmsg)
    }
  })

export const addChannelResource = (arg, filter, onCancel) => dispatch =>
  fetchData(dispatch)(apis.channel.addChannelResource, arg).then(res => {
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

export const enableChannel = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.channel.enableChannel, arg).then(res => {
    if (res.code === 0) {
      message.success(arg.isEnabled ? '启用成功！' : '禁用成功！')
      dispatch(channelList(filter))
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
    case GET_CHANNEL_LIST:
      return ReduckHelper.resolveListState('channel', state, action.payload)
    case GET_CHANNEL_CHILD_LIST:
      return ReduckHelper.resolveListState('channelChild', state, action.payload)
    case GET_SOURCE_LIST:
      return ReduckHelper.resolveListState('source', state, action.payload)
    default:
      return state
  }
}
