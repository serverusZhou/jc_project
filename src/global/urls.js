export const HOME = '/'
export const LOGIN = `${HOME}login`

// resource
export const RESOURCE = `${HOME}resource`
export const OTTRESOURCE = `${HOME}ottResource`

// 演员管理
export const RESOURCE_ACTOR = `${RESOURCE}/actor`
export const RESOURCE_ACTOR_ADD = `${RESOURCE}/actor/add`
export const RESOURCE_ACTOR_EDIT = `${RESOURCE}/actor/edit`
export const RESOURCE_ACTOR_DETAIL = `${RESOURCE}/actor/detail`

// 审核管理
export const RESOURCE_AUDIT = `${RESOURCE}/audit`
export const RESOURCE_AUDIT_ADVERTISE = `${RESOURCE_AUDIT}/advertise`
export const RESOURCE_AUDIT_ADVERTISE_DETAIL = `${RESOURCE_AUDIT_ADVERTISE}/detail`
export const RESOURCE_AUDIT_INTERPHASE = `${RESOURCE_AUDIT}/interphase`
export const RESOURCE_AUDIT_INTERPHASE_DETAIL = `${RESOURCE_AUDIT_INTERPHASE}/detail`
export const RESOURCE_AUDIT_MEDIA = `${RESOURCE_AUDIT}/media`
export const RESOURCE_AUDIT_MEDIA_DETAIL = `${RESOURCE_AUDIT_MEDIA}/detail`
export const RESOURCE_AUDIT_VIDEO = `${RESOURCE_AUDIT_MEDIA_DETAIL}/video`
export const RESOURCE_AUDIT_LIVE = `${RESOURCE_AUDIT}/live`
export const RESOURCE_AUDIT_LIVE_CATE = `${RESOURCE_AUDIT_LIVE}/cate`
export const RESOURCE_AUDIT_LIVE_CATE_DETAIL = `${RESOURCE_AUDIT_LIVE_CATE}/detail`
export const RESOURCE_AUDIT_LIVE_CHANNEL = `${RESOURCE_AUDIT_LIVE}/channel`
export const RESOURCE_AUDIT_LIVE_CHANNEL_DETAIL = `${RESOURCE_AUDIT_LIVE_CHANNEL}/detail`
export const RESOURCE_AUDIT_OPERATION = `${RESOURCE_AUDIT_LIVE}/operate`
export const RESOURCE_AUDIT_OPERATION_DETAIL = `${RESOURCE_AUDIT_OPERATION}/detail`
export const RESOURCE_AUDIT_ADVERTISE_POSITION = `${RESOURCE_AUDIT}/position`
export const RESOURCE_AUDIT_ADVERTISE_POSITION_DETAIL = `${RESOURCE_AUDIT_ADVERTISE_POSITION}/detail`
export const RESOURCE_AUDIT_APPLY = `${RESOURCE_AUDIT}/apply` // 应用审核
export const RESOURCE_AUDIT_APPLY_AUDITEDDETAIL = `${RESOURCE_AUDIT}/apply/audited`
export const RESOURCE_AUDIT_APPLY_UNAUDITEDDETAIL = `${RESOURCE_AUDIT}/apply/unaudited`
export const RESOURCE_AUDIT_OPERATEPIC = `${RESOURCE_AUDIT}/operatepic`
export const RESOURCE_AUDIT_OPERATEPIC_UNAUDITEDDETAIL = `${RESOURCE_AUDIT_OPERATEPIC}/unaudited`
export const RESOURCE_AUDIT_OPERATEPIC_AUDITEDDETAIL = `${RESOURCE_AUDIT_OPERATEPIC}/audited`

// 有象审核
export const OTTRESOURCE_AUDIT = `${OTTRESOURCE}/audit`
export const OTTRESOURCE_AUDIT_CHANNEL = `${OTTRESOURCE_AUDIT}/channel`
export const OTTRESOURCE_AUDIT_CHANNEL_DETAIL = `${OTTRESOURCE_AUDIT}/channel/detail`
export const OTTRESOURCE_AUDIT_CATEGORY = `${OTTRESOURCE_AUDIT}/category`
export const OTTRESOURCE_AUDIT_CATEGORY_DETAIL = `${OTTRESOURCE_AUDIT}/category/detail`
export const OTTRESOURCE_AUDIT_MEDIA = `${OTTRESOURCE_AUDIT}/media`
export const OTTRESOURCE_AUDIT_MEDIA_DETAIL = `${OTTRESOURCE_AUDIT}/media/detail`

// 权限管理
export const RESOURCE_AUTHS = `${RESOURCE}/auths`
export const RESOURCE_AUTHS_DETAIL = `${RESOURCE}/auths/detail`

// 角色管理
export const RESOURCE_ROLE = `${RESOURCE}/role`
export const RESOURCE_ROLE_DETAIL = `${RESOURCE}/role/detail`

// 分类管理
export const RESOURCE_CLASSIFY = `${RESOURCE}/classify`
export const RESOURCE_CLASSIFY_MANAGE = `${RESOURCE_CLASSIFY}/manage`
export const RESOURCE_CLASSIFY_TEMPLATE = `${RESOURCE_CLASSIFY}/template`

// 介质管理
export const RESOURCE_MEDIA = `${RESOURCE}/media`
export const RESOURCE_MEDIA_ADD = `${RESOURCE_MEDIA}/add`

// 媒资库
export const RESOURCE_MEDIA_LICENSE = `${RESOURCE_MEDIA}/license`
export const RESOURCE_MEDIA_LICENSE_DETAIL = `${RESOURCE_MEDIA_LICENSE}/license/detail`
export const RESOURCE_MEDIA_THIRD = `${RESOURCE_MEDIA}/third`
export const RESOURCE_MEDIA_DETAIL = `${RESOURCE_MEDIA_THIRD}/detail`
export const RESOURCE_MEDIA_VIDEO = `${RESOURCE_MEDIA_DETAIL}/video` // 媒资管理 / 三方资源库管理 / 视频播放
export const RESOURCE_MEDIA_EDIT = `${RESOURCE_MEDIA_THIRD}/edit`

// 运营后台
export const OPERATE = `${HOME}operate` // 运营后台根路由

// 广告位
export const OPERATE_ADVERTISE = `${OPERATE}/advertise`
export const OPERATE_ADVERTISE_MANAGE = `${OPERATE_ADVERTISE}/manage` // 运营后台 / 广告位管理
export const OPERATE_ADVERTISE_MANAGE_ADD = `${OPERATE_ADVERTISE_MANAGE}/add`
export const OPERATE_ADVERTISE_MANAGE_EDIT = `${OPERATE_ADVERTISE_MANAGE}/:adId`
export const OPERATE_ADVERTISE_CLASSFIY = `${OPERATE_ADVERTISE}/classfiy` // 运营后台 / 广告位管理 / 分类管理

// 游戏中心
export const OPERATE_GAME = `${OPERATE}/game`
export const OPERATE_GAME_CENTER = `${OPERATE_GAME}/center` // 运营后台 / 游戏中心
export const OPERATE_GAME_CLASSFIY = `${OPERATE_GAME}/classfiy` // 运营后台 / 游戏中心 / 分类管理

// 首页推荐
export const OPERATE_HOME = `${OPERATE}/homeReco`
export const OPERATE_HOME_MANAGE = `${OPERATE_HOME}/manage` // 运营后台 / 首页推荐
export const OPERATE_HOME_MANAGE_ADD = `${OPERATE_HOME_MANAGE}/add` // 运营后台 / 首页推荐
export const OPERATE_HOME_MANAGE_EDIT = `${OPERATE_HOME_MANAGE}/edit` // 运营后台 / 首页推荐
export const OPERATE_HOME_MANAGE_INFO = `${OPERATE_HOME_MANAGE}/info` // 运营后台 / 首页推荐

// 影视推荐
export const OPERATE_VEDIO_RECO = `${OPERATE}/vedioReco`
export const OPERATE_VEDIO_RECO_MANAGE = `${OPERATE_VEDIO_RECO}/manage` // 运营后台 / 影视推荐
export const OPERATE_VEDIO_RECO_ADD = `${OPERATE_VEDIO_RECO_MANAGE}/add` // 运营后台 / 影视推荐
export const OPERATE_VEDIO_RECO_INFO = `${OPERATE_VEDIO_RECO_MANAGE}/info` // 运营后台 / 影视推荐

// 订单中心
export const OPERATE_ORDER = `${OPERATE}/order` // 运营后台 / 订单中心

// 生活服务中心
export const OPERATE_SERVICE = `${OPERATE}/service`
export const OPERATE_SERVICE_CENTER = `${OPERATE_SERVICE}/center` // 运营后台 / 生活服务中心
export const OPERATE_SERVICE_CLASSFIY = `${OPERATE_SERVICE}/classfiy` // 运营后台 / 生活服务中心 / 分类管理

// 用户中心
export const OPERATE_USER = `${OPERATE}/user`
export const OPERATE_USER_CENTER = `${OPERATE_USER}/center` // 运营后台 / 用户中心
export const OPERATE_USER_COLLECT = `${OPERATE_USER}/collect` // 运营后台 / 用户中心 / 收藏信息
export const OPERATE_USER_MAC = `${OPERATE_USER}/mac` // 运营后台 / 用户中心 / Mac地址
export const OPERATE_USER_ACCOUNT = `${OPERATE_USER}/account` // 运营后台 / 用户中心 / Mac地址

// 直播管理
export const OPERATE_CHANNEL = `${OPERATE}/channel`
export const OPERATE_CHANNEL_CATE = `${OPERATE_CHANNEL}/cate` // 运营后台 / 直播管理
export const OPERATE_CHANNEL_LIST = `${OPERATE_CHANNEL}/list` // 运营后台 / 直播管理 / 子频道
export const OPERATE_CHANNEL_RESOURCE = `${OPERATE_CHANNEL}/resource` // 运营后台 / 直播管理 / 关联资源

// 影视分类管理
export const OPERATE_VEDIO = `${OPERATE}/vedio`
export const OPERATE_VEDIO_CATE = `${OPERATE_VEDIO}/cate` // 运营后台 / 影视分类管理
export const OPERATE_VEDIO_CHILD_CATE = `${OPERATE_VEDIO_CATE}/child` // 运营后台 / 影视分类管理 / 子分类
export const OPERATE_VEDIO_RESOURCE = `${OPERATE_VEDIO_CATE}/resource` // 运营后台 / 影视分类管理 / 关联资源
export const OPERATE_VEDIO_TAG = `${OPERATE_VEDIO_CATE}/tag` // 运营后台 / 影视分类管理 / 标签

// 看了又看
export const OPERATE_LOOK_LOOP = `${OPERATE}/lookLoop`

// 应用中心
export const OPERATE_APP_CENTER = `${OPERATE}/application`
export const OPERATE_APP_CENTER_ADD = `${OPERATE}/application/add`
export const OPERATE_APP_CENTER_EDIT = `${OPERATE}/application/edit`
export const OPERATE_APP_CENTER_UPDATE = `${OPERATE}/application/update`

/* ============================= 商城  ============================= */

const BASE_URL = '/tvmall'

export const MailHome = `${BASE_URL}/home`

// 类目管理
export const CLASSIFY = `${BASE_URL}/classify`
export const CLASSIFY_MALL = `${BASE_URL}/classify/classifyMall`
export const CLASSIFY_SUPERMARKET = `${BASE_URL}/classify/superMarket`

// 属性管理
export const ATTRIBUTE = `${BASE_URL}/attribute`

// 商品管理 孙弘飞
export const COMMODITY_LIST = `${BASE_URL}/commodity`
export const COMMODITY_DETAIL = `${BASE_URL}/commodity/detail`

// 店铺管理
export const SHOP_LIST = `${BASE_URL}/shop`
export const SHOP_ADD_LIST = `${BASE_URL}/shop/add`
export const SHOP_ADD_DETAIL = `${BASE_URL}/shop/add/detail`
export const SHOP_DETAIL = `${BASE_URL}/shop/detail`
export const SHOP_BIND_GOODS = `${BASE_URL}/shop/bindgoods`
// 订单管理
export const ORDER = `${BASE_URL}/order`

// 审核管理
export const AUDIT_MANAGEMENT = `${BASE_URL}/audit`
export const AUDIT_SHOP = `${BASE_URL}/audit/shop`
export const AUDIT_GOODS = `${BASE_URL}/audit/goods`
export const AUDIT_ATTRIBUTE = `${BASE_URL}/audit/attribute`
export const AUDIT_CATEGORY = `${BASE_URL}/audit/category`

// 有象快搜
export const OTT_SEARCH = `${HOME}oTTsearch` // 有象快搜根路由
export const OTT_CHANNEL = `${OTT_SEARCH}/channel`
export const OTT_LIVE = `${OTT_SEARCH}/ottlive`
export const OTT_CHANNEL_EDIT = `${OTT_CHANNEL}/edit/:id` // 频道编辑
export const OTT_CHANNEL_DETAIL = `${OTT_CHANNEL}/detail/:id` // 频道详情
export const OTT_CATGORY = `${OTT_SEARCH}/ottCatgory`
export const OTT_CATGORY_CHILD = `${OTT_SEARCH}/ottCatgory/list/:cateId`
export const OTT_CATGORY_RESOURCE = `${OTT_CATGORY}/resource/:cateId`
export const OTT_MEDIA = `${OTT_SEARCH}/ottMedia`
