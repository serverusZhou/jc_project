import React, { PureComponent } from 'react'
import { Layout, Menu, Icon, Tag, Dropdown, Divider } from 'antd'
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import { Link } from 'react-router-dom'
import styles from './index.less'
import storage from 'Utils/storage'
import { daxiang } from 'Utils/config'

const { Header } = Layout

export default class GlobalHeader extends PureComponent {

  getNoticeData() {
    const { notices = [] } = this.props
    if (notices.length === 0) {
      return {}
    }
    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice }
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow()
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id
      }
      if (newNotice.extra && newNotice.status) {
        const color = ({
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        })[newNotice.status]
        newNotice.extra = (
          <Tag
            color={color}
            style={{ marginRight: 0 }}
          >
            {newNotice.extra}
          </Tag>
        )
      }
      return newNotice
    })
    return groupBy(newNotices, 'type')
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props
    onCollapse(!collapsed)
    this.triggerResizeEvent()
  }

  triggerResizeEvent = () => { // eslint-disable-line
    const event = document.createEvent('HTMLEvents')
    event.initEvent('resize', true, false)
    window.dispatchEvent(event)
  }

  onMenuClick = ({ key }) => {
    if (key === 'logout') {
      storage.clear()
      location.href = daxiang
    }
  }

  /*eslint-disable */
  render() {
    const {
      currentUser, collapsed, fetchingNotices, isMobile, logo,
      onNoticeVisibleChange, onNoticeClear,
    } = this.props
    const menu = (
      <Menu
        className={styles.menu}
        selectedKeys={[]}
        onClick={this.onMenuClick}
      >
        <Menu.Item disabled><Icon type='user' />个人中心</Menu.Item>
        <Menu.Item disabled><Icon type='setting' />设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key='logout'><Icon type='logout' />退出登录</Menu.Item>
      </Menu>
    )
    return (
      <Header className={styles.header}>
        {isMobile && (
          [
            (
              <Link
                to='/'
                className={styles.logo}
                key='logo'
               >
                <img
                  src={logo}
                  alt='logo'
                  width='32'
                />
              </Link>
            ),
            <Divider
              type='vertical'
              key='line'
            />,
          ]
        )}
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={styles.right}>
          {
            currentUser && currentUser.adminName && (
              <Dropdown overlay={menu}>
                <span className={`${styles.action} ${styles.account}`}>
                  <Icon style={{ margin: 10 }} type="user" />
                  <span className={styles.name}>{currentUser.adminName}</span>
                </span>
              </Dropdown>
            )
          }
        </div>
      </Header>
    )
  }
}
