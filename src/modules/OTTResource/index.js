import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as urls from '../../global/urls'
import OTTChannel from './channel'
import OTTChannelDetail from './channel/detail'
import OTTCategory from './category'
import OTTCategoryChild from './category/channelChild'
import OTTCategorySource from './category/resource'
import OTTMEDIA from './media'

class BaseModule extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from={urls.OTT_SEARCH} to={urls.OTT_CHANNEL} />
        <Route exact path={urls.OTT_CHANNEL} component={OTTChannel} />
        <Route exact path={urls.OTT_CHANNEL_EDIT} component={OTTChannelDetail} />
        <Route exact path={urls.OTT_CATGORY} component={OTTCategory} />
        <Route exact path={urls.OTT_CATGORY_CHILD} component={OTTCategoryChild} />
        <Route exact path={urls.OTT_CATGORY_RESOURCE} component={OTTCategorySource} />
        <Route exact path={urls.OTT_MEDIA} component={OTTMEDIA} />
      </Switch>
    )
  }
}
export default BaseModule
