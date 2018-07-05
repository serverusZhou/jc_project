/**
 * Created by yiming on 2017/6/20.
 */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import * as urls from 'Global/urls'
import classNames from 'classnames'
import storage from 'Utils/storage'
import { connect } from 'react-redux'
import { isEmpty } from 'Utils/lang'

const SubMenu = Menu.SubMenu
const MenuItem = Menu.Item
class MamsMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 'inline',
      openKeys: storage.get('openKeys') || [],
      current: ''
    }
  }
  _handleMenuChange = (e) => {
    this.setState({ current: e.key })
  }
  // 获取根节点menuKey
  _getRootSubmenuKeys = () => {
    const { menuTreeList } = this.props
    console.log('menuTreeList', menuTreeList)
    const arr = []
    for (let menuTree of menuTreeList) {
      arr.push(menuTree.url)
    }
    return arr
  }
  onOpenChange = (openKeys) => {
    const rootSubmenuKeys = this._getRootSubmenuKeys()
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1)
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys }, () => {
        storage.set('openKeys', openKeys)
      })
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      }, () => {
        storage.set('openKeys', [latestOpenKey])
      })
    }
  }

  getMenuItemClass = (str) => {
    const pathName = this.props.match.location.pathname + this.props.match.location.search
    if (str !== urls.HOME) {
      return classNames({
        'ant-menu-item-selected': pathName.indexOf(str) > -1,
      })
    }
    return classNames({
      'ant-menu-item-selected': pathName === str,
    })
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      mode: nextProps.mode,
    })
  }
  _renderMenuItem = (menuTreeList, baseData) => {
    return menuTreeList.map(item => {
      // isOut 如果是外部链接如：tv电商不展示子导航
      if (item && !item.isOut && !isEmpty(item.children)) {
        return (
          <SubMenu
            key={item.url}
            title={<span><Icon type={item.icon} /><span>{item.name}</span></span>}
          >
            {this._renderMenuItem(item.children, item.children)}
          </SubMenu>
        )
      } else {
        return (
          <MenuItem
            key={item.url}
            className={this.getMenuItemClass(item.url)}
          >
            {
              item.isOut
                ? <a href={item.url} target='_blank'><Icon type={item.icon} /><span>{item.name}</span></a>
                : <Link to={item.url}>
                  <Icon type={item.icon} /><span>{item.name}</span>
                </Link>
            }

          </MenuItem>
        )
      }
    })
  }
  render() {
    const config = !this.props.mode ? { openKeys: this.state.openKeys } : {}
    return (
      <Menu
        mode='inline'
        selectedKeys={[this.props.selectedMenu]}
        style={{ border: 'none' }}
        theme='dark'
        {...config}
        onOpenChange={this.onOpenChange}
        onClick={this._handleMenuChange}
        inlineCollapsed={this.props.mode}
      >
        <MenuItem
          key='mams_home'
          className={this.getMenuItemClass(urls.HOME)}
        >
          <Link to={urls.HOME}><Icon type='home' /><span>首页</span></Link>
        </MenuItem>
        {this._renderMenuItem(isEmpty(this.props.menuTreeList) ? [] : this.props.menuTreeList)}
      </Menu>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    menuTreeList: state.common.menuTreeList,
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(MamsMenu)
