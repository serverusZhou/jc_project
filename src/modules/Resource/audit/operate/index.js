import React, { Component } from 'react'
import { Table, Tabs } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getOperateList } from '../reduck'
import { RESOURCE_AUDIT_OPERATION_DETAIL } from 'Global/urls'
import { genPlanColumn, genSelectColumn, genPagination, filterResolver } from 'Utils/helper'
import { AuditStatus, SearchAuditStatusKeyMap, OperateAuditType, OperateLevel } from '../dict'
import moment from 'moment'
import styles from '../styles.less'

const TabPane = Tabs.TabPane

class Operation extends Component {

  // 初始化表格数据
  componentWillMount() {
    this._handleSearch({
      auditStatus: SearchAuditStatusKeyMap.WAIT.value
    })
  }

  // 点击查询
  _handleSearch = searchData => {
    const { filter } = this.props
    const { page } = this.props
    searchData.type = OperateAuditType.OperateCate
    const finalSearchData = filterResolver(searchData, 'showTime', 'showStartTime', 'showEndTime')

    const finalFilter = Object.assign({}, filter, finalSearchData, { currentPage: 1, pageSize: page.pageSize })
    this.props.dispatch(getOperateList(finalFilter))
  }

  // 表格分页切换
  _handleChange = (pagination, filters, sorter) => {
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize, type: OperateAuditType.OperateCate }
    dispatch(getOperateList(finalFilter))
  }

  // 生成表格展示字段
  _getColumns = (tab) => {
    const columns = [
      genPlanColumn('cateName', '分类名称'),
      {
        key: 'logoUrl',
        title: 'Logo',
        align: 'center',
        className: styles['table-image-column'],
        dataIndex: 'logoUrl',
        render: (text, record, index) =>
          (
            record.logoUrl && <img src={record.logoUrl} className={styles['cate-logo']} />
          )
      },
      genPlanColumn('sort', '排序'),
      genSelectColumn('level', '分类类型', OperateLevel),
    ]
    const auditedColumns = [
      genSelectColumn('auditStatus', '审核状态', AuditStatus),
      {
        key: 'createTime',
        title: '审核时间',
        align: 'center',
        dataIndex: 'createTime',
        render: (text, record, index) =>
          (
            <span>
              {moment(record.createTime).format('YYYY-MM-DD HH:mm')}
            </span>
          )
      },
      genPlanColumn('userName', '责任人')
    ]
    const auditingColums = [
      {
        key: 'modifyTime',
        title: '提审时间',
        align: 'center',
        dataIndex: 'modifyTime',
        render: (text, record, index) =>
          (
            <span>
              {moment(record.modifyTime).format('YYYY-MM-DD HH:mm')}
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
          (<Link to={`${RESOURCE_AUDIT_OPERATION_DETAIL}/${record.serviceId}`}>
            查看
          </Link>)
      }
    ]
    // 审核日志详情
    const viewColumns = [
      {
        key: 'operation',
        title: '操作',
        align: 'center',
        render: (text, record, index) =>
          (<Link to={`${RESOURCE_AUDIT_OPERATION_DETAIL}/${record.serviceId},${record.auditId}`}>
            查看
          </Link>)
      }
    ]
    if (tab === SearchAuditStatusKeyMap.WAIT.value) {
      return columns.concat(auditingColums, operationColumns)
    } else {
      return columns.concat(auditedColumns, viewColumns)
    }
  }

  // 表格图片点击预览
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    })
  }

  // modal点击关闭
  handleCancel = () => this.setState({ previewVisible: false })

  render() {
    const pagination = genPagination(this.props.page)
    return (
      <div>
        <Tabs onChange={(tab) => this._handleSearch({ auditStatus: tab })} type='card'>
          <TabPane tab='待审核' key='1'>
            <Table
              bordered={true}
              columns={this._getColumns('1')}
              loading={this.props.showListSpin}
              dataSource={this.props.list}
              onChange={this._handleChange}
              rowKey='_row_key'
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
              rowKey='_row_key'
              locale={{ emptyText: '暂无数据' }}
              pagination={pagination}
            />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    list: state.resource.audit.operateList,
    page: state.resource.audit.operatePage,
    filter: state.resource.audit.operateFilter,
    showListSpin: state.common.showListSpin
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(Operation)
