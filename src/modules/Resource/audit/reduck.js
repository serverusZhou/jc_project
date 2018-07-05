import { createAction } from 'redux-actions'
import { ReduckHelper } from 'Utils/helper'
import * as actions from 'Global/action'
import { message } from 'antd'
import fetchData, { fetchResource } from 'Utils/fetch'
import apis from '../apis'
import { AuditStatusKeyMap, AuditLogSearchType } from './dict'

// ===========================> Action Types <=========================== //
export const RESOURCE_AUDIT = 'Resource/audit'
export const RESOURCE_AUDIT_MEDIA = `${RESOURCE_AUDIT}/media`
export const RESOURCE_AUDIT_INTERPHASE = `${RESOURCE_AUDIT}/interphase`
export const RESOURCE_AUDIT_ADVERTISE = `${RESOURCE_AUDIT}/advertise`
export const RESOURCE_AUDIT_LIVE = `${RESOURCE_AUDIT}/live/cate`
export const RESOURCE_AUDIT_APPLY = `${RESOURCE_AUDIT}/apply`
export const RESOURCE_AUDIT_OPERATEPIC = `${RESOURCE_AUDIT}/operatepic`
export const RESOURCE_OTT_AUDIT_MEDIA = `${RESOURCE_AUDIT}/oTTmedia` // 有象快搜

// 媒资审核列表查询
export const GET_MEDIA_AUDIT_LIST = `${RESOURCE_AUDIT_MEDIA}/GET_MEDIA_AUDIT_LIST`
export const POST_MEDIA_AUDIT = `${RESOURCE_AUDIT_MEDIA}/POST_MEDIA_AUDIT`

// 有象视频审核列表查询
export const GET_OTT_MEDIA_AUDIT_LIST = `${RESOURCE_OTT_AUDIT_MEDIA}/GET_OTT_MEDIA_AUDIT_LIST`
export const GET_OTT_MEDIA_DETAIL = `${RESOURCE_OTT_AUDIT_MEDIA}/GET_OTT_MEDIA_DETAIL`
export const GET_OTT_MEDIA_AUDIT_LOG = `${RESOURCE_OTT_AUDIT_MEDIA}/GET_OTT_MEDIA_AUDIT_LOG`

export const GET_OTT_CATEGORY_AUDIT_LIST = `${RESOURCE_OTT_AUDIT_MEDIA}/GET_OTT_CATEGORY_AUDIT_LIST`
export const GET_OTT_CATEGORY_DETAIL = `${RESOURCE_OTT_AUDIT_MEDIA}/GET_OTT_CATEGORY_DETAIL`
export const GET_CATEGORY_AUDIT_LOG = `${RESOURCE_OTT_AUDIT_MEDIA}/GET_OTT_CATEGORY_AUDIT_LOG`

export const GET_OTT_CHANNEL_AUDIT_LIST = `${RESOURCE_OTT_AUDIT_MEDIA}/GET_OTT_CHANNEL_AUDIT_LIST`
export const GET_OTT_CHANNEL_DETAIL = `${RESOURCE_OTT_AUDIT_MEDIA}/GET_OTT_CHANNEL_DETAIL`
export const GET_OTT_CHANNEL_AUDIT_LOG = `${RESOURCE_OTT_AUDIT_MEDIA}/GET_OTT_CHANNEL_AUDIT_LOG`

// 广告位审核
export const GET_ADVERTISE_POSITION_AUDIT_LIST = `${RESOURCE_AUDIT_MEDIA}/GET_ADVERTISE_POSITION_AUDIT_LIST`
export const POST_ADVERTISE_POSITION_AUDIT = `${RESOURCE_AUDIT_MEDIA}/POST_ADVERTISE_POSITION_AUDIT`
export const GET_ADVERTISE_POSITION_DETAIL = `${RESOURCE_AUDIT_INTERPHASE}/GET_ADVERTISE_POSITION_DETAIL`
export const GET_ADVERTISE_POSITION_AUDIT_LOG = `${RESOURCE_AUDIT_INTERPHASE}/GET_ADVERTISE_POSITION_AUDIT_LOG`

// 广告审核
export const GET_ADVERTISE_AUDIT_LIST = `${RESOURCE_AUDIT_MEDIA}/GET_ADVERTISE_AUDIT_LIST`
export const POST_ADVERTISE_AUDIT = `${RESOURCE_AUDIT_MEDIA}/POST_ADVERTISE_AUDIT`
export const GET_ADVERTISE_DETAIL = `${RESOURCE_AUDIT_INTERPHASE}/GET_ADVERTISE_DETAIL`
export const GET_ADVERTISE_AUDIT_LOG = `${RESOURCE_AUDIT_INTERPHASE}/GET_ADVERTISE_AUDIT_LOG`

// 界面审核
export const GET_INTERPHASE_AUDIT_LIST = `${RESOURCE_AUDIT_INTERPHASE}/GET_INTERPHASE_AUDIT_LIST`
export const POST_INTERPHASE_AUDIT = `${RESOURCE_AUDIT_MEDIA}/POST_INTERPHASE_AUDIT`
export const GET_INTERPHASE_DETAIL = `${RESOURCE_AUDIT_INTERPHASE}/GET_INTERPHASE_DETAIL`
export const GET_INTERPHASE_AUDIT_LOG = `${RESOURCE_AUDIT_INTERPHASE}/GET_INTERPHASE_AUDIT_LOG`

// 直播频道分类审核
export const GET_CHANNEL_CATE_AUDIT_LIST = `${RESOURCE_AUDIT_LIVE}/GET_CHANNEL_CATE_AUDIT_LIST`
export const GET_CHANNEL_CATE_AUDIT_DETAIL = `${RESOURCE_AUDIT_LIVE}/GET_CHANNEL_CATE_AUDIT_DETAIL`
export const GET_CHANNEL_CATE_AUDIT_LOG = `${RESOURCE_AUDIT_LIVE}/GET_CHANNEL_CATE_AUDIT_LOG`
export const POST_CHANNEL_CATE_AUDIT = `${RESOURCE_AUDIT_LIVE}/POST_CHANNEL_CATE_AUDIT`

// 直播频道审核
export const GET_CHANNEL_AUDIT_LIST = `${RESOURCE_AUDIT_LIVE}/GET_CHANNEL_AUDIT_LIST`
export const GET_CHANNEL_AUDIT_DETAIL = `${RESOURCE_AUDIT_LIVE}/GET_CHANNEL_AUDIT_DETAIL`
export const GET_CHANNEL_AUDIT_LOG = `${RESOURCE_AUDIT_LIVE}/GET_CHANNEL_AUDIT_LOG`
export const POST_CHANNEL_AUDIT = `${RESOURCE_AUDIT_LIVE}/POST_CHANNEL_AUDIT`

// 影视分类审核
export const GET_OPERATE_AUDIT_LIST = `${RESOURCE_AUDIT_LIVE}/GET_OPERATE_AUDIT_LIST`
export const GET_OPERATE_AUDIT_DETAIL = `${RESOURCE_AUDIT_LIVE}/GET_OPERATE_AUDIT_DETAIL`
export const GET_OPERATE_AUDIT_LOG = `${RESOURCE_AUDIT_LIVE}/GET_OPERATE_AUDIT_LOG`
export const POST_OPERATE_AUDIT = `${RESOURCE_AUDIT_LIVE}/POST_OPERATE_AUDIT`

export const GET_AUDITED_LIST = `${RESOURCE_AUDIT_APPLY}/GET_AUDITED_LIST`
export const GET_UNAUDITED_LIST = `${RESOURCE_AUDIT_APPLY}/GET_UNAUDITED_LIST`
export const GET_AUDITED_DETAIL = `${RESOURCE_AUDIT_APPLY}/GET_AUDITED_DETAIL`
export const GET_UNAUDITED_DETAIL = `${RESOURCE_AUDIT_APPLY}/GET_UNAUDITED_DETAIL`

export const GET_OPERATEPIC_UNAUDITED_LIST = `${RESOURCE_AUDIT_OPERATEPIC}/GET_OPERATEPIC_UNAUDITED_LIST`
export const GET_OPERATEPIC_AUDITED_LIST = `${RESOURCE_AUDIT_OPERATEPIC}/GET_OPERATEPIC_AUDITED_LIST`
export const GET_OPERATEPIC_UNAUDITED_DETAIL = `${RESOURCE_AUDIT_OPERATEPIC}/GET_OPERATEPIC_UNAUDITED_DETAIL`

export const GET_OTT_MEDIA_CATEGORY_AUDIT_LIST = ``

// ===========================> Actions <=========================== //
// 获取媒资审核列表
export const getMediaList = arg => dispatch => {
  return fetchResource(dispatch, actions.SHOW_LIST_SPIN)(
    apis.audit.media.list,
    arg
  ).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_MEDIA_AUDIT_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取有象视频审核列表
export const getOTTMediaList = type => dispatch => {
  return fetchData(apis.audit.ottMedia.list, { id: type })
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_OTT_MEDIA_AUDIT_LIST)(res.data.cards))
      } else {
        message.error(res.errmsg)
      }
    })
}

export const getOTTMediaDetail = arg => dispatch => {
  return fetchData(dispatch, actions.showSpin)(
    apis.audit.ottMedia.detail,
    arg
  ).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_OTT_MEDIA_DETAIL)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const getOTTMediaAuditLog = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    apis.audit.ottMedia.auditLog,
    arg
  ).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_OTT_MEDIA_AUDIT_LOG)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 界面审核提交
export const postOTTMediaAudit = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_BUTTON_SPIN)(apis.audit.ottMedia.postAduit, arg).then(res => {
    if (res.code === 0) {
      message.info('提交成功')
      history.go(-1)
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取有象视频分类审核列表
export const getOTTCategoryList = arg => dispatch => {
  // return fetchData(apis.audit.ottChannel.list, values)
  //   .then(res => {
  //     if (res.code === 0) {
  //       dispatch(createAction(GET_OTT_CATEGORY_AUDIT_LIST)(res.data))
  //     } else {
  //       message.error(res.errmsg)
  //     }
  //   })
  // 待审核请求业务接口，已审核请求日志接口
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    arg.auditStatus === AuditStatusKeyMap.WAIT.value ? apis.audit.ottCategory.list : apis.audit.ottCategory.auditList,
    arg
  ).then(res => {
    if (res.code === 0) {
      res.data.pageSize = arg.pageSize
      res.data.data = res.data.data || res.data.channelVOResList
      res.data.data && res.data.data.map((obj) => {
        obj.serviceId = obj.serviceId || obj.channelId
        // 将快照信息提取出来
        if (obj.snapShot) {
          try {
            obj.snapShot = JSON.parse(obj.snapShot) || {}
          } catch (error) {
            obj.snapShot = {}
          }
          Object.assign(obj, obj.snapShot, { createTime: obj.createTime, auditStatus: obj.status })
        }
        obj._row_key = obj.auditId || obj.serviceId
      })
      dispatch(
        createAction(GET_OTT_CATEGORY_AUDIT_LIST)({
          ...res.data,
          filter: arg
        })
      )
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取有象视频分类审核详情
export const getOTTCategoryDetail = arg => dispatch => {
  return fetchData(dispatch, actions.showSpin)(
    arg.type === AuditLogSearchType ? apis.audit.ottCategory.auditedDetail : apis.audit.ottCategory.detail,
    arg
  ).then(res => {
    if (res.code === 0) {
      if (arg.type === AuditLogSearchType && res.data) {
        try {
          res.data.snapShot = JSON.parse(res.data.snapShot) || {}
        } catch (error) {
          res.data.snapShot = {}
        }
        Object.assign(res.data, res.data.snapShot, { auditStatus: res.data.status })
      }
      dispatch(createAction(GET_OTT_CATEGORY_DETAIL)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取有象视频分类审核列表
export const getOTTChannelList = arg => dispatch => {
  // return fetchData(apis.audit.ottChannel.list, values)
  //   .then(res => {
  //     if (res.code === 0) {
  //       dispatch(createAction(GET_OTT_CATEGORY_AUDIT_LIST)(res.data))
  //     } else {
  //       message.error(res.errmsg)
  //     }
  //   })
  // 待审核请求业务接口，已审核请求日志接口
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    arg.auditStatus === AuditStatusKeyMap.WAIT.value ? apis.audit.ottChannel.list : apis.audit.ottChannel.auditList,
    arg
  ).then(res => {
    if (res.code === 0) {
      res.data.pageSize = arg.pageSize
      res.data.data = res.data.data || res.data.channelVOResList
      res.data.data && res.data.data.map((obj) => {
        obj.serviceId = obj.serviceId || obj.channelId
        // 将快照信息提取出来
        if (obj.snapShot) {
          try {
            obj.snapShot = JSON.parse(obj.snapShot) || {}
          } catch (error) {
            obj.snapShot = {}
          }
          Object.assign(obj, obj.snapShot, { createTime: obj.createTime, auditStatus: obj.status })
        }
        obj._row_key = obj.auditId || obj.serviceId
      })
      let channelList = {}
      if (Array.isArray(res.data)) {
        channelList = { data: res.data }
      } else {
        channelList = res.data
      }
      dispatch(
        createAction(GET_OTT_CHANNEL_AUDIT_LIST)({
          ...channelList,
          filter: arg
        })
      )
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取有象视频分类审核详情
export const getOTTChannelDetail = arg => dispatch => {
  return fetchData(dispatch, actions.showSpin)(
    arg.type === AuditLogSearchType ? apis.audit.ottChannel.auditedDetail : apis.audit.ottChannel.detail,
    arg
  ).then(res => {
    if (res.code === 0) {
      if (arg.type === AuditLogSearchType && res.data) {
        try {
          res.data.snapShot = JSON.parse(res.data.snapShot) || {}
        } catch (error) {
          res.data.snapShot = {}
        }
        Object.assign(res.data, res.data.snapShot, { auditStatus: res.data.status })
      }
      dispatch(createAction(GET_OTT_CHANNEL_DETAIL)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 界面审核详情查询
export const getCategoryAuditLog = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    apis.audit.ottChannel.auditLog,
    arg
  ).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_INTERPHASE_AUDIT_LOG)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 有象视频分类审核提交
export const postOttCategoryAudit = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_BUTTON_SPIN)(
    apis.audit.live.channel.postAduit,
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

// 获取广告位审核列表
export const getAdvertisePositionAuditList = arg => dispatch => {
  // 待审核请求业务接口，已审核请求日志接口
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    arg.auditStatus === AuditStatusKeyMap.WAIT.value ? apis.audit.advertisePosition.list : apis.audit.advertisePosition.auditList,
    arg
  ).then(res => {
    if (res.code === 0) {
      res.data.data && res.data.data.map((obj) => {
        obj.serviceId = obj.serviceId || obj.positionId
        // 将快照信息提取出来
        if (obj.snapShot) {
          try {
            obj.snapShot = JSON.parse(obj.snapShot) || {}
          } catch (error) {
            obj.snapShot = {}
          }
          Object.assign(obj, obj.snapShot, { createTime: obj.createTime, auditStatus: obj.status })
        }
      })
      dispatch(
        createAction(GET_ADVERTISE_POSITION_AUDIT_LIST)({
          ...res.data,
          filter: arg
        })
      )
    } else {
      message.error(res.errmsg)
    }
  })
}

// 广告位详情查询
export const getAdvertisePositionDetail = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    arg.type === AuditLogSearchType ? apis.audit.advertisePosition.auditDetail : apis.audit.advertisePosition.detail,
    arg
  ).then(res => {
    if (res.code === 0) {
      if (arg.type === AuditLogSearchType && res.data) {
        try {
          res.data.snapShot = JSON.parse(res.data.snapShot) || {}
        } catch (error) {
          res.data.snapShot = {}
        }
        Object.assign(res.data, res.data.snapShot, { auditStatus: res.data.status })
      }
      dispatch(createAction(GET_ADVERTISE_POSITION_DETAIL)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 广告位审核详情查询
export const getAdvertisePositionAuditLog = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    apis.audit.advertisePosition.auditLog,
    arg
  ).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_ADVERTISE_POSITION_AUDIT_LOG)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 广告位审核提交
export const postAdvertisePositionAudit = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_BUTTON_SPIN)(apis.audit.advertisePosition.postAduit, arg).then(res => {
    if (res.code === 0) {
      message.info('提交成功')
      history.go(-1)
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取广告审核列表
export const getAdvertiseList = arg => dispatch => {
  // 待审核请求业务接口，已审核请求日志接口
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    arg.auditStatus === AuditStatusKeyMap.WAIT.value ? apis.audit.advertise.list : apis.audit.advertise.auditList,
    arg
  ).then(res => {
    if (res.code === 0) {
      res.data.data && res.data.data.map((obj) => {
        obj.serviceId = obj.serviceId || obj.adId
        // 将快照信息提取出来
        if (obj.snapShot) {
          try {
            obj.snapShot = JSON.parse(obj.snapShot) || {}
          } catch (error) {
            obj.snapShot = {}
          }
          Object.assign(obj, obj.snapShot, { createTime: obj.createTime, auditStatus: obj.status })
        }
        obj._row_key = obj.auditId || obj.serviceId
      })
      dispatch(
        createAction(GET_ADVERTISE_AUDIT_LIST)({
          ...res.data,
          filter: arg
        })
      )
    } else {
      message.error(res.errmsg)
    }
  })
}

// 广告详情查询
export const getAdvertiseDetail = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    arg.type === AuditLogSearchType ? apis.audit.advertise.auditDetail : apis.audit.advertise.detail,
    arg
  ).then(res => {
    if (res.code === 0) {
      if (arg.type === AuditLogSearchType && res.data) {
        try {
          res.data.snapShot = JSON.parse(res.data.snapShot) || {}
        } catch (error) {
          res.data.snapShot = {}
        }
        Object.assign(res.data, res.data.snapShot, { auditStatus: res.data.status })
      }
      dispatch(createAction(GET_ADVERTISE_DETAIL)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 广告审核详情查询
export const getAdvertiseAuditLog = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    apis.audit.advertise.auditLog,
    arg
  ).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_ADVERTISE_AUDIT_LOG)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 广告审核提交
export const postAdvertiseAudit = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_BUTTON_SPIN)(apis.audit.advertise.postAduit, arg).then(res => {
    if (res.code === 0) {
      message.info('提交成功')
      history.go(-1)
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取界面审核列表
export const getInterphaseList = arg => dispatch => {
  // 待审核请求业务接口，已审核请求日志接口
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    arg.auditStatus === AuditStatusKeyMap.WAIT.value ? apis.audit.interphase.list : apis.audit.interphase.auditList,
    arg
  ).then(res => {
    if (res.code === 0) {
      res.data.pageSize = arg.pageSize
      res.data.data = res.data.data || res.data.channelVOResList
      res.data.data && res.data.data.map((obj) => {
        obj.serviceId = obj.serviceId || obj.channelId
        // 将快照信息提取出来
        if (obj.snapShot) {
          try {
            obj.snapShot = JSON.parse(obj.snapShot) || {}
          } catch (error) {
            obj.snapShot = {}
          }
          Object.assign(obj, obj.snapShot, { createTime: obj.createTime, auditStatus: obj.status })
        }
        obj._row_key = obj.auditId || obj.serviceId
      })
      dispatch(
        createAction(GET_INTERPHASE_AUDIT_LIST)({
          ...res.data,
          filter: arg
        })
      )
    } else {
      message.error(res.errmsg)
    }
  })
}

// 界面审核详情查询
export const getInterphaseDetail = arg => dispatch => {
  return fetchData(dispatch, actions.showSpin)(
    arg.type === AuditLogSearchType ? apis.audit.interphase.auditDetail : apis.audit.interphase.detail,
    arg
  ).then(res => {
    if (res.code === 0) {
      if (arg.type === AuditLogSearchType && res.data) {
        try {
          res.data.snapShot = JSON.parse(res.data.snapShot) || {}
        } catch (error) {
          res.data.snapShot = {}
        }
        Object.assign(res.data, res.data.snapShot, { auditStatus: res.data.status })
      }
      dispatch(createAction(GET_INTERPHASE_DETAIL)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 界面审核详情查询
export const getInterphaseAuditLog = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    apis.audit.interphase.auditLog,
    arg
  ).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_INTERPHASE_AUDIT_LOG)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 界面审核提交
export const postInterphaseAudit = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_BUTTON_SPIN)(apis.audit.interphase.postAduit, arg).then(res => {
    if (res.code === 0) {
      message.info('提交成功')
      history.go(-1)
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取直播频道分类审核列表
export const getChannelCateList = arg => dispatch => {
  // 待审核请求业务接口，已审核请求日志接口
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    arg.auditStatus === AuditStatusKeyMap.WAIT.value ? apis.audit.live.cate.list : apis.audit.live.cate.auditList,
    arg
  ).then(res => {
    if (res.code === 0) {
      res.data.data && res.data.data.map((obj) => {
        obj.serviceId = obj.serviceId || obj.cateId
        // 将快照信息提取出来
        if (obj.snapShot) {
          try {
            obj.snapShot = JSON.parse(obj.snapShot) || {}
          } catch (error) {
            obj.snapShot = {}
          }
          Object.assign(obj, obj.snapShot, { createTime: obj.createTime, auditStatus: obj.status })
        }
        obj._row_key = obj.auditId || obj.serviceId
      })
      dispatch(
        createAction(GET_CHANNEL_CATE_AUDIT_LIST)({
          ...res.data,
          filter: arg
        })
      )
    } else {
      message.error(res.errmsg)
    }
  })
}

// 直播频道分类详情查询
export const getChannelCateDetail = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    arg.type === AuditLogSearchType ? apis.audit.live.cate.auditDetail : apis.audit.live.cate.detail,
    arg
  ).then(res => {
    if (res.code === 0) {
      if (arg.type === AuditLogSearchType && res.data) {
        try {
          res.data.snapShot = JSON.parse(res.data.snapShot) || {}
        } catch (error) {
          res.data.snapShot = {}
        }
        Object.assign(res.data, res.data.snapShot, { auditStatus: res.data.status })
      }
      dispatch(createAction(GET_CHANNEL_CATE_AUDIT_DETAIL)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 直播频道分类审核记录查询
export const getChannelCateAuditLog = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    apis.audit.live.cate.auditLog,
    arg
  ).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_CHANNEL_CATE_AUDIT_LOG)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 直播频道审核提交
export const postChannelCateAudit = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_BUTTON_SPIN)(apis.audit.live.cate.postAduit, arg).then(res => {
    if (res.code === 0) {
      message.info('提交成功')
      history.go(-1)
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取直播频道分类审核列表
export const getChannelList = arg => dispatch => {
  // 待审核请求业务接口，已审核请求日志接口
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    arg.auditStatus === AuditStatusKeyMap.WAIT.value ? apis.audit.live.channel.list : apis.audit.live.channel.auditList,
    arg
  ).then(res => {
    if (res.code === 0) {
      res.data.data && res.data.data.map((obj) => {
        obj.serviceId = obj.serviceId || obj.channelId
        // 将快照信息提取出来
        if (obj.snapShot) {
          try {
            obj.snapShot = JSON.parse(obj.snapShot) || {}
          } catch (error) {
            obj.snapShot = {}
          }
          Object.assign(obj, obj.snapShot, { createTime: obj.createTime, auditStatus: obj.status })
        }
        obj._row_key = obj.auditId || obj.serviceId
      })
      dispatch(
        createAction(GET_CHANNEL_AUDIT_LIST)({
          ...res.data,
          filter: arg
        })
      )
    } else {
      message.error(res.errmsg)
    }
  })
}

// 直播频道分类详情查询
export const getChannelDetail = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    arg.type === AuditLogSearchType ? apis.audit.live.channel.auditDetail : apis.audit.live.channel.detail,
    arg
  ).then(res => {
    if (res.code === 0) {
      if (arg.type === AuditLogSearchType && res.data) {
        try {
          res.data.snapShot = JSON.parse(res.data.snapShot) || {}
        } catch (error) {
          res.data.snapShot = {}
        }
        Object.assign(res.data, res.data.snapShot, { auditStatus: res.data.status })
      }
      dispatch(createAction(GET_CHANNEL_AUDIT_DETAIL)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 直播频道分类审核记录查询
export const getChannelAuditLog = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    apis.audit.live.channel.auditLog,
    arg
  ).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_CHANNEL_AUDIT_LOG)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 直播频道审核提交
export const postChannelAudit = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_BUTTON_SPIN)(
    apis.audit.live.channel.postAduit,
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

// 获取影视分类审核列表
export const getOperateList = arg => dispatch => {
  // 待审核请求业务接口，已审核请求日志接口
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    arg.auditStatus === AuditStatusKeyMap.WAIT.value ? apis.audit.operate.list : apis.audit.operate.auditList,
    arg
  ).then(res => {
    if (res.code === 0) {
      res.data.data && res.data.data.map((obj) => {
        obj.serviceId = obj.serviceId || obj.cateId
        // 将快照信息提取出来
        if (obj.snapShot) {
          try {
            obj.snapShot = JSON.parse(obj.snapShot) || {}
          } catch (error) {
            obj.snapShot = {}
          }
          Object.assign(obj, obj.snapShot, { createTime: obj.createTime, auditStatus: obj.status })
        }
        obj._row_key = obj.auditId || obj.serviceId
      })
      dispatch(
        createAction(GET_OPERATE_AUDIT_LIST)({
          ...res.data,
          filter: arg
        })
      )
    } else {
      message.error(res.errmsg)
    }
  })
}

// 直播频道分类详情查询
export const getOperateDetail = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    arg.type === AuditLogSearchType ? apis.audit.operate.auditDetail : apis.audit.operate.detail,
    arg
  ).then(res => {
    if (res.code === 0) {
      if (arg.type === AuditLogSearchType && res.data) {
        try {
          res.data.snapShot = JSON.parse(res.data.snapShot) || {}
        } catch (error) {
          res.data.snapShot = {}
        }
        Object.assign(res.data, res.data.snapShot, { auditStatus: res.data.status })
      }
      dispatch(createAction(GET_OPERATE_AUDIT_DETAIL)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 直播频道分类审核记录查询
export const getOperateAuditLog = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(
    apis.audit.operate.auditLog,
    arg
  ).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_OPERATE_AUDIT_LOG)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 直播频道审核提交
export const postOperateAudit = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_BUTTON_SPIN)(apis.audit.operate.postAduit, arg).then(res => {
    if (res.code === 0) {
      message.info('提交成功')
      history.go(-1)
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取应用审核列表
export const getUnauditedList = arg => dispatch =>
  fetchData(dispatch, actions.SHOW_LIST_SPIN)(apis.audit.apply.list, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_UNAUDITED_LIST)({ ...res.data, filter: arg }))
      }
    })

export const getAuditedList = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(apis.audit.apply.auditList, arg)
    .then(res => {
      if (res.code === 0) {
        res.data.data && res.data.data.map((obj) => {
          // 将快照信息提取出来
          if (obj.snapShot) {
            obj.snapShot = JSON.parse(obj.snapShot) || {}
          } else {
            obj.snapShot = {}
          }
          Object.assign(obj, obj.snapShot, { auditTime: obj.createTime })
        })
        dispatch(createAction(GET_AUDITED_LIST)({ ...res.data, filter: arg }))
      } else {
        message.error(res.errmsg)
      }
    })
}

//
export const getAuditedDetail = arg => dispatch => {
  return fetchData(dispatch, actions.showSpin)(
    apis.audit.apply.auditedDetail,
    arg
  ).then(res => {
    if (res.code === 0) {
      if (res.data) {
        if (res.data.snapShot) {
          res.data.snapShot = JSON.parse(res.data.snapShot) || {}
        } else {
          res.data.snapShot = {}
        }
        Object.assign(res.data, res.data.snapShot, { auditTime: res.data.createTime })
      }
      dispatch(createAction(GET_AUDITED_DETAIL)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const getUnAuditedDetail = arg => dispatch => {
  return fetchData(dispatch, actions.showSpin)(
    apis.audit.apply.unAuditedDetail,
    arg
  ).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_UNAUDITED_DETAIL)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const applyAudit = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_BUTTON_SPIN)(apis.audit.apply.aduit, arg).then(res => {
    if (res.code === 0) {
      message.info('审核成功')
      history.go(-1)
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取运营图审核列表

export const getOperatePicUnauditedList = arg => dispatch =>
  fetchData(dispatch, actions.SHOW_LIST_SPIN)(apis.audit.operatepic.list, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_OPERATEPIC_UNAUDITED_LIST)({ ...res.data, filter: arg }))
      }
    })

export const getOperatePicAuditedList = arg => dispatch => {
  return fetchData(dispatch, actions.SHOW_LIST_SPIN)(apis.audit.operatepic.auditList, arg)
    .then(res => {
      if (res.code === 0) {
        res.data.data && res.data.data.map((obj) => {
          // 将快照信息提取出来
          if (obj.snapShot) {
            obj.snapShot = JSON.parse(obj.snapShot) || {}
          } else {
            obj.snapShot = {}
          }
          Object.assign(obj, obj.snapShot, { auditTime: obj.createTime })
        })
        dispatch(createAction(GET_OPERATEPIC_AUDITED_LIST)({ ...res.data, filter: arg }))
      } else {
        message.error(res.errmsg)
      }
    })
}

export const getOperatePicUnAuditedDetail = arg => dispatch => {
  return fetchData(dispatch, actions.showSpin)(
    apis.audit.operatepic.unAuditedDetail,
    arg
  ).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_OPERATEPIC_UNAUDITED_DETAIL)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  // 媒资审核
  mediaList: [],
  mediaPage: {
    current: 1,
    total: 0,
    pageSize: 10
  },
  mediaFilter: {},
  mediaDetail: {},

  // 有象快搜影视审核列表
  ottMediaAuditList: [],
  ottMediaAuditLogs: [],
  ottMediaAuditDetail: {
    auditStatus: 1
  },

  // 有象分类审核列表
  ottCategoryList: [],
  ottCategoryPage: {
    current: 1,
    total: 0,
    pageSize: 10
  },
  ottCategoryFilter: {},
  ottCategoryDetail: {},

  // 广告位审核
  advertisePositionList: [],
  advertisePositionPage: {
    current: 1,
    total: 0,
    pageSize: 10
  },
  advertisePositionFilter: {},
  advertisePositionDetail: {},
  advertisePositionAuditLogs: [],

  // 广告审核
  advertiseList: [],
  advertisePage: {
    current: 1,
    total: 0,
    pageSize: 10
  },
  advertiseFilter: {},
  advertiseDetail: {},
  advertisePositions: [],
  advertiseAuditLogs: [],

  // 界面审核
  interphaseList: [],
  interphasePage: {
    current: 1,
    total: 0,
    pageSize: 10
  },
  interphaseFilter: {},
  interphaseDetail: {},
  interphaseAuditDetail: {},
  interphasePositions: [],
  interphaseAuditLogs: [],

  // 直播频道分类
  livecateList: [],
  livecatePage: {
    current: 1,
    total: 0,
    pageSize: 10
  },
  livecateFilter: {},
  livecateDetail: {},
  livecateAuditLogs: [],

  // 直播频道
  livechannelList: [],
  livechannelPage: {
    current: 1,
    total: 0,
    pageSize: 10
  },
  livechannelFilter: {},
  livechannelDetail: {},
  livechannelAuditLogs: [],

  // 影视分类
  operateList: [],
  operatePage: {
    current: 1,
    total: 0,
    pageSize: 10
  },
  operateFilter: {},
  operateDetail: {},
  operateAuditLogs: [],

  // 应用审核
  auditedDetail: {},
  unAuditedDetail: {},
  unAuditedPicDetail: {}

}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    // 媒资
    case GET_MEDIA_AUDIT_LIST:
      return ReduckHelper.resolveListState('media', state, action.payload)
    // 有象视频资源
    case GET_OTT_MEDIA_AUDIT_LIST:
      return ReduckHelper.resolveListState('ottMedia', state, action.payload)
    case GET_OTT_MEDIA_DETAIL:
      return {
        ...state,
        ottMediaAuditDetail: action.payload
      }
    case GET_OTT_MEDIA_AUDIT_LOG:
      return {
        ...state,
        ottMediaAuditLogs: action.payload
      }
    case GET_OTT_CATEGORY_AUDIT_LIST:
      return ReduckHelper.resolveListState('ottCategory', state, action.payload)
    case GET_OTT_CATEGORY_DETAIL:
      return {
        ...state,
        categoryAuditDetail: action.payload
      }
    case GET_CATEGORY_AUDIT_LOG:
      return {
        ...state,
        categoryAuditLogs: action.payload
      }
    case GET_OTT_CHANNEL_AUDIT_LIST:
      return ReduckHelper.resolveListState('ottChannel', state, action.payload)
    case GET_OTT_CHANNEL_DETAIL:
      return {
        ...state,
        channelAuditDetail: action.payload
      }
    case GET_OTT_CHANNEL_AUDIT_LOG:
      return {
        ...state,
        channeluditLogs: action.payload
      }
    // 广告
    case GET_ADVERTISE_AUDIT_LIST:
      return ReduckHelper.resolveListState('advertise', state, action.payload)
    case GET_ADVERTISE_DETAIL:
      return {
        ...state,
        advertiseDetail: action.payload
      }
    case GET_ADVERTISE_AUDIT_LOG:
      return {
        ...state,
        advertiseAuditLogs: action.payload
      }
    // 广告位
    case GET_ADVERTISE_POSITION_AUDIT_LIST:
      return ReduckHelper.resolveListState('advertisePosition', state, action.payload)
    case GET_ADVERTISE_POSITION_DETAIL:
      return {
        ...state,
        advertisePositionDetail: action.payload
      }
    case GET_ADVERTISE_POSITION_AUDIT_LOG:
      return {
        ...state,
        advertisePositionAuditLogs: action.payload
      }
    // 界面
    case GET_INTERPHASE_AUDIT_LIST:
      return ReduckHelper.resolveListState('interphase', state, action.payload)
    case GET_INTERPHASE_DETAIL:
      return {
        ...state,
        interphaseAuditDetail: action.payload
      }
    case GET_INTERPHASE_AUDIT_LOG:
      return {
        ...state,
        interphaseAuditLogs: action.payload
      }

    // 直播频道分类
    case GET_CHANNEL_CATE_AUDIT_LIST:
      return ReduckHelper.resolveListState('livecate', state, action.payload)
    case GET_CHANNEL_CATE_AUDIT_DETAIL:
      return {
        ...state,
        livecateDetail: action.payload
      }
    case GET_CHANNEL_CATE_AUDIT_LOG:
      return {
        ...state,
        livecateAuditLogs: action.payload
      }
    // 直播频道
    case GET_CHANNEL_AUDIT_LIST:
      return ReduckHelper.resolveListState('livechannel', state, action.payload)
    case GET_CHANNEL_AUDIT_DETAIL:
      return {
        ...state,
        livechannelDetail: action.payload
      }
    case GET_CHANNEL_AUDIT_LOG:
      return {
        ...state,
        livechannelAuditLogs: action.payload
      }
    // 影视分类
    case GET_OPERATE_AUDIT_LIST:
      return ReduckHelper.resolveListState('operate', state, action.payload)
    case GET_OPERATE_AUDIT_DETAIL:
      return {
        ...state,
        operateDetail: action.payload
      }
    case GET_OPERATE_AUDIT_LOG:
      return {
        ...state,
        operateAuditLogs: action.payload
      }
    case GET_AUDITED_LIST:
      return ReduckHelper.resolveListState('applyAudited', state, action.payload)
    case GET_UNAUDITED_LIST:
      return ReduckHelper.resolveListState('applyUnAudited', state, action.payload)
    case GET_AUDITED_DETAIL:
      return {
        ...state,
        auditedDetail: action.payload
      }
    case GET_UNAUDITED_DETAIL:
      return {
        ...state,
        unAuditedDetail: action.payload
      }
    case GET_OPERATEPIC_UNAUDITED_LIST:
      return ReduckHelper.resolveListState('operatePicUnAudited', state, action.payload)
    case GET_OPERATEPIC_AUDITED_LIST:
      return ReduckHelper.resolveListState('operatePicAudited', state, action.payload)
    case GET_OPERATEPIC_UNAUDITED_DETAIL:
      return {
        ...state,
        unAuditedPicDetail: action.payload
      }
    default:
      return state
  }
}
