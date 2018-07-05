import * as urls from 'Global/urls'
import { RouteHelper } from 'Utils/helper'
import ResourceModule from 'bundle-loader?lazy!../OTTResource'

const genRoute = authTag =>
  (path, breadcrumbName, parentPath = urls.HOME) =>
  RouteHelper.genRoute(path, breadcrumbName, ResourceModule, parentPath, authTag)

const oTTChannelRouteGen = genRoute(urls.OTT_CHANNEL)
const oTTCatgoryGen = genRoute(urls.OTT_CATGORY)
const oTTLiveGen = genRoute(urls.OTT_MEDIA)

export default [
  oTTChannelRouteGen(urls.OTT_CHANNEL, '频道配置'),
  oTTChannelRouteGen(`${urls.OTT_CHANNEL}/edit/:id`, '频道编辑', urls.OTT_CHANNEL),
  oTTCatgoryGen(urls.OTT_CATGORY, '影视分类'),
  oTTCatgoryGen(`${urls.OTT_CATGORY}/list/:icateId`, '影视子分类', urls.OTT_CATGORY),
  oTTCatgoryGen(urls.OTT_CATGORY_RESOURCE, '资源', urls.OTT_CATGORY),
  oTTLiveGen(urls.OTT_MEDIA, 'OTT单项配置'),
]
