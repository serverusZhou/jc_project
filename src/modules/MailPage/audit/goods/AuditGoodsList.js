import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Table, Tabs, message, Badge } from 'antd'

import { PAGE_SIZE, PAG_CONFIG } from 'Global/globalConfig'
import * as globalReduck from 'Global/globalReduck'
import * as reduck from './reduck'
import Audit from './Audit'
import AuditDetail from './AuditDetail'
import { JcContent } from '../../../components/styleComponents'
import { auditStatus } from 'Global/bizdictionary'

class AuditGoodsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeKey: '2'
    }
  }
  static defaultProps = {
    AuditGoodslist: [],
    pageSize: PAGE_SIZE,
    currentPage: 1,
    total: 0,
    status: '2',
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
      title: '商品ID',
      key: 'spuId',
      dataIndex: 'spuId'
    },
    {
      title: '商品主图',
      key: 'imageUrl',
      dataIndex: 'imageUrl',
      render: text => <img width='50px' height='50px' src={text} />
    },
    {
      title: '商品名称',
      key: 'goodsTitle',
      dataIndex: 'goodsTitle',
      width: 160
    },
    {
      title: '所属类目',
      key: 'categoryName',
      dataIndex: 'categoryName',
    },
    {
      title: '价格（元)',
      key: 'price',
      dataIndex: 'price',
      render: value => {
        return value && value.toFixed(2)
      }
    },
    {
      title: '库存',
      key: 'stock',
      dataIndex: 'stock'
    },
    {
      title: '审核状态',
      key: 'auditStatus',
      dataIndex: 'auditStatus',
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
          <a href='javascript:void(0);' onClick={() => this._handleAudit(row.goodsId)}>
            审核
          </a>
        )
      }
    }
  ]
  _auditedColumns = [
    {
      title: '审核人',
      key: 'auditUser',
      dataIndex: 'auditUser'
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
          <a href='javascript:void(0);' onClick={() => this._handleDetail(row.goodsId)}>
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

  _getArg = (status = this.state.mode, currentPage = this.props.currentPage, pageSize = this.props.pageSize) => {
    return {
      auditStatus: status,
      pageNo: currentPage,
      pageSize: pageSize
    }
  }

  _handleAudit = goodsId => {
    this.props.dispatch(reduck.showModalAction(true))
    this._handleDetailData(goodsId)
  }

  _handleDetail = goodsId => {
    this.props.dispatch(reduck.showModalDetailAction(true))
    this._handleDetailData(goodsId)
  }

  _handleDetailData = async goodsId => {
    let response = await this.props.dispatch(reduck.getGoodsDetail({ goodsId: goodsId }))
    this._handleDetailSendAction(response)
  }

  _handleDetailSendAction = res => {
    if (res.code === 0) {
      const data = {
        goodsId: res.data.goodsId,
        spuId: res.data.spuId,
        goodsTitle: res.data.goodsTitle,
        goodsSubTitle: res.data.goodsSubTitle,
        sort: res.data.sort,
        categoryName: res.data.categoryName,
        price: res.data.price,
        stock: res.data.stock,
        unit: res.data.unit,
        imageUrl: res.data.imageUrl,
        column: res.data.property.column,
        table: res.data.property.table.map((item, index) => {
          item.id = index
          Object.keys(item).some(key => {
            if (key.startsWith('property')) {
              item[key] = item[key].value
            }
          })
          return item
        }),
        propertyPull: res.data.propertyPull,
        item: res.data.item,
        goodsImage: res.data.goodsImage,
        detail: res.data.detail,
        tips: res.data.tips,
        auditTime: res.data.auditTime,
        auditUser: res.data.auditUser,
        auditMessage: res.data.auditMessage,
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
    let response = await this.props.dispatch(reduck.getGoodsList(this._getArg(status, currentPage, pageSize)))
    this._handleTableSendAction(response)
  }

  render() {
    return (
      <JcContent>
        <Tabs defaultActiveKey={this.state.activeKey} onChange={this._handleSwitchTab} type='line'>
          <Tabs.TabPane tab='待审' key='2'>
            <Table
              columns={[...this._columns, ...this._unauditedColumns]}
              rowKey='goodsId'
              key='list'
              dataSource={this.props.AuditGoodsList}
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
          <Tabs.TabPane tab='已审' key='3'>
            <Table
              columns={[...this._columns, ...this._auditedColumns]}
              rowKey='goodsId'
              key='list'
              dataSource={this.props.AuditGoodsList}
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
        <Audit key='detail' isShowModal={this.props.isShowModal} getTableList={this._getTableList} />
        <AuditDetail key='auditDetail' isShowDetailModal={this.props.isShowDetailModal} />
      </JcContent>
    )
  }
}

const mapDispatchToProps = dispatch => ({ dispatch })
const mapStateToProps = state => {
  return {
    AuditGoodsList: state.globalReduck.list,
    isLoading: state.globalReduck.isLoading,
    currentPage: state.globalReduck.currentPage,
    pageSize: state.globalReduck.pageSize,
    total: state.globalReduck.total,
    isShowModal: state.auditGoodsReduck.isShowModal,
    isShowDetailModal: state.auditGoodsReduck.isShowDetailModal
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AuditGoodsList))
