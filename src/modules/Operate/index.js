import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as urls from 'Global/urls'
import Advertise from './advertise'
import Add from './advertise/add'
import AdvertiseClassify from './advertise/classify'
import HomeReco from './homeReco'
import FormDetail from './homeReco/formDetail'
import Game from './game'
// import GameClassify from './game/classify'
import Order from './order'
import Service from './service'
// import ServiceClassify from './service/classify'
import User from './user'
import UserCollect from './user/collect'
import UserMac from './user/mac'
import AccountInfo from './user/accountInfo'
import Channel from './channel'
import ChannelChild from './channel/channelChild'
import Resource from './channel/resource'

import VedioCate from './vedio'
import VedioCateChild from './vedio/child'
import VedioResource from './vedio/resource'
import VedioTag from './vedio/tag'

import LookLoop from './lookLoop'

import Application from './application'
import modifyApp from './application/modify'
import updateApp from './application/update'

class BaseModule extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from={urls.OPERATE} to={urls.OPERATE_ADVERTISE_MANAGE} />
        <Route exact path={urls.OPERATE_ADVERTISE_MANAGE} component={Advertise} />
        <Route exact path={urls.OPERATE_ADVERTISE_MANAGE_ADD} component={Add} />
        <Route exact path={urls.OPERATE_ADVERTISE_MANAGE_EDIT} component={Add} />
        <Route exact path={urls.OPERATE_ADVERTISE_CLASSFIY} component={AdvertiseClassify} />
        <Route exact path={urls.OPERATE_HOME_MANAGE} component={HomeReco} />
        <Route exact path={urls.OPERATE_HOME_MANAGE_ADD + '/:channelId'} component={FormDetail} />
        <Route exact path={urls.OPERATE_HOME_MANAGE_INFO + '/:channelId'} component={FormDetail} />
        <Route exact path={`${urls.OPERATE_HOME_MANAGE_EDIT}`} component={FormDetail} />

        <Route exact path={urls.OPERATE_VEDIO_RECO_MANAGE} component={HomeReco} />
        <Route exact path={urls.OPERATE_VEDIO_RECO_ADD + '/:channelId'} component={FormDetail} />
        <Route exact path={`${urls.OPERATE_VEDIO_RECO_INFO}/:channelId`} component={FormDetail} />

        <Route exact path={urls.OPERATE_GAME_CENTER} component={Game} />
        {/* <Route exact path={urls.OPERATE_GAME_CLASSFIY} component={GameClassify} /> */}
        <Route exact path={urls.OPERATE_ORDER} component={Order} />
        <Route exact path={urls.OPERATE_SERVICE_CENTER} component={Service} />
        {/* <Route exact path={urls.OPERATE_SERVICE_CLASSFIY} component={ServiceClassify} /> */}
        <Route exact path={urls.OPERATE_USER_CENTER} component={User} />
        <Route exact path={urls.OPERATE_USER_COLLECT + '/:userId'} component={UserCollect} />
        <Route exact path={urls.OPERATE_USER_MAC + '/:userId'} component={UserMac} />
        <Route exact path={urls.OPERATE_USER_ACCOUNT + '/:userId'} component={AccountInfo} />

        <Route exact path={urls.OPERATE_CHANNEL_CATE} component={Channel} />
        <Route exact path={`${urls.OPERATE_CHANNEL_LIST}/:cateId`} component={ChannelChild} />
        <Route exact path={`${urls.OPERATE_CHANNEL_RESOURCE}/:channelId`} component={Resource} />

        <Route exact path={urls.OPERATE_VEDIO_CATE} component={VedioCate} />
        <Route exact path={`${urls.OPERATE_VEDIO_CHILD_CATE}/:cateId`} component={VedioCateChild} />
        <Route exact path={`${urls.OPERATE_VEDIO_RESOURCE}/:cateId`} component={VedioResource} />
        <Route exact path={`${urls.OPERATE_VEDIO_TAG}/:cateId`} component={VedioTag} />

        <Route exact path={urls.OPERATE_LOOK_LOOP} component={LookLoop} />

        <Route exact path={urls.OPERATE_APP_CENTER} component={Application} />
        <Route exact path={urls.OPERATE_APP_CENTER_ADD} component={modifyApp} />
        <Route exact path={`${urls.OPERATE_APP_CENTER_EDIT}/:appId`} component={modifyApp} />
        <Route exact path={`${urls.OPERATE_APP_CENTER_UPDATE}/:appId`} component={updateApp} />
      </Switch>
    )
  }
}
export default BaseModule
