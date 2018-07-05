import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchResource as fetchData } from 'Utils/fetch'
import apis from '../../apis'
import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

export const RESOURCE_MEDIA_LICENSE = '/spa/license/RESOURCE_MEDIA_LICENSE' // 列表
export const RESET_MEDIA_LICENSE = '/spa/license/RESET_MEDIA_LICENSE' // 列表重置
export const RESOURCE_MEDIA_LICENSE_DETAIL = '/spa/license/RESOURCE_MEDIA_LICENSE_DETAIL' // 详情

// ===========================> Actions <=========================== //

// 列表重置
export const resetQueryPar = createAction(RESET_MEDIA_LICENSE)

// 媒资列表
export const getList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.media.list, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(RESOURCE_MEDIA_LICENSE)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 禁用/启用
export const isEnable = arg => dispatch => {
  return new Promise((resolve) => {
    fetchData(dispatch)(apis.media.enable, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success', result: res.data })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 获取分类、年代、地区等列表
export const getCategoryList = arg => dispatch => {
  return new Promise((resolve) => {
    fetchData(apis.media.categoryList, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success', result: res.data })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 媒资详情
export const getDetail = arg => dispatch => {
  return fetchData(dispatch)(apis.media.detail, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(RESOURCE_MEDIA_LICENSE_DETAIL)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  list: [],
  filter: {
    episodeCnName: '',
    cateId: '',
    currentPage: 1,
    pageSize: 10,
    self: false
  },
  pagination: {
    pageNo: 1,
    records: 1,
    pageSize: 10
  },
  detail: {},
  videoDetail: {},
  subCateList: [],
  directorList: [],
  writerList: [],
  actorList: [],
  episodeAttr: {}
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case RESOURCE_MEDIA_LICENSE:
      return {
        ...state,
        list: action.payload.data,
        pagination: {
          pageNo: action.payload.pageNo,
          records: action.payload.records,
          pageSize: action.payload.pageSize,
        }
      }
    case RESET_MEDIA_LICENSE:
      return {
        ...state,
        filter: {
          ...initialState.filter,
          episodeCnName: '',
          cateId: '',
          currentPage: 1,
          pageSize: 10,
          self: false
        }
      }
    case RESOURCE_MEDIA_LICENSE_DETAIL:
      return {
        ...state,
        detail: action.payload,
        subCateList: action.payload.subCateList,
        directorList: action.payload.directorList,
        writerList: action.payload.writerList,
        actorList: action.payload.actorList,
        episodeAttr: action.payload.episodeAttr
      }
    default:
      return state
  }
}
