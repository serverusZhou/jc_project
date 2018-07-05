import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table } from 'antd'

import { genPlanColumn, genPagination } from 'Utils/helper'

import { deleteResource, sourceList } from '../reduck'

class Resource extends Component {

  constructor(props) {
    super(props)
    this.state = {
      cateId: this.props.match.params.cateId
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    const { cateId } = this.state
    dispatch(sourceList({ pageSize: 10, currentPage: 1, cateId }))
  }

  _handleDelete = (sourceId) => {
    const { dispatch, filter, list, page } = this.props
    const length = list.length
    if (length > 1) {
      dispatch(deleteResource({ sourceId }, filter))
    } else if (length === 1) {
      dispatch(deleteResource({ sourceId }, { ...filter, currentPage: page.pageNo > 1 ? Number(page.currentPage) - 1 : 1 }))
    }
  }

  _columns = [
    genPlanColumn('episodeName', '资源名称'),
    genPlanColumn('episodeImgUrl', '图片', {
      render: (text) => {
        return text ? (<img alt='加载失败' style={{ width: 80, height: 80 }} src={text} />) : null
      }
    }),
    genPlanColumn('sort', '排序'),
    // genPlanColumn('episodeLinkUrl', '链接地址'),
    genPlanColumn('createTime', '添加时间'),
    genPlanColumn('modifyTime', '更新时间'),
    genPlanColumn('operate', '操作', {
      render: (text, record) => {
        return (
          <a onClick={() => this._handleDelete(record.sourceId)}>删除</a>
        )
      }
    }),
  ]

  _handleSearch = searchData => {
    const { filter } = this.props

    const finalFilter = Object.assign({}, filter, searchData, { currentPage: 1 })
    this.props.dispatch(sourceList(finalFilter))
  }

  _handleChange = (pagination, filters, sorter) => {
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(sourceList(finalFilter))
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
          rowKey='sourceId'
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

    list: state.operate.vedio.sourceList,
    filter: state.operate.vedio.sourceFilter,
    page: state.operate.vedio.sourcePage,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Resource)
