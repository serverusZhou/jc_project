import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table } from 'antd'

import { genPlanColumn, genPagination } from 'Utils/helper'

import { accountList } from '../reduck'

class AccountInfo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userId: this.props.match.params.userId
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    const { userId } = this.state
    dispatch(accountList({ userId, pageSize: 10, currentPage: 1 }))
  }

  _columns = [
    genPlanColumn('lifeServiceName', '类型'),
    genPlanColumn('accountNo', '户号'),
    genPlanColumn('accountName', '户名'),
    genPlanColumn('organization', '缴费单位'),
    genPlanColumn('createTime', '绑定时间'),
  ]

  _handleChange = (page) => {
    const { filter, dispatch, list } = this.props
    const { current, pageSize } = page
    const finalFilter = { ...filter, currentPage: list.pageSize !== page.pageSize ? 1 : current, pageSize }
    dispatch(accountList(finalFilter))
  }

  render() {
    const { showListSpin, list } = this.props
    const pagination = genPagination(list)

    return (
      <div>
        <Table
          pagination={pagination}
          columns={this._columns}
          onChange={this._handleChange}
          rowKey='lifeServiceName'
          dataSource={list.data}
          loading={showListSpin}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,
    list: state.operate.user.accountList,
    filter: state.operate.user.accountFilter,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo)
