import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tag, Button } from 'antd'
import * as actions from './reduck'
import style from './styles.less'
import { isEmpty } from 'Utils/lang'
import { RESOURCE_ROLE } from 'Global/urls'
import menuTreeList from 'Global/menuTreeList'

class RoleDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(actions.detail({ roleId: this.props.match.params.id })).then((res) => {
      const { list } = this.state
      const thisMenuList = (isEmpty(res.result) || isEmpty(res.result.menuList)) ? [] : res.result.menuList
      menuTreeList.map((menus) => {
        let children = []
        menus.children && menus.children.map((item) => {
          let matching = thisMenuList.filter(m => {
            if (m.menuTag === item.menuKey) {
              m.menuName = item.name
              return m
            }
          })
          children = children.concat(matching)
        })
        children.length > 0 ? list.push({ classification: menus.name, children: children }) : ''
      })
      this.setState({ list })
    })
  }

  _handleback = () => {
    this.props.history.push(RESOURCE_ROLE)
  }

  render() {
    const { detail } = this.props
    return (
      <div className={style['detail-wrapper']}>
        <h3 className={style['title']}>
          角色信息
          <span className={style['goback']}>
            <Button onClick={this._handleback}>返回</Button>
          </span>
        </h3>
        <div className={style['content-wrapper']}>
          <label>角色名称：</label>
          <span>{detail.roleName}</span>
        </div>
        <div className={style['content-wrapper']}>
          <label>角色描述：</label>
          <span>{detail.roleDesc}</span>
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
    detail: state.resource.role.detail
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(RoleDetail)
