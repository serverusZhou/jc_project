import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table } from 'antd'

import { genPlanColumn, genPagination, genSelectColumn } from 'Utils/helper'

import { macList } from '../reduck'
import { LoginMode } from '../../dict'

class UserMac extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userId: this.props.match.params.userId
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    const { userId } = this.state
    dispatch(macList({ userId, pageSize: 10, currentPage: 1 }))
  }

  _columns = [
    genPlanColumn('macAddr', 'Mac地址'),
    // genPlanColumn('operateType', '登录/注册'),
    genSelectColumn('loginWay', '登录/注册方式', LoginMode),
    genPlanColumn('loginTime', '登录/注册时间'),
  ]

  _handleChange = (pagination, filters, sorter) => {
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(macList(finalFilter))
  }

  render() {
    const { showListSpin, list, page } = this.props
    const pagination = genPagination(page)

    return (
      <div>
        <Table
          pagination={pagination}
          columns={this._columns}
          onChange={this._handleChange}
          rowKey='index'
          dataSource={list}
          loading={showListSpin}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,

    list: state.operate.user.macList,
    filter: state.operate.user.macFilter,
    page: state.operate.user.macPage,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(UserMac)
