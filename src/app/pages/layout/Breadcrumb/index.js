import { Breadcrumb, Icon } from 'antd'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// import React from 'react'
import style from './style.less'
// import createBreadcrunb from './Breadcrumbs'

class MyBreadcrumb extends Component {
  constructor(props) {
    super(props)
    this.state = {
      breadcrumbItems: []
    }
    this.goBack = this.goBack.bind(this)
  }
  componentWillMount() {
    let path = this.props.match.path
    this._createBreadcrumbItems(path)
  }
  componentWillReceiveProps(nextProps) {
    let path = nextProps.match.path
    let routes = nextProps.routes
    this._createBreadcrumbItems(path, routes)
  }

  _resolvePath(path, resolveRoutes, routes = this.props.routes) {
    let route = routes.find(route => {
      return route.path === path
    })
    let parentPath = route.parentPath
    resolveRoutes.unshift(route)
    if (parentPath) {
      return this._resolvePath(parentPath, resolveRoutes)
    }
    return resolveRoutes
  }

  _createBreadcrumbItems(path, routes) {
    let resolveRoutes = []
    resolveRoutes = this._resolvePath(path, resolveRoutes, routes)
    let breadcrumbItems = resolveRoutes.map((resolveRoute, index, routes) => {
      return this._createBreadcrumbItem(resolveRoute, index, routes)
    })
    this.setState({
      breadcrumbItems
    })
  }

  _replacePath(path, url) {
    // const startPosition = path.indexOf(':')
    // const str = url.slice(startPosition + 1)
    // const endPosition = str.indexOf('/') + startPosition;
    let pathArr = path.split('/')
    let urlArr = url.split('/')
    let newPath = pathArr.map((pathStr, index) => {
      return urlArr[index]
    }).join('/')
    return newPath
  }

  _createBreadcrumbItem(route, index, routes) {
    let breadcrumbName = route.breadcrumbName
    if (!breadcrumbName) {
      breadcrumbName = '11'
      let params = this.props.match.params
      for (let i in params) {
        if (params[i]) {
          breadcrumbName = params[i]
        }
      }
    }

    if (index === 0) {
      return (
        <Breadcrumb.Item key={route.path}>
          <Link to={route.path}>
            <Icon type='home' style={{ fontSize: 14 }} /><span style={{ marginLeft: '6px' }}>{breadcrumbName}</span>
          </Link>
        </Breadcrumb.Item>
      )
    }

    const isLast = index === routes.length - 1
    const fontWeight = isLast ? 'bold' : 'normal'

    if ((/:/).test(route.path)) {
      let path = this._replacePath(route.path, this.props.match.url)
      return (
        <Breadcrumb.Item
          key={route.path}
          className={'breadcrumb-placeholder'}
        >
          {
            isLast ? <span style={{ fontWeight }}>{breadcrumbName}</span>
              : <Link to={path}><span style={{ fontWeight }}>{breadcrumbName}</span></Link>
          }
        </Breadcrumb.Item>
      )
    }
    return (
      <Breadcrumb.Item key={route.path}>
        {
          isLast ? <span style={{ fontWeight }}>{breadcrumbName}</span>
            : <Link to={route.path}><span style={{ fontWeight }}>{breadcrumbName}</span></Link>
        }
      </Breadcrumb.Item>
    )
  }

  goBack() {
    this.props.match.history.go(-1)
  }

  render() {
    return (
      <Breadcrumb className={style.bread} separator={<Icon type='caret-right' />}>
        {/* <Breadcrumb.Item><a onClick={this.goBack}>返回上一页</a></Breadcrumb.Item>*/}
        {this.state.breadcrumbItems}
      </Breadcrumb>
    )
  }
}

export default MyBreadcrumb
