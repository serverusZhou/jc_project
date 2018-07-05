import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import * as urls from 'Global/urls'
import storage from 'Utils/storage'
import { isEmpty } from 'Utils/lang'
import { routes, mallHomeRoutes } from '../routes'
import { getMenus } from 'Global/action'

import Layout from './pages/layout/index'
import Login from './pages/login'
import NotFoundPage from './pages/notFoundPage'
import { bundle } from './bundle'

class RouteConfig extends Component {
  constructor(props) {
    super(props)
    this.state = {
      acceptRoutes: []
    }
  }

  componentDidMount() {
    const userInfo = storage.get('userInfo')
    if (userInfo) {
      this.props.dispatch(getMenus())
    } else {
      if (location.pathname !== urls.LOGIN) {
        location.href = urls.LOGIN
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldAuths = this.props.auths
    const { auths } = nextProps
    if (isEmpty(oldAuths) && !isEmpty(auths)) {
      this.setState({
        acceptRoutes: auths
      })
    }
  }

  verifyUser = (match, route, finalRoutes) => {
    let userInfo = storage.get('userInfo')
    if (userInfo) {
      return (
        <Layout
          routes={finalRoutes}
          match={match}
          content={route.baseComponent ? bundle(route.baseComponent) : route.component}
          path={route.path}
        />
      )
    } else {
      return <Redirect to={urls.LOGIN} />
    }
  }
  verifyUserMall = (match, route) => {
    console.log('[...routes, ...mallHomeRoutes]', [...routes, ...mallHomeRoutes].length)
    return (
      <Layout
        routes={[...routes, ...mallHomeRoutes]}
        match={match}
        content={route.component}
        path={route.path}
      />
    )
  }
  render() {
    const { acceptRoutes } = this.state
    let userInfo = storage.get('userInfo')
    const finalRoutes = routes.filter(
      item => {
        return acceptRoutes.indexOf(item.authTag) !== -1 ||
          item.path === '/' ||
          (!isEmpty(userInfo) && userInfo.roleId === '0')
      }
    )
    return (
      <ConnectedRouter history={this.props.history}>
        <Switch>
          <Route key='login' path={urls.LOGIN} component={Login} />
          {
            finalRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                render={match => this.verifyUser(match, route, finalRoutes)}
              />
            ))
          }
          {/* 商城 */}
          {
            mallHomeRoutes instanceof Array && mallHomeRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                render={match => this.verifyUserMall(match, route)}
              />
            ))
          }
          <Route key='404' path='/404' component={NotFoundPage} />
          {!isEmpty(acceptRoutes) && <Redirect from='*' to='/404' />}
        </Switch>
      </ConnectedRouter>
    )
  }
}

const mapStateToProps = state => {
  return {
    auths: state.common.auths
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(RouteConfig)
