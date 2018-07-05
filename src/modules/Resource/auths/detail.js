import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tag, Button } from 'antd'
import * as actions from './reduck'
import style from './styles.less'
import { isEmpty } from 'Utils/lang'
import { RESOURCE_AUTHS } from 'Global/urls'

class AuthsDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    console.log(this.props.match.params)
    dispatch(actions.detail({ adminId: this.props.match.params.id })).then((res) => {
      if (res.status === 'success' && res.result.roleId !== '0') {
        dispatch(actions.getRoleDetail({ roleId: res.result.roleId })).then((data) => {
          const { list } = this.state
          const thisMenuList = (isEmpty(data.result) || isEmpty(data.result.menuList)) ? [] : data.result.menuList
          this.props.menuList.map((menus, index) => {
            let children = []
            menus.children && menus.children.map((item, kk) => {
              let matching = thisMenuList.filter(m => {
                return m.menuTag === item.menuKey
              })
              children = children.concat(matching)
            })
            children.length > 0 ? list.push({ classification: menus.name, children: children }) : ''
          })
          this.setState({ list })
        })
      }
    })
  }

  // 返回
  _handleBack = () => {
    const { history } = this.props
    history.push(RESOURCE_AUTHS)
  }

  render() {
    const { detail } = this.props
    return (
      <div className={style['detail-wrapper']}>
        <h3 className={style['title']}>
        管理员信息
        <span className={style['goback']}>
          <Button
            title='点击返回'
            onClick={this._handleBack}
          >
            返回
          </Button>
        </span>
        </h3>
        <div className={style['content-wrapper']}>
          <label>管理员：</label>
          <span>{detail.adminName}</span>
        </div>
        <div className={style['content-wrapper']}>
          <label>手机号码：</label>
          <span>{detail.telephone}</span>
        </div>
        <div className={style['content-wrapper']}>
          <label>角色：</label>
          <span>{detail.roleName}</span>
        </div>
        <div className={style['content-wrapper']}>
          <label>菜单权限：</label>
          <div className={style['inlineblock']}>
            {
              this.state.list.map((item, index) => {
                let menuStr = (item.children.map((item) => item.menuName)).join('，')
                return (<div key={index}><Tag>{item.classification}</Tag>{menuStr}</div>)
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    detail: state.resource.auths.detail,
    roleDetail: state.resource.auths.roleDetail,
    menuList: state.common.menuTreeList
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthsDetail)
