import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from '../apis'

// ===========================> Action Types <=========================== //
const GET_OTT_CHANNEL_LIST = 'spa/oTTSource/GET_OTT_CHANNEL_LIST'  // 频道分类列表
const GET_OTT_CHANNEL_DETAIL = 'spa/oTTSource/GET_OTT_CHANNEL_DETAIL'  // 频道分类列表

const MODULE_SORT_LOADING = 'spa/oTTSource/GET_OTT_MODULE_SORTING' // 模块排序

// ===========================> Actions <=========================== //
// 获取频道列表
export const oTTChannelList = arg => dispatch => {
  dispatch(createAction(GET_OTT_CHANNEL_LIST)({ channelListLoading: true }))
  fetchData(apis.channel.channelList, { ...arg }).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_OTT_CHANNEL_LIST)({ list: res.data, channelListLoading: false }))
    } else {
      dispatch(createAction(GET_OTT_CHANNEL_LIST)({ list: [], channelListLoading: false }))
      message.error(res.errmsg)
    }
  })
}
// 更新频道信息
export const oTTChannelEdit = arg => dispatch => {
  dispatch(createAction(GET_OTT_CHANNEL_LIST)({ channelListLoading: true }))
  fetchData(apis.channel.modifyChannel, arg).then(res => {
    if (res.code === 0) {
      message.success('频道修改成功')
      oTTChannelList()(dispatch)
    } else {
      dispatch(createAction(GET_OTT_CHANNEL_LIST)({ list: [], channelListLoading: false }))
      message.error(res.errmsg)
    }
  })
}
// 删除频道
export const oTTChannelDelete = arg => dispatch => {
  dispatch(createAction(GET_OTT_CHANNEL_LIST)({ channelListLoading: true }))
  fetchData(apis.channel.deleteChannel, arg).then(res => {
    if (res.code === 0) {
      message.success('频道删除成功')
      oTTChannelList()(dispatch)
    } else {
      dispatch(createAction(GET_OTT_CHANNEL_LIST)({ list: [], channelListLoading: false }))
      message.error(res.errmsg)
    }
  })
}
// 添加频道
export const oTTChannelAdd = arg => dispatch => {
  dispatch(createAction(GET_OTT_CHANNEL_LIST)({ channelListLoading: true }))
  fetchData(apis.channel.addChannel, arg).then(res => {
    if (res.code === 0) {
      message.success('频道添加成功')
      oTTChannelList()(dispatch)
    } else {
      dispatch(createAction(GET_OTT_CHANNEL_LIST)({ list: [], channelListLoading: false }))
      message.error(res.errmsg)
    }
  })
}

// 获取卡片列表详细信息
export const oTTChanneDetail = (arg, id) => dispatch => {
  dispatch(createAction(GET_OTT_CHANNEL_DETAIL)({ channelListLoading: true }))
  fetchData(apis.channel.channelCards, { id: id }).then(res => {
    if (res.code === 0) {
      // const detail = res.data.filter((item) => Number(item.id) === Number(id))
      dispatch(createAction(GET_OTT_CHANNEL_DETAIL)({ detail: res.data || [], channelListLoading: false }))
    } else {
      dispatch(createAction(GET_OTT_CHANNEL_DETAIL)({ detail: [], channelListLoading: false }))
      message.error(res.errmsg)
    }
  })
}

// 模块排序
export const oTTChanneCardslSort = arg => dispatch => {
  dispatch(createAction(GET_OTT_CHANNEL_LIST)({ channelListLoading: true }))
  oTTModuleSorting(true)(dispatch)
  fetchData(apis.channel.updateCards, { ...arg }).then(res => {
    if (res.code === 0) {
      message.success('频道模块排序成功')
      oTTChannelList()(dispatch)
      oTTModuleSorting(false)(dispatch)
    } else {
      dispatch(createAction(GET_OTT_CHANNEL_LIST)({ list: [], channelListLoading: false }))
      oTTModuleSorting(false)(dispatch)
      message.error(res.errmsg)
    }
  })
}
// 模块修改
export const oTTChannelDetailUpdate = (arg, id) => dispatch => {
  dispatch(createAction(GET_OTT_CHANNEL_LIST)({ channelListLoading: true }))
  fetchData(apis.channel.updateCards, { ...arg }).then(res => {
    if (res.code === 0) {
      message.success('频道模块修改成功')
      oTTChanneDetail({}, id)(dispatch)
    } else {
      dispatch(createAction(GET_OTT_CHANNEL_LIST)({ list: [], channelListLoading: false }))
      message.error(res.errmsg)
    }
  })
}
// 主页面模块修改
export const oTTChannelMainDetailUpdate = (arg) => dispatch => {
  dispatch(createAction(GET_OTT_CHANNEL_LIST)({ channelListLoading: true }))
  fetchData(apis.channel.updateCards, { ...arg }).then(res => {
    if (res.code === 0) {
      message.success('频道模块修改成功')
      oTTChannelList()(dispatch)
    } else {
      dispatch(createAction(GET_OTT_CHANNEL_LIST)({ list: [], channelListLoading: false }))
      message.error(res.errmsg)
    }
  })
}

export const oTTModuleSorting = isSorting => dispatch => {
  dispatch(createAction(MODULE_SORT_LOADING)({ moduleSortLoading: isSorting }))
}

// ===========================> Reducer <=========================== //

const initialState = {
  channelListLoading: false,
  moduleSortLoading: false,
  list: [],
  detail: {}
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_OTT_CHANNEL_LIST:
      const list = action.payload.list ? { list: action.payload.list } : {}
      return {
        ...state,
        channelListLoading: action.payload.channelListLoading,
        ...list
      }
    case GET_OTT_CHANNEL_DETAIL:
      const detail = action.payload.detail ? { detail: action.payload.detail } : {}
      return {
        ...state,
        channelListLoading: action.payload.channelListLoading,
        ...detail
      }
    case MODULE_SORT_LOADING:
      return {
        ...state,
        moduleSortLoading: action.payload.moduleSortLoading,
      }
    default:
      return state
  }
}
