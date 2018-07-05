import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs, Table } from 'antd'
import { Link } from 'react-router-dom'
import { genPlanColumn, genSelectColumn, genPagination } from 'Utils/helper'
import { AuditStatus } from '../dict'
import { getAuditedList, getUnauditedList } from '../reduck'
import { RESOURCE_AUDIT_APPLY_AUDITEDDETAIL, RESOURCE_AUDIT_APPLY_UNAUDITEDDETAIL } from 'Global/urls'

const TabPane = Tabs.TabPane

class Apply extends Component {
  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getUnauditedList({ auditStatus: '1', currentPage: 1, pageSize: 10 }))
    dispatch(getAuditedList({ auditStatus: '0', currentPage: 1, pageSize: 10, type: '7' }))
  }

  _auditedColumns = [
    genPlanColumn('appName', '应用名称'),
    genPlanColumn('cateName', '所属分类'),
    genSelectColumn('status', '审核状态', AuditStatus),
    genPlanColumn('userName', '审核人'),
    genPlanColumn('auditTime', '审核时间'),
    {
      key: 'operate',
      title: '操作',
      align: 'center',
      dataIndex: 'operate',
      render: (text, record, index) =>
        (<Link to={`${RESOURCE_AUDIT_APPLY_AUDITEDDETAIL}/${record.auditId}`}>
          查看
        </Link>)
    }
  ]

  _columns = [
    genPlanColumn('appName', '应用名称'),
    genPlanColumn('cateName', '所属分类'),
    genPlanColumn('modifyTime', '提审时间'),
    {
      key: 'operate',
      title: '操作',
      align: 'center',
      dataIndex: 'operate',
      render: (text, record, index) =>
        (<Link to={`${RESOURCE_AUDIT_APPLY_UNAUDITEDDETAIL}/${record.versionId}`}>
          查看
        </Link>)
    }
  ]

  _tabStatus = (key) => {
    const { filter, unAuditedfilter, dispatch } = this.props
    if (key && key === 'unAudited') {
      dispatch(getUnauditedList({ ...unAuditedfilter }))
    } else if (key && key === 'audited') {
      dispatch(getAuditedList({ ...filter }))
    }
  }

  _handlePageChange = (pagination) => {
    window.scrollTo(0, 0)
    const { unAuditedfilter, unAuditedpage } = this.props
    const { current, pageSize } = pagination
    this.props.dispatch(getUnauditedList({ ...unAuditedfilter, currentPage: Number(unAuditedpage.pageSize) !== pageSize ? 1 : current, pageSize: pageSize }))
  }

  _handleAuditedPageChange = (pagination) => {
    window.scrollTo(0, 0)
    const { filter, page } = this.props
    const { current, pageSize } = pagination
    this.props.dispatch(getAuditedList({ ...filter, currentPage: Number(page.pageSize) !== pageSize ? 1 : current, pageSize: pageSize }))
  }

  render() {
    const { list, unAuditedlist, showListSpin, page, unAuditedpage } = this.props
    const pagination = genPagination(page)
    const unAudited = genPagination(unAuditedpage)
    return (
      <div>
        <Tabs defaultActiveKey='unAudited' onChange={this._tabStatus} type='card'>
          <TabPane tab='待审核' key='unAudited'>
            <Table
              columns={this._columns}
              dataSource={unAuditedlist}
              bordered={true}
              rowKey='appId'
              onChange={this._handlePageChange}
              pagination={unAudited}
              loading={showListSpin}
            />
          </TabPane>
          <TabPane tab='已审核' key='audited'>
            <Table
              columns={this._auditedColumns}
              dataSource={list}
              bordered={true}
              rowKey='auditId'
              onChange={this._handleAuditedPageChange}
              pagination={pagination}
              loading={showListSpin}
            />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    list: state.resource.audit.applyAuditedList,
    page: state.resource.audit.applyAuditedPage,
    filter: state.resource.audit.applyAuditedFilter,
    showListSpin: state.common.showListSpin,
    unAuditedlist: state.resource.audit.applyUnAuditedList,
    unAuditedpage: state.resource.audit.applyUnAuditedPage,
    unAuditedfilter: state.resource.audit.applyUnAuditedFilter,
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(Apply)
