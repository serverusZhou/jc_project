import React, { Component } from 'react'
import { Table, Modal, Tabs } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getAdvertiseList } from '../reduck'
import { RESOURCE_AUDIT_ADVERTISE_DETAIL } from 'Global/urls'
import { genPlanColumn, genSelectColumn, genPagination, filterResolver } from 'Utils/helper'
import { AuditStatus, SearchAuditStatusKeyMap, OperateAuditType, AuditStatusKeyMap } from '../dict'
import moment from 'moment'
import styles from '../styles.less'

const TabPane = Tabs.TabPane

class Advertise extends Component {
  state = {
    previewVisible: false,
    previewImage: ''
  }

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
    // 业务表查询时，type传null
    searchData.type = searchData.auditStatus === AuditStatusKeyMap.WAIT.value ? null : OperateAuditType.Advertise
    const finalSearchData = filterResolver(searchData, 'showTime', 'showStartTime', 'showEndTime')

    const finalFilter = Object.assign({}, filter, finalSearchData, { currentPage: 1, pageSize: page.pageSize })
    this.props.dispatch(getAdvertiseList(finalFilter))
  }

  // 表格分页切换
  _handleChange = (pagination, filters, sorter) => {
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(getAdvertiseList(finalFilter))
  }

  // 生成表格展示字段
  _getColumns = (tab) => {
    const columns = [
      genPlanColumn('positionName', '广告位置'),
      {
        key: 'img',
        title: '广告图',
        className: styles['table-image-column'],
        dataIndex: 'img',
        align: 'center',
        render: (text, record, index) =>
          (
            (record.adImg1Url || record.adImg2Url || record.episodeImgUrl) &&
            <img src={record.adImg1Url || record.adImg2Url || record.episodeImgUrl} className={styles['advertie-preview']} />
          )
      },
      {
        key: 'showStartTime',
        title: '展示开始时间',
        align: 'center',
        dataIndex: 'showStartTime',
        render: (text, record, index) =>
          (
            <div>
              {moment(record.showStartTime).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          )
      },
      {
        key: 'showEndTime',
        title: '展示结束时间',
        align: 'center',
        dataIndex: 'showEndTime',
        render: (text, record, index) =>
          (
            <div>
              {moment(record.showEndTime).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          )
      }
    ]
    const auditedColumns = [
      genSelectColumn('auditStatus', '审核状态', AuditStatus),
      {
        key: 'createTime',
        title: '审核时间',
        dataIndex: 'createTime',
        align: 'center',
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
    // 进入审核页面
    const operationColumns = [
      {
        key: 'operation',
        title: '操作',
        align: 'center',
        render: (text, record, index) =>
          (<Link to={`${RESOURCE_AUDIT_ADVERTISE_DETAIL}/${record.serviceId}`}>
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
          (<Link to={`${RESOURCE_AUDIT_ADVERTISE_DETAIL}/${record.serviceId},${record.auditId}`}>
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
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img
            alt=''
            style={{ width: '100%' }}
            src={this.state.previewImage}
          />
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    list: state.resource.audit.advertiseList,
    page: state.resource.audit.advertisePage,
    filter: state.resource.audit.advertiseFilter,
    showListSpin: state.common.showListSpin,
    positions: state.resource.audit.advertisePositions
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(Advertise)
