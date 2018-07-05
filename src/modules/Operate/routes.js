import * as urls from 'Global/urls'
import { RouteHelper } from 'Utils/helper'
import OperateModule from 'bundle-loader?lazy!../Operate'

const genRoute = authTag =>
  (path, breadcrumbName, parentPath = urls.HOME) =>
  RouteHelper.genRoute(path, breadcrumbName, OperateModule, parentPath, authTag)

const adRouteGen = genRoute(urls.OPERATE_ADVERTISE)
const homeRouteGen = genRoute(urls.OPERATE_HOME_MANAGE)
const vedioRecoRouteGen = genRoute(urls.OPERATE_VEDIO_RECO_MANAGE)
const orderRouteGen = genRoute(urls.OPERATE_ORDER)
const userRouteGen = genRoute(urls.OPERATE_USER_CENTER)
const channelRouteGen = genRoute(urls.OPERATE_CHANNEL_CATE)
const serviceRouteGen = genRoute(urls.OPERATE_SERVICE_CENTER)
const gameRouteGen = genRoute(urls.OPERATE_GAME_CENTER)
const lookRouteGen = genRoute(urls.OPERATE_LOOK_LOOP)
const AppRouteGen = genRoute(urls.OPERATE_APP_CENTER)

export default [
  adRouteGen(urls.OPERATE_ADVERTISE_MANAGE, '广告管理'),
  adRouteGen(urls.OPERATE_ADVERTISE_MANAGE_ADD, '新增', urls.OPERATE_ADVERTISE_MANAGE),
  adRouteGen(`${urls.OPERATE_ADVERTISE_MANAGE}/:adId`, '编辑', urls.OPERATE_ADVERTISE_MANAGE),
  adRouteGen(urls.OPERATE_ADVERTISE_CLASSFIY, '广告位管理', urls.OPERATE_ADVERTISE_MANAGE),

  homeRouteGen(urls.OPERATE_HOME_MANAGE, '首页推荐'),
  homeRouteGen(urls.OPERATE_HOME_MANAGE_ADD + '/:channelId', '创建', urls.OPERATE_HOME_MANAGE),
  homeRouteGen(`${urls.OPERATE_HOME_MANAGE_EDIT}/:channelId`, '修改', urls.OPERATE_HOME_MANAGE),
  homeRouteGen(`${urls.OPERATE_HOME_MANAGE_INFO}/:channelId`, '预览', urls.OPERATE_HOME_MANAGE),

  vedioRecoRouteGen(urls.OPERATE_VEDIO_RECO_MANAGE, '影视推荐'),
  vedioRecoRouteGen(urls.OPERATE_VEDIO_RECO_ADD + '/:channelId', '创建', urls.OPERATE_VEDIO_RECO_MANAGE),
  vedioRecoRouteGen(`${urls.OPERATE_VEDIO_RECO_INFO}/:channelId`, '预览', urls.OPERATE_VEDIO_RECO_MANAGE),

  gameRouteGen(urls.OPERATE_GAME_CENTER, '游戏中心'),
  // genRoute(urls.OPERATE_GAME_CLASSFIY, '分类管理', urls.OPERATE_GAME_CENTER),
  orderRouteGen(urls.OPERATE_ORDER, '订单中心'),
  serviceRouteGen(urls.OPERATE_SERVICE_CENTER, '生活服务中心'),
  // genRoute(urls.OPERATE_SERVICE_CLASSFIY, '分类管理', urls.OPERATE_SERVICE_CENTER),
  userRouteGen(urls.OPERATE_USER_CENTER, '用户中心'),
  userRouteGen(`${urls.OPERATE_USER_COLLECT}/:userId`, '收藏信息', urls.OPERATE_USER_CENTER),
  userRouteGen(`${urls.OPERATE_USER_MAC}/:userId`, 'Mac地址', urls.OPERATE_USER_CENTER),
  userRouteGen(`${urls.OPERATE_USER_ACCOUNT}/:userId`, '账户信息', urls.OPERATE_USER_CENTER),

  channelRouteGen(urls.OPERATE_CHANNEL_CATE, '频道管理'),
  channelRouteGen(`${urls.OPERATE_CHANNEL_LIST}/:cateId`, '子频道', urls.OPERATE_CHANNEL_CATE),
  channelRouteGen(`${urls.OPERATE_CHANNEL_RESOURCE}/:channelId`, '资源', urls.OPERATE_CHANNEL_CATE),

  channelRouteGen(urls.OPERATE_VEDIO_CATE, '影视分类管理'),
  channelRouteGen(`${urls.OPERATE_VEDIO_CHILD_CATE}/:cateId`, '子分类', urls.OPERATE_VEDIO_CATE),
  channelRouteGen(`${urls.OPERATE_VEDIO_RESOURCE}/:cateId`, '资源', urls.OPERATE_VEDIO_CATE),
  channelRouteGen(`${urls.OPERATE_VEDIO_TAG}/:cateId`, '标签', urls.OPERATE_VEDIO_CATE),

  lookRouteGen(urls.OPERATE_LOOK_LOOP, '看了又看'),

  AppRouteGen(urls.OPERATE_APP_CENTER, '应用中心'),
  AppRouteGen(urls.OPERATE_APP_CENTER_ADD, '新增', urls.OPERATE_APP_CENTER),
  channelRouteGen(`${urls.OPERATE_APP_CENTER_EDIT}/:appId`, '修改', urls.OPERATE_APP_CENTER),
  channelRouteGen(`${urls.OPERATE_APP_CENTER_UPDATE}/:appId`, '更新', urls.OPERATE_APP_CENTER),
]
