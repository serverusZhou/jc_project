import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './style.less'
import { Input, Button, message } from 'antd'
import name from 'Assets/images/login/name.png'
import password from 'Assets/images/login/password.png'
import { userLogin } from 'Global/action'
import storage from 'Utils/storage'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
    let methods = ['getEmail', 'getPwd', 'login']
    methods.map((item) => {
      this[item] = this[item].bind(this)
    })
  }
  componentWillMount () {
    const userInfo = storage.get('userInfo')
    if (userInfo && userInfo.ticket) {
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
  render() {
    return (
      <div className={styles['user_login_wrapper']}>
        <div className={styles['layout_wrapper_box']}>
          <div className={styles['login_title']}>系统登录</div>
          <div className={styles['box_name']}>
            <img
              className={styles['box_name_icon']}
              src={name}
            />
            <Input
              type='text'
              className={styles['box_name_input']}
              placeholder='请输入手机号'
              onChange={this.getEmail}
            />
          </div>

          <div className={styles['box_password']}>
            <img
              className={styles['box_password_icon']}
              src={password}
            />
            <Input
              type='password'
              className={styles['box_password_input']}
              placeholder='请输入密码'
              onChange={this.getPwd}
              onPressEnter={this.login}
            />
          </div>
          <Button
            className={styles.box_button}
            onClick={this.login}
          >登&nbsp;&nbsp;录
          </Button>
        </div>
      </div>
    )
  }
  getEmail(e) {
    this.setState({
      email: e.target.value
    })
  }
  getPwd(e) {
    this.setState({
      password: e.target.value
    })
  }
  login() {
    let userName = this.state.email
    let userPwd = this.state.password
    if (userName === '') {
      message.error('请输入账号')
      return
    }
    if (userPwd === '') {
      message.error('请输入密码')
      return
    }

    // let userInfoFormData = new FormData()
    // userInfoFormData.append('userName', userName)
    // userInfoFormData.append('userPwd', userPwd)
    this.props.dispatch(userLogin({ password: userPwd, telephone: userName }))
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.common.userLogin
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
