import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as urls from 'Global/urls'
import Actor from './actor'
import ActorAdd from './actor/add'
import ActorDetail from './actor/detail'
import AdvertiseAudit from './audit/advertise'
import AdvertiseAuditDetail from './audit/advertise/advertiseDetail'  //  广告审核详情页面
import InterphaseAudit from './audit/interphase'
import InterphaseAuditDetail from './audit/interphase/interphaseDetail' //  界面审核详情页面
import MediaAudit from './audit/media'
// import MediaAuditDetail from './audit/media/mediaDetail'  // 媒资审核详情页面
import ChannelCateAudit from './audit/live/cate' // 直播频道分类审核
import ChannelCateAuditDetail from './audit/live/cate/detail' // 直播频道分类详情
import ChannelAudit from './audit/live/channel' // 直播频道审核
import ChannelAuditDetail from './audit/live/channel/detail' // 直播频道详情
import OperationAudit from './audit/operate' // 直播频道审核
import OperationAuditDetail from './audit/operate/detail' // 直播频道详情
import AdvertisePositionAudit from './audit/position'
import AdvertisePositionAuditDetail from './audit/position/detail'  //  广告审核详情页面
import Auths from './auths'
import AuthsDetail from './auths/detail'
import Role from './role'
import RoleDetail from './role/detail'
import Classify from './classify'
// import Template from './classify/template'
import Media from './resource/third/add'
import License from './resource/license'
import LicenseDetail from './resource/license/detail'
import Third from './resource/third'
import ThirdDetail from './resource/third/detail'
import MediaVideo from './resource/third/video'

// 有象审核
import OttMediaAudit from './audit/ottMedia/index'
import OttMediaDetailAudit from './audit/ottMedia/detail'

// 有象频道审核
import OttChannelAudit from './audit/ottChannel/index'
import OttChannelDetailAudit from './audit/ottChannel/detail'

// 有象分类审核
import OttCategoryAudit from './audit/ottCategory/index'
import OttCategoryDetailAudit from './audit/ottCategory/detail'

// 应用审核

import Apply from './audit/apply'
import Audited from './audit/apply/auditedDetail'
import UnAudited from './audit/apply/unAuditedDetail'

// 运营图审核

import OperatePic from './audit/operatepic'
import UnAuditedOperatePic from './audit/operatepic/unAuditedDetail'
import AuditedOperatePic from './audit/operatepic/auditedDetail'

class BaseModule extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from={urls.RESOURCE} to={urls.RESOURCE_MEDIA_THIRD} />
        <Route exact path={urls.RESOURCE_ACTOR} component={Actor} />
        <Route exact path={`${urls.RESOURCE_ACTOR_ADD}`} component={ActorAdd} />
        <Route exact path={`${urls.RESOURCE_ACTOR_EDIT}/:actorId`} component={ActorAdd} />
        <Route exact path={`${urls.RESOURCE_ACTOR_DETAIL}/:actorId`} component={ActorDetail} />
        <Route exact path={urls.RESOURCE_AUDIT_ADVERTISE} component={AdvertiseAudit} />
        <Route exact path={`${urls.RESOURCE_AUDIT_ADVERTISE_DETAIL}/:id`} component={AdvertiseAuditDetail} />
        <Route exact path={urls.RESOURCE_AUDIT_INTERPHASE} component={InterphaseAudit} />
        <Route exact path={`${urls.RESOURCE_AUDIT_INTERPHASE_DETAIL}/:id`} component={InterphaseAuditDetail} />
        <Route exact path={urls.RESOURCE_AUDIT_MEDIA} component={MediaAudit} />
        <Route exact path={`${urls.RESOURCE_AUDIT_MEDIA_DETAIL}/:id`} component={ThirdDetail} />
        <Route exact path={urls.RESOURCE_AUDIT_LIVE_CATE} component={ChannelCateAudit} />
        <Route exact path={`${urls.RESOURCE_AUDIT_LIVE_CATE_DETAIL}/:id`} component={ChannelCateAuditDetail} />
        <Route exact path={urls.RESOURCE_AUDIT_LIVE_CHANNEL} component={ChannelAudit} />
        <Route exact path={`${urls.RESOURCE_AUDIT_LIVE_CHANNEL_DETAIL}/:id`} component={ChannelAuditDetail} />
        <Route exact path={urls.RESOURCE_AUDIT_OPERATION} component={OperationAudit} />
        <Route exact path={`${urls.RESOURCE_AUDIT_OPERATION_DETAIL}/:id`} component={OperationAuditDetail} />
        <Route exact path={urls.RESOURCE_AUDIT_ADVERTISE_POSITION} component={AdvertisePositionAudit} />
        <Route exact path={`${urls.RESOURCE_AUDIT_ADVERTISE_POSITION_DETAIL}/:id`} component={AdvertisePositionAuditDetail} />

        <Route exact path={urls.RESOURCE_AUTHS} component={Auths} />
        <Route exact path={`${urls.RESOURCE_AUTHS_DETAIL}/:id`} component={AuthsDetail} />
        <Route exact path={urls.RESOURCE_ROLE} component={Role} />
        <Route exact path={`${urls.RESOURCE_ROLE_DETAIL}/:id`} component={RoleDetail} />
        <Route exact path={urls.RESOURCE_CLASSIFY_MANAGE} component={Classify} />
        {/* <Route exact path={urls.RESOURCE_CLASSIFY_TEMPLATE} component={Template} /> */}
        <Route exact path={urls.RESOURCE_MEDIA_ADD} component={Media} />
        <Route exact path={`${urls.RESOURCE_MEDIA_EDIT}/:episodeId`} component={Media} />
        <Route exact path={urls.RESOURCE_MEDIA_LICENSE} component={License} />
        <Route exact path={`${urls.RESOURCE_MEDIA_LICENSE_DETAIL}/:id`} component={LicenseDetail} />
        <Route exact path={urls.RESOURCE_MEDIA_THIRD} component={Third} />
        <Route exact path={`${urls.RESOURCE_MEDIA_DETAIL}/:id`} component={ThirdDetail} />
        <Route exact path={`${urls.RESOURCE_AUDIT_VIDEO}/:data`} component={MediaVideo} />
        <Route exact path={`${urls.RESOURCE_MEDIA_VIDEO}/:data`} component={MediaVideo} />

        <Route exact path={urls.RESOURCE_AUDIT_APPLY} component={Apply} />
        <Route exact path={`${urls.RESOURCE_AUDIT_APPLY_AUDITEDDETAIL}/:id`} component={Audited} />
        <Route exact path={`${urls.RESOURCE_AUDIT_APPLY_UNAUDITEDDETAIL}/:id`} component={UnAudited} />

        <Route exact path={urls.RESOURCE_AUDIT_OPERATEPIC} component={OperatePic} />
        <Route exact path={`${urls.RESOURCE_AUDIT_OPERATEPIC_UNAUDITEDDETAIL}/:id`} component={UnAuditedOperatePic} />
        <Route exact path={`${urls.RESOURCE_AUDIT_OPERATEPIC_AUDITEDDETAIL}/:id`} component={AuditedOperatePic} />
        
        <Route exact path={urls.OTTRESOURCE_AUDIT_CHANNEL} component={OttChannelAudit} />
        <Route exact path={`${urls.OTTRESOURCE_AUDIT_CHANNEL_DETAIL}/:id`} component={OttChannelDetailAudit} />
        <Route exact path={urls.OTTRESOURCE_AUDIT_CATEGORY} component={OttCategoryAudit} />
        <Route exact path={`${urls.OTTRESOURCE_AUDIT_CATEGORY_DETAIL}/:id`} component={OttCategoryDetailAudit} />
        <Route exact path={urls.OTTRESOURCE_AUDIT_MEDIA} component={OttMediaAudit} />
        <Route exact path={`${urls.OTTRESOURCE_AUDIT_MEDIA_DETAIL}/:id`} component={OttMediaDetailAudit} />

      </Switch>
    )
  }
}
export default BaseModule
