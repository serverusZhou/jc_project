import * as urls from 'Global/urls'
import { RouteHelper } from 'Utils/helper'
import ResourceModule from 'bundle-loader?lazy!../Resource'

const genRoute = authTag =>
  (path, breadcrumbName, parentPath = urls.HOME) =>
  RouteHelper.genRoute(path, breadcrumbName, ResourceModule, parentPath, authTag)

const mediaRouteGen = genRoute(urls.RESOURCE_MEDIA)
const mediaAddRouteGen = genRoute(urls.RESOURCE_MEDIA_ADD)
const classifyRouteGen = genRoute(urls.RESOURCE_CLASSIFY)
const actorRouteGen = genRoute(urls.RESOURCE_ACTOR)
const auditRouteGen = genRoute(urls.RESOURCE_AUDIT)
const authsRouteGen = genRoute(urls.RESOURCE_AUTHS)
const roleRouteGen = genRoute(urls.RESOURCE_ROLE)

export default [
  mediaAddRouteGen(urls.RESOURCE_MEDIA_ADD, '介质管理'),
  mediaRouteGen(`${urls.RESOURCE_MEDIA_EDIT}/:episodeId`, '编辑介质', urls.RESOURCE_MEDIA_THIRD),
  mediaRouteGen(urls.RESOURCE_MEDIA_LICENSE, '牌照方媒资管理'),
  mediaRouteGen(`${urls.RESOURCE_MEDIA_LICENSE_DETAIL}/:id`, '媒资详页', urls.RESOURCE_MEDIA_LICENSE),
  mediaRouteGen(urls.RESOURCE_MEDIA_THIRD, '三方媒资管理'),
  mediaRouteGen(`${urls.RESOURCE_MEDIA_DETAIL}/:id`, '媒资详页', urls.RESOURCE_MEDIA_THIRD),
  mediaRouteGen(`${urls.RESOURCE_MEDIA_VIDEO}/:data`, '视频播放', urls.RESOURCE_MEDIA_THIRD),
  classifyRouteGen(urls.RESOURCE_CLASSIFY_MANAGE, '全部分类'),
  // genRoute(urls.RESOURCE_CLASSIFY_TEMPLATE, '字段模版'),
  actorRouteGen(urls.RESOURCE_ACTOR, '演员管理'),
  actorRouteGen(urls.RESOURCE_ACTOR_ADD, '添加演员'),
  actorRouteGen(`${urls.RESOURCE_ACTOR_EDIT}/:id`, '编辑演员'),
  actorRouteGen(`${urls.RESOURCE_ACTOR_DETAIL}/:id`, '查看演员'),
  auditRouteGen(urls.RESOURCE_AUDIT_MEDIA, '媒资审核'),
  auditRouteGen(`${urls.RESOURCE_AUDIT_MEDIA_DETAIL}/:id`, '媒资详情', urls.RESOURCE_AUDIT_MEDIA),
  auditRouteGen(`${urls.RESOURCE_AUDIT_VIDEO}/:data`, '视频审核', urls.RESOURCE_AUDIT_MEDIA),
  auditRouteGen(urls.RESOURCE_AUDIT_INTERPHASE, '界面审核'),
  auditRouteGen(`${urls.RESOURCE_AUDIT_INTERPHASE_DETAIL}/:id`, '审核详页', urls.RESOURCE_AUDIT_INTERPHASE),
  auditRouteGen(urls.RESOURCE_AUDIT_ADVERTISE, '广告推荐审核'),
  auditRouteGen(`${urls.RESOURCE_AUDIT_ADVERTISE_DETAIL}/:id`, '审核详页', urls.RESOURCE_AUDIT_ADVERTISE),
  auditRouteGen(urls.RESOURCE_AUDIT_LIVE_CATE, '直播频道分类审核'),
  auditRouteGen(`${urls.RESOURCE_AUDIT_LIVE_CATE_DETAIL}/:id`, '审核详页', urls.RESOURCE_AUDIT_LIVE_CATE),
  auditRouteGen(urls.RESOURCE_AUDIT_LIVE_CHANNEL, '直播频道审核'),
  auditRouteGen(`${urls.RESOURCE_AUDIT_LIVE_CHANNEL_DETAIL}/:id`, '审核详页', urls.RESOURCE_AUDIT_LIVE_CHANNEL),
  auditRouteGen(urls.RESOURCE_AUDIT_OPERATION, '影视分类审核'),
  auditRouteGen(`${urls.RESOURCE_AUDIT_OPERATION_DETAIL}/:id`, '审核详页', urls.RESOURCE_AUDIT_OPERATION),
  auditRouteGen(urls.RESOURCE_AUDIT_ADVERTISE_POSITION, '广告位审核'),
  auditRouteGen(`${urls.RESOURCE_AUDIT_ADVERTISE_POSITION_DETAIL}/:id`, '审核详页', urls.RESOURCE_AUDIT_ADVERTISE_POSITION),
  authsRouteGen(urls.RESOURCE_AUTHS, '权限管理'),
  auditRouteGen(`${urls.RESOURCE_AUTHS_DETAIL}/:id`, '查看管理员', urls.RESOURCE_AUTHS),
  roleRouteGen(urls.RESOURCE_ROLE, '角色管理'),
  auditRouteGen(`${urls.RESOURCE_ROLE_DETAIL}/:id`, '查看角色', urls.RESOURCE_ROLE),
  auditRouteGen(urls.RESOURCE_AUDIT_APPLY, '应用审核'), // 应用审核
  auditRouteGen(`${urls.RESOURCE_AUDIT_APPLY_AUDITEDDETAIL}/:id`, '审核详页', urls.RESOURCE_AUDIT_APPLY),
  auditRouteGen(`${urls.RESOURCE_AUDIT_APPLY_UNAUDITEDDETAIL}/:id`, '审核详页', urls.RESOURCE_AUDIT_APPLY),
  auditRouteGen(urls.RESOURCE_AUDIT_OPERATEPIC, '运营图审核'), //  运营图审核
  auditRouteGen(`${urls.RESOURCE_AUDIT_OPERATEPIC_UNAUDITEDDETAIL}/:id`, '审核详页', urls.RESOURCE_AUDIT_OPERATEPIC),
  auditRouteGen(`${urls.RESOURCE_AUDIT_OPERATEPIC_AUDITEDDETAIL}/:id`, '审核详页', urls.RESOURCE_AUDIT_OPERATEPIC),

  auditRouteGen(urls.OTTRESOURCE_AUDIT_CHANNEL, '频道审核'),
  auditRouteGen(`${urls.OTTRESOURCE_AUDIT_CHANNEL_DETAIL}/:id`, '频道审核', urls.OTTRESOURCE_AUDIT_CHANNEL),
  auditRouteGen(urls.OTTRESOURCE_AUDIT_CATEGORY, '分类审核'),
  auditRouteGen(`${urls.OTTRESOURCE_AUDIT_CATEGORY_DETAIL}/:id`, '分类配置', urls.OTTRESOURCE_AUDIT_CATEGORY),
  auditRouteGen(urls.OTTRESOURCE_AUDIT_MEDIA, 'OTT单项配置'),
  auditRouteGen(`${urls.OTTRESOURCE_AUDIT_MEDIA_DETAIL}/:id`, '审核详页', urls.OTTRESOURCE_AUDIT_MEDIA),

]
