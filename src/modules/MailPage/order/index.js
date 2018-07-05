import React from 'react'
import { Table } from 'antd'
import { connect } from 'react-redux'
import * as actions from './reduck'
import * as urls from 'Global/urls'
// import * as urls from 'Global/routepath'
import { Link } from 'react-router-dom'
import { JcContent, JcFilter } from '../../components/styleComponents'
import { newOrderStatus, orderStatusFilter } from 'Global/bizdictionary'
import moment from 'moment'

class Order extends React.Component {

  state = {
    queryData: {}
  }

  componentWillMount () {
    const args = this.props.filterData
    this._getOrderInfo(args, args.currentPage)
    this.props.dispatch(actions.getShopList())
  }

  componentWillUnmount () {
    if (!location.pathname.startsWith(urls.ORDER)) {
      this.props.dispatch(actions.getList({ data: { data: [] }, filter: {}}))
    }
  }

  _getOrderInfo = (value, currentPage = 1, pageSize = 10) => {
    const args = {
      orderNo: value.orderNo || '',
      userMobile: value.userMobile || '', // 下单人
      shopId: value.shopId || '',
      orderTimeStart: value.orderTime && value.orderTime.length > 0 ? value.orderTime[0].format('YYYY-MM-DD HH:mm:ss') : value.orderTimeStart,
      orderTimeEnd: value.orderTime && value.orderTime.length > 0 ? value.orderTime[1].format('YYYY-MM-DD HH:mm:ss') : value.orderTimeEnd,
      orderStatus: value.orderStatus || '',
      currentPage,
      pageSize
    }
    this.setState({ queryData: args }, () => {
      this.props.dispatch(actions.getOrderList(this.state.queryData))
    })
  }

  _handlePagination = page => {
    this._getOrderInfo(this.state.queryData, page)
  }

  _columns = [
    {
      title: '序号',
      dataIndex: 'rowNo',
      render: (text, row, index) => {
        return Number(index) + 1
      }
    },
    {
      title: '订单号',
      dataIndex: 'orderNo'
    },
    {
      title: '订单金额(元)',
      dataIndex: 'orderAmount',
      render: value => {
        return value && value.toFixed(2)
      }
    },
    {
      title: '下单时间',
      dataIndex: 'dateCreated',
      render: text => {
        return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
      }
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      render: text => {
        return <span>{newOrderStatus[text]}</span>
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <Link to={`${urls.ORDER}/detail/${record.orderNo}`}>
            详情
          </Link>
        )
      }
    },
  ]

  _getShopList = (idList, nameList) => {
    const shopList = {}
    for (let i = 0; i < idList.length; i++) {
      if (nameList) {
        shopList[idList[i]] = nameList[i]
      } else {
        shopList[idList[i][0]] = idList[i][1]
      }
    }
    return shopList
  }

  render() {
    const data = this.props.listData
    const filterData = this.props.filterData
    const getShopList = this.props.shopList
    const idList = getShopList.map(item => item.shopId)
    const nameList = getShopList.map(item => item.shopName)

    const fields = [
      {
        fieldName: 'orderNo',
        label: '订单号',
        componentType: 'Input',
        initialValue: filterData.orderNo || undefined
      },
      {
        fieldName: 'orderStatus',
        label: '订单状态',
        componentType: 'Select',
        dictionary: orderStatusFilter,
        initialValue: filterData.orderStatus || undefined
      },
      {
        fieldName: 'shopId',
        label: '店铺名称',
        componentType: 'Select',
        dictionary: this._getShopList(idList, nameList),
        initialValue: filterData.shopId || undefined
      },
      {
        fieldName: 'userMobile',
        label: '下单人',
        componentType: 'Input',
        initialValue: filterData.userMobile || undefined
      },
      {
        fieldName: 'orderTime',
        label: '下单时间',
        componentType: 'RangePicker',
        initialValue: filterData.orderTimeStart && filterData.orderTimeEnd
          ? [filterData.orderTimeStart, filterData.orderTimeEnd]
          : []
      }
    ]

    const buttons = [
      {
        desc: '查询',
        type: 'action',
        btnType: 'primary',
        onClick: this._getOrderInfo
      },
    ]

    return (
      <JcContent>
        <JcFilter fields={fields} buttons={buttons} />
        <Table
          columns={this._columns}
          dataSource={data.data}
          rowKey={(item, index) => index}
          bordered={true}
          pagination = {{
            current: data.pageNo,
            total: data.records,
            pageSize: data.pageSize,
            showTotal: total => `总共 ${data.records} 条`,
            onChange: this._handlePagination,
            showQuickJumper: true
          }}
        />
      </JcContent>
    )
  }
}

const mapStateToProps = state => {
  return {
    listData: state.order.list || { data: { data: [] }},
    filterData: state.order.filterData,
    shopList: state.order.shopList
  }
}

export default connect(mapStateToProps)(Order)
