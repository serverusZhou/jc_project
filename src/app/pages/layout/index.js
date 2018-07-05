import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Layout, Icon, Spin, Button, Dropdown, Menu, Form, Input } from 'antd'
import {
  Link,
  Route
} from 'react-router-dom'
import { push, goBack } from 'react-router-redux'

import MyBreadcrumb from './Breadcrumb/index'
import AppMenu from './menu'
import { showModalWrapper } from 'Components/modal/ModalWrapper'
import styles from './style.less'
import { connect } from 'react-redux'
import { userLogout, modifyPassword } from 'Global/action'
import storage from 'Utils/storage.js'

const { Content, Sider, Header } = Layout
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
}

class MainLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      confirmDirty: false,
    }
  }

  componentDidMount() {
    // to init something for whole project
  }

  // 设置是否可收起
  _toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  // 拓展时用
  _selectMenu = () => {
    let pathName = this.props.match.location.pathname
    let menuName = this.getMenuName(pathName)
    switch (menuName) {
      case 'App':
        return (
          <AppMenu
            match={this.props.match}
            selectedMenu={this.props.selectedMenu}
            mode={this.state.collapsed}
          />
        )
      default:
        return (
          <AppMenu
            match={this.props.match}
            selectedMenu={this.props.selectedMenu}
            mode={this.state.collapsed}
          />
        )
    }
  }

  getMenuName = (pathName) => {
    if (!pathName || pathName === '/') return ''
    let reg = new RegExp(/\/(\b\w*\b)/)
    let matchName = pathName.match(reg)[1]
    let name = matchName.split('')
    name = name[0].toUpperCase() + name.slice(1).join('')
    return name
  }

  _logout = () => {
    this.props.dispatch(userLogout())
  }

  checkPassword = (rule, value, callback, form) => {
    if (value.length >= form.getFieldValue('newPassword').length) {
      if (value && value !== form.getFieldValue('newPassword')) {
        callback('两次密码不一致')
      } else {
        callback()
      }
    } else {
      callback()
    }
  }

  checkConfirm = (rule, value, callback, form) => {
    if (value && this.state.confirmDirty) {
      form.validateFields(['passwordConfirm'], { force: true })
    }
    callback()
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  handleSubmit = (form, onCancel) => {
    form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch(modifyPassword(
          { userName: values.userName, origPwd: values.password, userPwd: values.newPassword, confirmPwd: values.passwordConfirm }
        )).then(res => {
          if (res) {
            this.setState({ confirmDirty: false }, () => {
              onCancel()
            })
          }
        })
      }
    })
  }

  _modifyPasswordForm = (props) => {
    const { getFieldDecorator } = props.form
    return (
      <Form className='login-form'>
        <FormItem
          {...formItemLayout}
          label='账户'
        >
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入你的账户' }],
            initialValue: storage.get('userInfo').userName
          })(
            <Input placeholder='请输入账户' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='密码'
        >
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入你的密码' }],
          })(
            <Input type='password' placeholder='请输入密码' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='新密码'
        >
          {getFieldDecorator('newPassword', {
            rules: [{
              required: true, message: '请输入你的新密码',
            }, {
              validator: (rule, value, callback) => this.checkConfirm(rule, value, callback, props.form),
            }],
          })(
            <Input type='password' placeholder='请输入新密码' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='确认密码'
        >
          {getFieldDecorator('passwordConfirm', {
            rules: [{
              required: true, message: '请确认新密码',
            }, {
              validator: (rule, value, callback) => this.checkPassword(rule, value, callback, props.form),
            }],
          })(
            <Input type='password' onBlur={this.handleConfirmBlur} placeholder='请再次输入新密码' />
          )}
        </FormItem>
        <FormItem className={styles['operate-modal-btn']}>
          <Button
            onClick={() => {
              this.setState({ confirmDirty: false }, () => {
                props.onCancel()
              })
            }}
          >
            取消
          </Button>
          <Button
            type='primary'
            htmlType='submit'
            onClick={() => this.handleSubmit(props.form, props.onCancel)}
          >
            确认
          </Button>
        </FormItem>
      </Form>
    )
  }

  _modifyPassword = () => {
    const ModifyPasswordForm = Form.create()(this._modifyPasswordForm)
    showModalWrapper((
      <ModifyPasswordForm />
    ), {
      title: '修改密码'
    })
  }

  _onHeaderMenuClick = ({ key }) => {
    if (key === 'logout') {
      this._logout()
    } else if (key === 'modifyPassword') {
      this._modifyPassword()
    }
  }

  render() {
    let { content: MainContent, routes } = this.props

    const { showSpin, routeActions, showSpinBool, showSpinTip } = this.props
    const userInfo = storage.get('userInfo') || {}
    const menu = (
      <Menu
        className={styles.menu}
        selectedKeys={[]}
        onClick={this._onHeaderMenuClick}
      >
        {/* // tv一期没有修改密码功能 暂时注释 */}
        {/* <Menu.Item key='modifyPassword'><Icon type='key' />修改密码</Menu.Item>
        <Menu.Divider /> */}
        <Menu.Item key='logout'><Icon type='logout' />退出登录</Menu.Item>
      </Menu>
    )
    return (
      <Layout className={styles.layout}>
        <Sider
          className={styles.sidebar}
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          breakpoint='lg'
          width={256}
        // style={{ background: '#ffffff' }}
        >
          <div className={styles.logo}>
            <Link to='/'>
              <span className={styles.title}>金诚TV</span>
            </Link>
          </div>
          <div className={styles.menu}>
            {this._selectMenu()}
          </div>
        </Sider>
        <Layout>
          <Header className={styles.header} style={{ background: '#ffffff' }}>
            <div
              className={styles.header_button}
              onClick={this._toggle}
            >
              <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
            </div>
            <div className={styles.right_warpper}>
              <span className={styles['name']}>
                <Dropdown overlay={menu}>
                  <span className={`${styles.action} ${styles.account}`}>
                    <Icon type='user' style={{ fontSize: 30 }} />
                  </span>
                </Dropdown>
                <span>欢迎您，{userInfo.adminName}</span>
              </span>
            </div>
          </Header>
          <div style={{ padding: '0 24px 24px' }}>
            <Route
              render={({ location, match }) => (
                <MyBreadcrumb
                  location={location}
                  match={match}
                  routes={routes}
                />
              )}
            />
            <Spin tip={(showSpin && showSpin.bool) ? showSpin.content : showSpinTip} spinning={((showSpin && showSpin.bool) || showSpinBool)}>
              <Content style={{ background: '#ffffff', margin: 0, minHeight: 280 }}>
                <MainContent {...this.props} routeActions={routeActions} />
              </Content>
            </Spin>
          </div>
        </Layout>
        {
          /* tip == 如果是商城的拿showSpinTip，否则拿showSpin.content */
          // ((showSpin && showSpin.bool) || showSpinBool) ? (
          //   <div className={styles.cover}>
          //     <Spin
          //       tip={(showSpin && showSpin.bool) ? showSpin.content : showSpinTip}
          //       style={{ marginTop: 160 }}
          //     >
          //       <Content style={{ minHeight: 600 }}>
          //         <MainContent {...this.props} />
          //       </Content>
          //     </Spin>
          //   </div>
          // ) : null
        }
      </Layout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showSpin: state.common.showSpin,
    userInfo: state.common.userLogin,
    showSpinTip: state.globalReduck.showSpinTip, // 商城
    showSpinBool: state.globalReduck.showSpinBool// 商城
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  routeActions: bindActionCreators({
    push,
    goBack,
    // showLogin,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout)

