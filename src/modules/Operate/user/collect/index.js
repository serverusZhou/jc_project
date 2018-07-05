import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table } from 'antd'

import { genPlanColumn, genPagination } from 'Utils/helper'
import Filter from 'Components/Filter'

import { collectList } from '../reduck'

class Collect extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userId: this.props.match.params.userId
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    const { userId } = this.state
    dispatch(collectList({ userId, pageSize: 10, currentPage: 1 }))
  }

  _handleEnable = () => {

  }

  _handleCheckReason = () => {

  }

  _columns = [
    genPlanColumn('relatedName', '名称'),
    genPlanColumn('collectionType', '分类'),
    genPlanColumn('createTime', '收藏时间'),
  ]

  _handleSearch = searchData => {
    const { filter, dispatch } = this.props
    const finalFilter = Object.assign(
      {},
      filter,
      searchData,
      {
        currentPage: 1,
        relatedName: searchData.relatedName && searchData.relatedName.trim()
      })
    dispatch(collectList(finalFilter))
  }

  _handleChange = (pagination, filters, sorter) => {
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(collectList(finalFilter))
  }

  _handleAdd = () => {

  }

  _genFilterFields = (filter) => {
    // const {  } = this.props
    const fields = [
      {
        key: 'relatedName',
        label: '名称',
        initialValue: filter['relatedName'],
        type: 'Input',
      },
    ]

    return fields
  }

  render() {
    const { showListSpin, list, filter, page } = this.props
    const fields = this._genFilterFields(filter)
    const pagination = genPagination(page)

    return (
      <div>
        <Filter
          fields={fields}
          onSearch={this._handleSearch}
        />
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

    list: state.operate.user.collectList,
    filter: state.operate.user.collectFilter,
    page: state.operate.user.collectPage,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Collect)
