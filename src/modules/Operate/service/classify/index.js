import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Button } from 'antd'

import { genPlanColumn, genPagination, genSelectColumn } from 'Utils/helper'
import Filter from 'Components/Filter'

import { serviceClassifyList } from '../reduck'
import { EnableList } from '../../dict'

class ServiceClassify extends Component {

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(serviceClassifyList({ pageSize: 10, currentPage: 1 }))
  }

  _columns = [
    genPlanColumn('lifeCatgId', 'ID'),
    genPlanColumn('lifeCatgName', '分类名称'),
    genPlanColumn('sort', '排序序号'),
    genPlanColumn('modifyTime', '更新时间'),
    genSelectColumn('isEnable', '状态', EnableList),
    genPlanColumn('operateUser', '操作人'),
    genPlanColumn('operate', '操作', {
      render: (text, record) => {
        return (
          <span>
            {record.isEnable + '' === '0' ? '启用' : '禁用'}
          </span>
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
        lifeCatg: searchData.lifeCatg && searchData.lifeCatg.trim()
      })
    this.props.dispatch(serviceClassifyList(finalFilter))
  }

  _handleChange = (pagination, filters, sorter) => {
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(serviceClassifyList(finalFilter))
  }

  _handleAdd = () => {

  }

  _genFilterFields = (filter) => {
    // const {  } = this.props
    const fields = [
      {
        key: 'lifeCatg',
        label: '分类名称',
        initialValue: filter['lifeCatg'],
        type: 'Input',
      },
      {
        key: 'isEnable',
        label: '状态',
        initialValue: filter['isEnable'] || '',
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
          extraBtns={[
            <Button key='add' type='primary' onClick={this._handleAdd}>新增</Button>
          ]}
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

    list: state.operate.service.serviceClassifyList,
    filter: state.operate.service.serviceClassifyFilter,
    page: state.operate.service.serviceClassifyPage,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(ServiceClassify)
