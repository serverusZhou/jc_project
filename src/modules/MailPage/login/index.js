import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Button, message, Checkbox } from 'antd'
import loginName from 'Assets/images_mall/login/user.png'
import passWord from 'Assets/images_mall/login/password.png'
import logo from 'Assets/images_mall/login/logo.png'

import './index.css'
import { userLoginAct } from './reduck'
import storage from 'Utils/storage'

class Login extends Component {
  state = {
    email: '',
    password: ''
  }

  componentWillMount() {
    const userInfo = storage.get('user')
    if (userInfo && userInfo.accessToken) {
      this.props.history.replace('/')
    }
  }

  componentWillReceiveProps(next) {
    let userInfo = next.userInfo
    if (userInfo.accessToken) {
      storage.set('user', userInfo)
      this.props.history.replace('/')
      location.reload()
    }
  }

  getEmail = e => {
    this.setState({ email: e.target.value })
  }

  getPwd = e => {
    this.setState({ password: e.target.value })
  }

  login = () => {
    let email = this.state.email
    let password = this.state.password
    if (email === '') {
      message.error('请输入账号')
      return
    }

    if (password === '') {
      message.error('请输入密码')
      return
    }

    this.props.dispatch(
      userLoginAct({
        name: email,
        password: password,
        assessToken: ''
      })
    )
  }

  render() {
    return (
      <div className='wrap'>
        <div className='user-login-wrap'>
          <img
            className='logo'
            src={logo}
          />
          <div className='title'>管理系统</div>
          <div className='input-row'>
            <div className='icon'>
              <img src={loginName} />
            </div>
            <Input
              type='text'
              className='input'
              placeholder='请输入Email账号前缀'
              onChange={this.getEmail}
            />
          </div>
          <div className='input-row'>
            <div className='icon'>
              <img src={passWord} />
            </div>
            <Input
              type='password'
              className='input'
              placeholder='请输入密码'
              onChange={this.getPwd}
            />
          </div>
          <Checkbox className='rember-password'>记住密码</Checkbox>
          <Button
            className='btn-login'
            onClick={this.login}
          >
            登&nbsp;&nbsp;录
          </Button>
        </div>
      </div>
    )
  }

}

const mapStateToProps = state => {
  return {
    userInfo: state.userLogin
  }
}

export default connect(mapStateToProps)(Login)
