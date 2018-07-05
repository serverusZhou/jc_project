import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Modal, Spin } from 'antd'

import { genPlanColumn, genPagination, genSelectColumn } from 'Utils/helper'
import { isEmpty } from 'Utils/lang'
import Filter from 'Components/Filter'
import { showModalWrapper } from 'Components/modal/ModalWrapper'

import { orderList, refund } from './reduck'
import { OrderType, RefundStatus } from '../dict'

class Order extends Component {
  
  state = {
    modalVisible: false
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(orderList({ pageSize: 10, currentPage: 1 }))
  }

  _goodsColumns = [
    genPlanColumn('name', '商品名称'),
    genPlanColumn('num', '数量'),
    genPlanColumn('price', '单价'),
  ]

  GoodsDetail = (props) => {
    return (
      <Table
        pagination={false}
        columns={this._goodsColumns}
        rowKey='goodsNo'
        dataSource={props.dataSource}
      />
    )
  }

  _handleDetail = goods => {
    const GoodsDetail = this.GoodsDetail
    showModalWrapper((
      <GoodsDetail
        dataSource={goods}
      />
    ), {
      title: '查看明细',
      width: 600
    })
  }

  _handleRefund = (orderDesc) => {
    const { dispatch } = this.props
    this.setState({ modalVisible: true })
    dispatch(refund({ orderId: orderDesc })).then(res => {
      if (res.status === 'success') {
        this._handleSearch({})
      }
      this.setState({ modalVisible: false })
    })
  }

  _columns = [
    genPlanColumn('typeStr', '标单类型'),
    genPlanColumn('sourceStr', '标单业务来源'),
    genPlanColumn('newPlatformStr', '标单新下单平台'),
    genPlanColumn('businessTypeStr', '标单业务类型'),
    genPlanColumn('orderNo', '订单编号', { width: '250px' }),
    genPlanColumn('orderDesc', '缴费单号'),
    genPlanColumn('rechargeStatus', '缴费状态'),
    genPlanColumn('orderStatusStr', '订单状态'),
    genPlanColumn('orderAmount', '应收金额'),
    genPlanColumn('discountAmount', '优惠金额'),
    genPlanColumn('amount', '实收金额'),
    genPlanColumn('refundAmount', '退款金额'),
    genPlanColumn('refundNo', '退款编号'),
    genSelectColumn('refundStatus', '退款状态', RefundStatus),
    genPlanColumn('dateCreatedStr', '下单时间'),
    genPlanColumn('payTimeStr', '支付时间'),
    genPlanColumn('refundTime', '退款时间'),
    genPlanColumn('orderDetail', '操作', {
      fixed: 'right',
      render: (text, record) => {
        return (
          <div>
            <a onClick={() => this._handleDetail(record.goods)} style={{ marginRight: '5px' }}>查看明细</a>
            {
              record.isRefund === 1 &&
              <a onClick={() => { this._handleRefund(record.orderDesc) }} >退款</a>
            }
          </div>
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
        orderNo: searchData.orderNo && searchData.orderNo.trim(),
        refundOrderNo: searchData.refundOrderNo && searchData.refundOrderNo.trim()
      })
    finalFilter['dateFrom'] = !isEmpty(finalFilter['orderTime']) ? moment(finalFilter['orderTime'][0]).format('YYYY-MM-DD HH:mm:ss') : ''
    finalFilter['dateTo'] = !isEmpty(finalFilter['orderTime']) ? moment(finalFilter['orderTime'][1]).format('YYYY-MM-DD HH:mm:ss') : ''
    this.props.dispatch(orderList(finalFilter))
  }

  _handleChange = (pagination, filters, sorter) => {
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    finalFilter['dateFrom'] = !isEmpty(finalFilter['orderTime']) ? moment(finalFilter['orderTime'][0]).format('YYYY-MM-DD HH:mm:ss') : ''
    finalFilter['dateTo'] = !isEmpty(finalFilter['orderTime']) ? moment(finalFilter['orderTime'][1]).format('YYYY-MM-DD HH:mm:ss') : ''
    dispatch(orderList(finalFilter))
  }

  _handleAdd = () => {

  }

  _genFilterFields = (filter) => {
    // const {  } = this.props
    const fields = [
      {
        key: 'orderNo',
        label: '订单编号',
        initialValue: filter['orderNo'],
        type: 'Input',
      },
      // {
      //   key: 'orderStatus',
      //   label: '订单状态',
      //   initialValue: filter['orderStatus'] || '',
      //   type: 'Select',
      //   content: OrderStatus
      // },
      {
        key: 'type',
        label: '订单类型',
        initialValue: filter['type'] || '',
        type: 'Select',
        content: OrderType
      },
      // {
      //   key: 'refundOrderNo',
      //   label: '退款编号',
      //   initialValue: filter['refundOrderNo'],
      //   type: 'Input',
      // },
      {
        key: 'orderTime',
        label: '下单时间',
        initialValue: [],
        type: 'RangePicker',
        exProps: {
          showTime: true,
          format: 'YYYY-MM-DD HH:mm:ss',
        },
      },
      // {
      //   key: 'mobile',
      //   label: '手机号',
      //   initialValue: filter['mobile'],
      //   type: 'Input',
      // },
      // {
      //   key: 'payTime',
      //   label: '支付时间',
      //   initialValue: [],
      //   type: 'RangePicker',
      // },
      // {
      //   key: 'refundTime',
      //   label: '退款时间',
      //   initialValue: [],
      //   type: 'RangePicker',
      // },
    ]

    return fields
  }

  render() {
    const { showListSpin, list, filter, page } = this.props
    const fields = this._genFilterFields(filter)
    const pagination = genPagination(page)
    const { modalVisible } = this.state
    return (
      <div>
        <Filter
          fields={fields}
          onSearch={this._handleSearch}
        />
        <Table
          pagination={pagination}
          columns={this._columns}
          onChange={this._handleChange}
          dataSource={list}
          rowKey='orderNo'
          loading={showListSpin}
          scroll={{ x: 1780 }}
        />
        <Modal
          visible={modalVisible}
          footer={null}
          closable={false}
          maskClosable={false}
          title=''
          style={{ textAlign: 'center' }}
        >
          <Spin tip='正在退款，请稍后...' />
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,

    list: state.operate.order.orderList,
    filter: state.operate.order.orderFilter,
    page: state.operate.order.orderPage,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Order)
