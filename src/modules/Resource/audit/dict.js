import { arrayToMap } from 'Utils/helper'

export const AuditStatus = [
  { value: '0', name: '待提审', key: 'INIT' },
  { value: '1', name: '待审核', key: 'WAIT' },
  { value: '2', name: '未通过', key: 'FAIL' },
  { value: '3', name: '审核通过', key: 'PASS' }
]

export const SourceType = [
  { value: '1', name: '运营图' },
  { value: '2', name: '轮播位图' }
]
// 数组转换成map
export const AuditStatusMap = arrayToMap(AuditStatus, 'value')
export const AuditStatusKeyMap = arrayToMap(AuditStatus, 'key')

export const SearchAuditStatus = [
  { value: '1', name: '待审核', key: 'WAIT' },
  { value: '0', name: '已审核', key: 'FINISH' }
]
export const SearchAuditStatusMap = arrayToMap(SearchAuditStatus, 'value')
export const SearchAuditStatusKeyMap = arrayToMap(SearchAuditStatus, 'key')

export const MediaSource = [
  { value: 'self', name: '三方媒资', key: 'SELF' },
  { value: 'wasu', name: '华数牌照方', key: 'WASU' }
]

// 数组转换成map
export const MediaSourceMap = arrayToMap(MediaSource, 'value')
export const MediaSourceKeyMap = arrayToMap(MediaSource, 'key')

// 审核类型：1=广告 2=布局 3=媒资
export const OperateAuditType = {
  Advertise: 1,       //  广告
  Interphase: 2,      //  布局
  LiveChannelCate: 3, //  直播频道分类
  LiveChannel: 4,     //  直播频道
  OperateCate: 5,          //  运营分类
  AdvertisePosition: 6,          //  广告位
  Apply: 7, // 应用审核
  OTTCategory: 9, // 有象快搜分类
  OTTCHANNEL: 10, // 有象快搜频道
  OTTMediaPlay: 11, // 有象快搜点播
  OTTMediaNews: 12, // 有象快搜资讯
  OTTMediaRecommend: 13, // 有象快搜推荐
}

// 3:介质，如整个电视剧信息，4:具体视频，如某集电视剧中的高清版本，5:花絮
export const MediaAuditType = {
  Episode: 3,
  Media: 4,
  Highlight: 5
}

// 1 标清 2高清 3超清 4 1024p
export const AssetBitrate = [
  { value: '1', name: '流畅', key: 'SD' },
  { value: '2', name: '标清', key: 'HD' },
  { value: '3', name: '高清', key: 'SHD' },
  { value: '4', name: '超清', key: 'UHD' }
]
// 数组转换成map
export const AssetBitrateMap = arrayToMap(AssetBitrate, 'value')
export const AssetBitrateKeyMap = arrayToMap(AssetBitrate, 'key')

export const OperateLevel = [
  { value: '1', name: '一级分类', key: 'LEVEL_TOP' },
  { value: '2', name: '子分类', key: 'LEVEL_CHILD' },
]
export const OperateLevelMap = arrayToMap(OperateLevel, 'value')
export const OperateLevelKeyMap = arrayToMap(OperateLevel, 'key')

export const AuditLogSearchType = 99
