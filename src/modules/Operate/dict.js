export const EnableList = [
  { name: '禁用', value: 0 },
  { name: '启用', value: 1 },
]

export const RegisterMode = [
  { name: '是', value: '1' },
  { name: '否', value: '0' },
]

export const LoginMode = [
  { name: '手机验证码', value: 'JCY_CODE' },
  { name: '二维码', value: 'JCY_QRCODE' },
]

export const RecoType = {
  HOME: 'HOME',
  VEDIO: 'VEDIO',
}

export const IsOrNot = [
  { name: '是', value: '1' },
  { name: '不是', value: '0' },
]

export const OrderStatus = [
  { name: '待付款', value: 'PAY' },
  { name: '未使用', value: 'UNUSED' },
  { name: '待收货', value: 'RECEIVE' },
  { name: '已付款', value: 'PAID' },
  { name: '已取消', value: 'CANCEL' },
  { name: '已完成', value: 'COMPLETE' },
]

export const SourceType = [
  { name: '大象集团', value: '1' },
  { name: '电商', value: '2' },
]

export const NewPlatform = [
  { name: '金诚逸', value: '1' },
  { name: '客如云', value: '2' },
  { name: '金诚tv', value: '3' },
]

export const BusinessType = [
  { name: '生活缴费', value: '1' },
  { name: '商品销售', value: '2' },
]

export const OrderType = [
  { name: '普通销售订单', value: '1' },
  { name: '付款单', value: '3' },
]
// 布局
export const LayoutType = [
  { name: '首页1带4', value: '1', num: 5 },
  { name: '首页3托6', value: '2', num: 9 },
  { name: '首页2托6', value: '3', num: 8 },
  { name: '首页三个一排', value: '5', num: 3 },
  { name: '首页3托3', value: '4', num: 6 },
]

// 布局
export const VedioLayoutType = [
  { name: '视频首页  6个', value: '6', num: 6 },
  { name: '视频首页  3个', value: '7', num: 3 },
]
export const FlowType = [
  { name: '普通', value: '0' },
  { name: '瀑布流', value: '1' },
]
export const picUrlType = [
  { name: '16:9', value: '1', isAlive: true },
  { name: '4:3', value: '2', isAlive: false },
]
// 广告
export const statusEnum = [
  { name: '未提审', value: 0 },
  { name: '待审核', value: 1 },
  { name: '审核未通过', value: 2 },
  { name: '展示中', value: 3 },
  { name: '待展示', value: 4 },
  { name: '已下架', value: 5 }
]
export const adPositionStatusEnum = [
  { name: '未提审', value: 0 },
  { name: '待审核', value: 1 },
  { name: '未通过', value: 2 },
  { name: '启用', value: 3 },
  { name: '未启用', value: 4 }
]
// 首页推荐
// export const homeRecoStatusEnum = [
//   { name: '未提审', value: '0' },
//   { name: '审核不通过', value: '1' },
//   { name: '审核未通过', value: '2' },
//   { name: '启用', value: '3' },
//   { name: '未启用', value: '4' }
// ]

export const moduleEnum = [
  { name: '开机广告', value: '1' },
  { name: '待机广告', value: '2' },
  { name: '首页广告', value: '3' }
]

export const ChannelAuditStatus = [
  { name: '未提审', value: '0' },
  { name: '待审核', value: '1' },
  { name: '不通过', value: '2' },
  { name: '在用', value: '3' },
  { name: '未启用', value: '4' },
]

// 频道 子频道 频道状态
export const ChildChannelStatus = [
  { name: '未提审', value: '0' },
  { name: '待审核', value: '1' },
  { name: '不通过', value: '2' },
  { name: '未启用', value: '3' },
  { name: '在用', value: '4' },
]

// 绑定内容
export const typeEnum = [
  { name: '影视', value: '1' },
  { name: '广告', value: '2' },
  // { name: '商品', value: '4' },
  { name: '影视分类', value: '6' },
]
// 媒体内容
export const mediaTypeEnum = [
  { name: '图片', value: '1' },
  { name: '视频', value: '2' },
  { name: '应用', value: '3' }
]

// 资源来源
export const EpisodeSource = [
  { name: '华数', value: 'wasu' },
  { name: '自有', value: 'self' },
  { name: '优酷', value: 'yk' },
]

// 订单退款状态
export const RefundStatus = [
  { name: '退款中', value: '1' },
  { name: '退款成功', value: '2' },
]

export const MediaContentType = {
  'News': '新闻',
  'Movie': '电影',
  'Column': '栏目',
  'Series': '电视剧',
}
