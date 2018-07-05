import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Table, message, Tabs, Badge } from 'antd'

import { PAGE_SIZE, PAG_CONFIG } from 'Global/globalConfig'
import * as globalReduck from 'Global/globalReduck'
import * as reduck from './reduck'
import Audit from './Audit'
import AuditDetail from './AuditDetail'
import { JcContent } from '../../../components/styleComponents'
import { auditStatus } from 'Global/bizdictionary'

const businessTypeList = {
  '1': '商城',
  '2': '商超'
}

const shopType = {
  '1': '电商'
}

class AuditShopList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeKey: '1'
    }
  }
  static defaultProps = {
    AuditShoplist: [],
    pageSize: PAGE_SIZE,
    currentPage: 1,
    total: 0,
    status: '1',
    isShowModal: false,
    isShowDetailModal: false
  }

  _columns = [
    {
      title: '序号',
      key: 'rowNo',
      render: (text, record, index) => {
        const { pageSize, currentPage } = this.props
        return <span>{pageSize * currentPage + (index + 1) - pageSize}</span>
      }
    },
    {
      title: '店铺ID',
      key: 'shopId',
      dataIndex: 'shopId'
    },
    {
      title: '店铺名称',
      key: 'shopName',
      dataIndex: 'shopName',
      width: 160
    },
    {
      title: '店铺类型',
      key: 'shopType',
      dataIndex: 'shopType',
      render: text => shopType[text]
    },
    {
      title: '业务类型',
      key: 'businessTypeList',
      dataIndex: 'businessTypeList',
      render: text => {
        return text && text.map(item => businessTypeList[item]).join(',')
      }
    },
    {
      title: '审核状态',
      key: 'auditCode',
      dataIndex: 'auditCode',
      width: 100,
      render: text => {
        if (text === '1') {
          return <Badge status='warning' text={auditStatus[text]} />
        } else if (text === '2') {
          return <Badge status='warning' text={auditStatus[text]} />
        } else if (text === '3') {
          return <Badge status='success' text={auditStatus[text]} />
        } else if (text === '4') {
          return <Badge status='error' text={auditStatus[text]} />
        }
      }
    }
  ]
  _unauditedColumns = [
    {
      title: '操作',
      key: 'option',
      render: (text, row) => {
        return (
          <a href='javascript:void(0);' onClick={() => this._handleAudit(row.shopId)}>
            审核
          </a>
        )
      }
    }
  ]
  _auditedColumns = [
    {
      title: '审核人',
      key: 'auditor',
      dataIndex: 'auditor'
    },
    {
      title: '审核时间',
      key: 'auditTime',
      dataIndex: 'auditTime'
    },
    {
      title: '操作',
      key: 'option',
      render: (text, row) => {
        return (
          <a href='javascript:void(0);' onClick={() => this._handleDetail(row.shopId)}>
            查看
          </a>
        )
      }
    }
  ]
  // 组件初始化请求数据
  async componentDidMount() {
    this._getTableList()
  }

  // 组件销毁后， 清除global list数据和分页数据
  componentWillUnmount() {
    const globalPagingActionData = {
      currentPage: 1,
      pageSize: PAGE_SIZE,
      total: 0
    }
    this.props.dispatch(globalReduck.globalTableListAction([]))
    this.props.dispatch(globalReduck.globalPagingAction(globalPagingActionData))
  }

  _handleTableSendAction = response => {
    if (response.code === 0) {
      const paging = {
        currentPage: response.data.pageNo,
        pageSize: response.data.pageSize,
        total: response.data.records
      }
      this.props.dispatch(globalReduck.globalTableListAction(response.data.data))
      this.props.dispatch(globalReduck.globalPagingAction(paging))
    } else {
      message.error(response.errmsg)
    }
  }
  _getArg = (status = this.state.activeKey, currentPage = this.props.currentPage, pageSize = this.props.pageSize) => {
    return {
      status: status,
      currentPage: currentPage,
      pageSize: pageSize
    }
  }

  _handleAudit = async shopId => {
    this.props.dispatch(reduck.showModalAction(true))
    let response = await this.props.dispatch(reduck.getShopDetail({ shopId: shopId }))
    this._handleDetailSendAction(response)
  }

  _handleDetail = async shopId => {
    this.props.dispatch(reduck.showModalDetailAction(true))
    let response = await this.props.dispatch(reduck.getShopDetail({ shopId: shopId }))
    this._handleDetailSendAction(response)
  }

  _handleDetailSendAction = res => {
    if (res.code === 0) {
      const data = {
        shopId: res.data.shopId,
        shopName: res.data.shopName,
        businessTypeList: res.data.businessTypeList,
        owner: res.data.owner,
        ownerPhone: res.data.ownerPhone,
        unapprovedReason: res.data.unapprovedReason,
        auditor: res.data.auditor,
        auditTimeStr: res.data.auditTimeStr,
        auditStatus: auditStatus[res.data.auditStatus]
      }
      this.props.dispatch(reduck.auditDetailAction(data))
    } else {
      message.error(res.errmsg)
    }
  }
  _hanlePage = async pagination => {
    this._getTableList(this.state.activeKey, pagination.current, pagination.pageSize)
  }
  _handleSwitchTab = key => {
    this.setState({ activeKey: key }, () => {
      this._getTableList(key, 1)
    })
  }

  _getTableList = async (status = this.state.activeKey, currentPage, pageSize) => {
    let response = await this.props.dispatch(reduck.getShopList(this._getArg(status, currentPage, pageSize)))
    this._handleTableSendAction(response)
  }

  render() {
    return (
      <JcContent>
        <Tabs defaultActiveKey={this.state.activeKey} onChange={this._handleSwitchTab} type='line'>
          <Tabs.TabPane tab='待审' key='1'>
            <Table
              columns={[...this._columns, ...this._unauditedColumns]}
              rowKey='shopId'
              key='list'
              dataSource={this.props.AuditShoplist}
              bordered={true}
              loading={this.props.isLoading}
              onChange={this._hanlePage}
              pagination={{
                pageSize: this.props.pageSize,
                total: this.props.total,
                current: this.props.currentPage,
                ...PAG_CONFIG
              }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab='已审' key='2'>
            <Table
              columns={[...this._columns, ...this._auditedColumns]}
              rowKey='shopId'
              key='list'
              dataSource={this.props.AuditShoplist}
              bordered={true}
              loading={this.props.isLoading}
              onChange={this._hanlePage}
              pagination={{
                pageSize: this.props.pageSize,
                total: this.props.total,
                current: this.props.currentPage,
                ...PAG_CONFIG
              }}
            />
          </Tabs.TabPane>
        </Tabs>
        <Audit key='detail' isShowModal={this.props.isShowModal} handleTableSendAction={this._getTableList} />
        <AuditDetail key='auditDetail' isShowDetailModal={this.props.isShowDetailModal} />
      </JcContent>
    )
  }
}

const mapDispatchToProps = dispatch => ({ dispatch })
const mapStateToProps = state => {
  return {
    AuditShoplist: state.globalReduck.list,
    isLoading: state.globalReduck.isLoading,
    currentPage: state.globalReduck.currentPage,
    pageSize: state.globalReduck.pageSize,
    total: state.globalReduck.total,
    isShowModal: state.auditShopReduck.isShowModal,
    isShowDetailModal: state.auditShopReduck.isShowDetailModal
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AuditShopList))
