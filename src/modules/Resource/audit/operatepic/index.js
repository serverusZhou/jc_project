import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs, Table } from 'antd'
import { Link } from 'react-router-dom'
import { genPlanColumn, genSelectColumn, genPagination } from 'Utils/helper'
import { AuditStatus, SourceType } from '../dict'
import { getOperatePicAuditedList, getOperatePicUnauditedList } from '../reduck'
import { RESOURCE_AUDIT_OPERATEPIC_AUDITEDDETAIL, RESOURCE_AUDIT_OPERATEPIC_UNAUDITEDDETAIL } from 'Global/urls'
import styles from '../styles.less'

const TabPane = Tabs.TabPane

class OperatePic extends Component {
  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getOperatePicUnauditedList({ auditStatus: '1', currentPage: 1, pageSize: 10 }))
    dispatch(getOperatePicAuditedList({ auditStatus: '0', currentPage: 1, pageSize: 10, type: '8' }))
  }

  _auditedColumns = [
    {
      key: 'operaterPic',
      title: '运营图',
      className: styles['table-image-column'],
      dataIndex: 'operaterPic',
      align: 'center',
      render: (text, record, index) =>
        (
          <img src={record.operaterPic} className={styles['advertie-preview']} />
        )
    },
    genSelectColumn('status', '审核状态', AuditStatus),
    genSelectColumn('source', '分类名称', SourceType),
    genPlanColumn('userName', '审核人'),
    genPlanColumn('auditTime', '审核时间'),
    {
      key: 'operate',
      title: '操作',
      align: 'center',
      dataIndex: 'operate',
      render: (text, record, index) =>
        (<Link to={`${RESOURCE_AUDIT_OPERATEPIC_AUDITEDDETAIL}/${record.auditId}`}>
          查看
        </Link>)
    }
  ]

  _columns = [
    {
      key: 'operaterPic',
      title: '运营图',
      className: styles['table-image-column'],
      dataIndex: 'operaterPic',
      align: 'center',
      render: (text, record, index) =>
        (
          <img src={record.operaterPic} className={styles['advertie-preview']} />
        )
    },
    genSelectColumn('source', '分类名称', SourceType),
    genPlanColumn('modifyTime', '提审时间'),
    {
      key: 'operate',
      title: '操作',
      align: 'center',
      dataIndex: 'operate',
      render: (text, record, index) =>
        (<Link to={`${RESOURCE_AUDIT_OPERATEPIC_UNAUDITEDDETAIL}/${record.sourceId}`}>
          查看
        </Link>)
    }
  ]

  _tabStatus = (key) => {
    const { filter, unAuditedfilter, dispatch } = this.props
    if (key && key === 'unAudited') {
      dispatch(getOperatePicUnauditedList({ ...unAuditedfilter }))
    } else if (key && key === 'audited') {
      dispatch(getOperatePicAuditedList({ ...filter }))
    }
  }

  _handlePageChange = (pagination) => {
    window.scrollTo(0, 0)
    const { unAuditedfilter, unAuditedpage } = this.props
    const { current, pageSize } = pagination
    this.props.dispatch(getOperatePicUnauditedList({ ...unAuditedfilter, currentPage: Number(unAuditedpage.pageSize) !== pageSize ? 1 : current, pageSize: pageSize }))
  }

  _handleAuditedPageChange = (pagination) => {
    window.scrollTo(0, 0)
    const { filter, page } = this.props
    const { current, pageSize } = pagination
    this.props.dispatch(getOperatePicAuditedList({ ...filter, currentPage: Number(page.pageSize) !== pageSize ? 1 : current, pageSize: pageSize }))
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
              rowKey='sourceId'
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
    list: state.resource.audit.operatePicAuditedList,
    page: state.resource.audit.operatePicAuditedPage,
    filter: state.resource.audit.operatePicAuditedFilter,
    showListSpin: state.common.showListSpin,
    unAuditedlist: state.resource.audit.operatePicUnAuditedList,
    unAuditedpage: state.resource.audit.operatePicUnAuditedPage,
    unAuditedfilter: state.resource.audit.operatePicUnAuditedFilter,
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(OperatePic)
