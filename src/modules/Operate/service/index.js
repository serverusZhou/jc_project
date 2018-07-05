import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table } from 'antd'

import { genPlanColumn, genPagination } from 'Utils/helper'
import Filter from 'Components/Filter'

import { serviceList, updateEnable } from './reduck'
import { EnableList } from '../dict'

class Service extends Component {

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(serviceList({ currentPage: 1, pageSize: 10 }))
  }

  _handleEnable = (lifeServiceId, isEnabled) => {
    const { dispatch, filter } = this.props
    dispatch(updateEnable({ lifeServiceId, isEnabled }, filter))
  }

  _columns = [
    genPlanColumn('lifeServiceName', '服务名称'),
    genPlanColumn('lifeCateName', '分类名称'),
    genPlanColumn('sort', '排序序号'),
    genPlanColumn('modifyTime', '更新时间'),
    genPlanColumn('isEnabled', '状态', {
      render: text => (
        <span>{text ? '在用' : '禁用'}</span>
      )
    }),
    genPlanColumn('operateUser', '操作人'),
    genPlanColumn('operate', '操作', {
      render: (text, record) => {
        return (
          <a onClick={() => this._handleEnable(record.lifeServiceId, !record.isEnabled)}>
            {!record.isEnabled ? '启用' : '禁用'}
          </a>
        )
      }
    }),
  ]

  _handleSearch = searchData => {
    const { filter } = this.props

    const finalFilter = Object.assign(
      {},
      filter,
      searchData,
      {
        currentPage: 1,
        lifeCateName: searchData.lifeCateName && searchData.lifeCateName.trim()
      })
    this.props.dispatch(serviceList(finalFilter))
  }

  _handleChange = (pagination, filters, sorter) => {
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(serviceList(finalFilter))
  }

  _handleAdd = () => {

  }

  _genFilterFields = (filter) => {
    // const {  } = this.props
    const fields = [
      {
        key: 'lifeServiceName',
        label: '服务名称',
        initialValue: filter['lifeServiceName'],
        type: 'Input',
      },
      {
        key: 'isEnabled',
        label: '状态',
        initialValue: filter['isEnabled'] || '',
        type: 'Select',
        content: EnableList
      }
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
          rowKey='lifeServiceId'
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

    list: state.operate.service.serviceList,
    filter: state.operate.service.serviceFilter,
    page: state.operate.service.servicePage,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Service)
