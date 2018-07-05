import React, { Component } from 'react'
import { Table, Modal, Tabs } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getOTTChannelList } from '../reduck'
import { OTTRESOURCE_AUDIT_CHANNEL_DETAIL } from 'Global/urls'
import { genPlanColumn, genSelectColumn, genPagination } from 'Utils/helper'
import { AuditStatus, SearchAuditStatusKeyMap, OperateAuditType } from '../dict'
import styles from '../styles.less'

const TabPane = Tabs.TabPane

class Interphase extends Component {
  state = {
    previewVisible: false,
    previewImage: ''
  }

  // 初始化表格数据
  componentDidMount() {
    this._handleSearch({
      auditStatus: SearchAuditStatusKeyMap.WAIT.value
    })
  }

  // 点击查询
  _handleSearch = searchData => {
    const { filter } = this.props
    searchData.type = OperateAuditType.OTTCHANNEL
    const finalFilter = Object.assign({}, filter, searchData)
    this.props.dispatch(getOTTChannelList(finalFilter))
  }

  // 表格分页切换
  _handleChange = (pagination, filters, sorter) => {
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize, type: OperateAuditType.OTTCHANNEL }
    dispatch(getOTTChannelList(finalFilter))
  }

  // 生成表格展示字段
  _getColumns = (tab) => {
    const columns = [
      {
        key: 'name',
        title: '频道名称',
        align: 'center',
        className: styles['table-image-column'],
        dataIndex: 'name',
      },
      {
        key: 'logoUrl',
        title: '频道图',
        align: 'center',
        className: styles['table-image-column'],
        dataIndex: 'logoUrl',
        render: (text, record) =>
          (
            record.logoUrl && <img src={record.logoUrl} className={styles['interphase-preview']} />
          )
      }
    ]
    const auditedColumns = [
      genSelectColumn('status', '审核状态', AuditStatus),
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
          (<Link to={`${OTTRESOURCE_AUDIT_CHANNEL_DETAIL}/${record.channelId}@${record.id}`}>
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
          (<Link to={`${OTTRESOURCE_AUDIT_CHANNEL_DETAIL}/${record.serviceId},${record.auditId}`}>
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
              pagination={false}
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
    list: state.resource.audit.ottChannelList,
    page: state.resource.audit.ottChannelPage,
    filter: state.resource.audit.ottChannelFilter,
    showListSpin: state.common.showListSpin,
    positions: state.resource.audit.ottCategoryPositions
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(Interphase)
