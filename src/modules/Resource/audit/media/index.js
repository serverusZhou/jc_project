import React, { Component } from 'react'
import { Table, Tabs, Input } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getMediaList } from '../reduck'
import { RESOURCE_AUDIT_MEDIA_DETAIL } from 'Global/urls'
import { genPlanColumn, genSelectColumn, genPagination } from 'Utils/helper'
import { AuditStatus, SearchAuditStatus, SearchAuditStatusKeyMap, MediaAuditType } from '../dict'

const TabPane = Tabs.TabPane

class Media extends Component {

  // 初始化表格数据
  componentWillMount() {
    this._handleSearch({
      auditStatus: SearchAuditStatusKeyMap.WAIT.value
    })
  }

  // filter组件的搜索
  _handleSearch = searchData => {
    const { filter } = this.props
    const { page } = this.props
    const finalFilter = Object.assign({}, filter, searchData, { currentPage: 1, pageSize: page.pageSize })
    this.props.dispatch(getMediaList(finalFilter))
  }

  // table分页组件的响应
  _handleChange = (pagination, filters, sorter) => {
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize, type: MediaAuditType.Episode }
    dispatch(getMediaList(finalFilter))
  }

  // 组织搜索字段
  _genFilterFields = () => {
    const fields = [
      {
        key: 'auditStatus',
        label: '审核状态',
        initialValue: SearchAuditStatusKeyMap.WAIT.value,
        type: 'Select',
        content: SearchAuditStatus
      }
    ]
    return fields
  }

  // 组织table字段
  _getColumns = (tab) => {
    const columns = [
      genPlanColumn('episodeCnName', '中文名称'),
      genPlanColumn('cateName', '所属分类')
    ]
    const auditedColumns = [
      genSelectColumn('auditStatus', '审核状态', AuditStatus),
      {
        key: 'auditTime',
        title: '审核时间',
        align: 'center',
        dataIndex: 'auditTime',
        render: (text, record, index) =>
          (
            record.auditTime &&
            <span>
              {moment(record.auditTime).format('YYYY-MM-DD HH:mm')}
            </span>
          )
      },
      genPlanColumn('auditName', '责任人')
    ]
    const auditingColums = [
      {
        key: 'postTime',
        title: '提审时间',
        align: 'center',
        dataIndex: 'postTime',
        render: (text, record, index) =>
          (
            record.postTime &&
            <span>
              {moment(record.postTime).format('YYYY-MM-DD HH:mm')}
            </span>
          )
      }
    ]
    const operationColumns = [
      {
        key: 'operation',
        title: '操作',
        align: 'center',
        render: (text, record, index) =>
          (<Link to={`${RESOURCE_AUDIT_MEDIA_DETAIL}/${record.episodeId},true`}>
            查看
          </Link>)
      }
    ]
    if (tab === SearchAuditStatusKeyMap.WAIT.value) {
      return columns.concat(auditingColums, operationColumns)
    } else {
      return columns.concat(auditedColumns, operationColumns)
    }
  }

  _getTabActions = () => {
    const { filter } = this.props
    return (
      <Input.Search
        placeholder='输入媒资名称进行搜索'
        style={{ width: 300 }}
        defaultValue={filter.episodeCnName}
        onSearch={(value) => this._handleSearchChange(value)}
        enterButton
      />)
  }

  _handleSearchChange = (value) => {
    this._handleSearch({ episodeCnName: value })
  }

  render() {
    const pagination = genPagination(this.props.page)
    return (
      <div>
        <Tabs onChange={(tab) => this._handleSearch({ auditStatus: tab })} type='card' tabBarExtraContent={this._getTabActions()}>
          <TabPane tab='待审核' key='1'>
            <Table
              bordered={true}
              columns={this._getColumns('1')}
              loading={this.props.showListSpin}
              dataSource={this.props.list}
              onChange={this._handleChange}
              rowKey='episodeId'
              locale={{ emptyText: '暂无数据' }}
              pagination={pagination}
            />
          </TabPane>
          <TabPane tab='已审核' key='2'>
            <Table
              bordered={true}
              columns={this._getColumns('2')}
              loading={this.props.showListSpin}
              dataSource={this.props.list}
              onChange={this._handleChange}
              rowKey='episodeId'
              locale={{ emptyText: '暂无数据' }}
              pagination={pagination}
            />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

// 从redux提取相关字段
const mapStateToProps = state => {
  return {
    list: state.resource.audit.mediaList,
    page: state.resource.audit.mediaPage,
    filter: state.resource.audit.mediaFilter,
    showListSpin: state.common.showListSpin
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(Media)
