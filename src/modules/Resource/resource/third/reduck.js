import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchResource as fetchData } from 'Utils/fetch'
import apis from '../../apis'
import { SHOW_LIST_SPIN } from 'Global/action'
import { isEmpty } from 'Utils/lang'

// ===========================> Action Types <=========================== //

export const RESOURCE_MEDIA_THIRD = '/spa/third/RESOURCE_MEDIA_THIRD' // 媒资列表
export const RESET_MEDIA_THIRD = '/spa/third/RESET_MEDIA_THIRD' // 媒资列表重置
export const RESOURCE_MEDIA_DETAIL = '/spa/third/RESOURCE_MEDIA_DETAIL' // 媒资详情
const SET_MEDIA_DETAIL = '/spa/resource/SET_MEDIA_DETAIL' // 介质详情
const RESET_MEDIA_DETAIL = '/spa/resource/RESET_MEDIA_DETAIL' // 介质详情重置
export const RESOURCE_MEDIA_VIDEO = '/spa/third/RESOURCE_MEDIA_VIDEO' // 视频详情页面
export const MEDIA_VIDEO_AUDIT_LOG = '/spa/third/MEDIA_VIDEO_AUDIT_LOG' // 视频详情页面
export const POST_MEDIA_VIDEO_AUDIT = '/spa/third/POST_MEDIA_VIDEO_AUDIT' // 视频审核提交
export const SHOW_EPISOD_ADD_MODAL = '/spa/third/SHOW_EPISOD_ADD_MODAL' // 新增剧集弹窗
export const SHOW_EPISOD_EDIT_MODAL = '/spa/third/SHOW_EPISOD_EDIT_MODAL' // 编辑剧集弹窗
export const SHOW_EPISOD_AUDIT_MODAL = '/spa/third/SHOW_EPISOD_AUDIT_MODAL' // 审核媒资弹窗
export const POST_EPISODE_AUDIT = '/spa/third/POST_EPISODE_AUDIT' // 视频审核提交
export const GET_EPISOD_AUDIT_DETAIL = '/spa/third/GET_EPISOD_AUDIT_DETAIL' // 获取介质审核信息
export const GET_EPISOD_AUDIT_LOGS = '/spa/third/GET_EPISOD_AUDIT_LOGS' // 获取介质审核信息
export const CHANGE_MEDIA_INDEX = '/spa/third/CHANGE_MEDIA_INDEX' // 选择剧集
export const CHANGE_HIGHLIGHT_INDEX = '/spa/third/CHANGE_HIGHLIGHT_INDEX' // 选择花絮
// ===========================> Actions <=========================== //

// 列表重置
export const resetQueryPar = createAction(RESET_MEDIA_THIRD)

// 设置介质详情
export const setMediaDetail = createAction(SET_MEDIA_DETAIL)

// 重置介质详情
export const resetMediaDetail = createAction(RESET_MEDIA_DETAIL)

// 新增/修改介质
export const addMedia = (arg, isEdit) => dispatch => {
  let url = apis.media.add
  if (isEdit) {
    url = apis.media.update
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

// 获取介质
export const getMediaDetail = arg => dispatch => {
  dispatch(resetMediaDetail())
  return fetchData(dispatch)(apis.media.detail, arg).then(res => {
    if (res.code === 0) {
      dispatch(setMediaDetail(res.data))
    } else {
      message.error(res.errmsg)
    }
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

// 媒资列表
export const thirdList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.media.list, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(RESOURCE_MEDIA_THIRD)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 媒资禁用&启用
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

// 媒资详情
export const getDetail = arg => dispatch => {
  return fetchData(dispatch)(apis.media.detail, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(RESOURCE_MEDIA_DETAIL)(res.data))
      if (!isEmpty(res.data.mediaList)) {
        dispatch(createAction(CHANGE_MEDIA_INDEX)({
          activeMediaIndex: 0
        }))
      } else if (!isEmpty(res.data.highlightList)) {
        dispatch(createAction(CHANGE_HIGHLIGHT_INDEX)({
          activeHighlightIndex: 0
        }))
      }
    } else {
      message.error(res.errmsg)
    }
  })
}

// 删除媒资
export const deleteMedia = arg => dispatch => {
  return new Promise((resolve) => {
    fetchData(dispatch)(apis.media.deleteMedia, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success', result: res.data })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 显示弹窗
export const isShowModal = (flag, value) => {
  return dispatch => {
    if (flag) {
      dispatch(createAction(SHOW_EPISOD_EDIT_MODAL)(value))
    } else {
      dispatch(createAction(SHOW_EPISOD_ADD_MODAL)(value))
    }
  }
}

// 新增剧集/花絮
export const addEpisode = (arg, callBack) => dispatch => {
  let url = apis.media.addEpisode
  if (arg.title) {
    url = apis.media.addTitbits
  }
  return new Promise((resolve) => {
    fetchData(dispatch)(url, arg, '正在保存...').then(res => {
      if (res.code === 0) {
        dispatch(createAction(SHOW_EPISOD_ADD_MODAL)(false))
        message.success('提交成功')
        resolve({ status: 'success' })
        callBack && callBack()
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 编辑视频URL
export const editEpisode = (arg, callBack) => dispatch => {
  fetchData(dispatch)(apis.media.editVideoUrl, { id: arg.id, type: arg.type, url: arg.url }, '正在保存...').then(res => {
    if (res.code === 0) {
      dispatch(getDetail({ episodeId: arg.episodeId }))
      dispatch(createAction(SHOW_EPISOD_EDIT_MODAL)(false))
      message.success('提交成功')
      callBack && callBack()
    } else {
      message.error(res.errmsg)
    }
  })
}

// 提审
export const arraignment = arg => dispatch => {
  return new Promise((resolve) => {
    fetchData(dispatch)(apis.media.arraignment, arg).then(res => {
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

// 获取视频详情
export const getVideoDetail = arg => dispatch => {
  return fetchData(dispatch)(apis.audit.media.detail, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(RESOURCE_MEDIA_VIDEO)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const getVideoAuditLogs = arg => dispatch => {
  return fetchData(dispatch)(apis.audit.media.auditLog, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(MEDIA_VIDEO_AUDIT_LOG)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 视频审核提交
export const postVideoAudit = arg => dispatch => {
  return fetchData(dispatch)(
    apis.audit.media.postAduit,
    arg
  ).then(res => {
    if (res.code === 0) {
      message.info('提交成功')
      history.go(-1)
    } else {
      message.error(res.errmsg)
    }
  })
}

export const showAuditPop = arg => dispatch => {
  dispatch(createAction(SHOW_EPISOD_AUDIT_MODAL)(arg))
}

export const postEpisodeAudit = arg => dispatch => {
  return new Promise((resolve) => {
    fetchData(dispatch)(apis.audit.media.postEpisodeAudit, arg).then(res => {
      if (res.code === 0) {
        message.info('提交成功')
        dispatch(createAction(SHOW_EPISOD_AUDIT_MODAL)(false))
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 获取介质审核详情
export const getEpisodeAuditDetail = arg => dispatch => {
  return fetchData(dispatch)(apis.audit.media.auditdetail, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_EPISOD_AUDIT_DETAIL)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取介质审核详情
export const getEpisodeAuditLogs = arg => dispatch => {
  return fetchData(dispatch)(apis.audit.media.auditLog, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_EPISOD_AUDIT_LOGS)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const changeMediaIndex = arg => dispatch => {
  dispatch(createAction(CHANGE_MEDIA_INDEX)(arg))
}

export const changeHighlightIndex = arg => dispatch => {
  dispatch(createAction(CHANGE_HIGHLIGHT_INDEX)(arg))
}

// ===========================> Reducer <=========================== //

const initialState = {
  mediaInfo: {},
  thirdList: [],
  thirdFilter: { episodeCnName: '', cateId: '', source: '', currentPage: 1, pageSize: 10, self: true },
  thirdPagination: {
    pageNo: 1,
    records: 0,
    pageSize: 10
  },
  detail: {},
  showAddModal: false,
  showEditModal: false,
  videoDetail: {},
  subCateList: [],
  directorList: [],
  writerList: [],
  mediaList: [],
  videoAuditDetail: {},
  videoAuditLogs: [],
  actorList: [],
  episodeAttr: {},
  highlightList: [],
  showAuditModal: false,
  episodeAuditDetail: {},
  activeMediaIndex: null,
  activeHighlightIndex: null,
  episodeAuditLogs: []
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case SET_MEDIA_DETAIL:
      return {
        ...state,
        mediaInfo: action.payload
      }
    case RESET_MEDIA_DETAIL:
      return {
        ...state,
        mediaInfo: {}
      }
    case RESET_MEDIA_THIRD:
      return {
        ...state,
        thirdFilter: {
          ...initialState.thirdFilter,
          episodeCnName: '',
          cateId: '',
          source: '',
          currentPage: 1,
          pageSize: 10,
          self: true
        }
      }
    case RESOURCE_MEDIA_THIRD:
      return {
        ...state,
        thirdList: action.payload.data,
        thirdPagination: {
          pageNo: action.payload.pageNo,
          records: action.payload.records,
          pageSize: action.payload.pageSize,
        }
      }
    case RESOURCE_MEDIA_DETAIL:
      return {
        ...state,
        detail: action.payload,
        subCateList: action.payload.subCateList,
        directorList: action.payload.directorList,
        writerList: action.payload.writerList,
        actorList: action.payload.actorList,
        episodeAttr: action.payload.episodeAttr || {},
        mediaList: action.payload.mediaList,
        highlightList: action.payload.highlightList
      }
    case SHOW_EPISOD_ADD_MODAL:
      return {
        ...state,
        showAddModal: action.payload
      }
    case SHOW_EPISOD_EDIT_MODAL:
      return {
        ...state,
        showEditModal: action.payload
      }
    case RESOURCE_MEDIA_VIDEO:
      return {
        ...state,
        videoDetail: action.payload
      }
    case POST_MEDIA_VIDEO_AUDIT:
      return {
        ...state
      }
    case MEDIA_VIDEO_AUDIT_LOG:
      return {
        ...state,
        videoAuditLogs: action.payload
      }
    case SHOW_EPISOD_AUDIT_MODAL:
      return {
        ...state,
        showAuditModal: action.payload
      }
    case GET_EPISOD_AUDIT_DETAIL:
      return {
        ...state,
        episodeAuditDetail: action.payload
      }
    case CHANGE_MEDIA_INDEX:
      return {
        ...state,
        activeMediaIndex: action.payload.activeMediaIndex,
        activeHighlightIndex: action.payload.activeHighlightIndex,
      }
    case CHANGE_HIGHLIGHT_INDEX:
      return {
        ...state,
        activeHighlightIndex: action.payload.activeHighlightIndex,
        activeMediaIndex: action.payload.activeMediaIndex
      }
    case GET_EPISOD_AUDIT_LOGS:
      return {
        ...state,
        episodeAuditLogs: action.payload
      }
    default:
      return state
  }
}
