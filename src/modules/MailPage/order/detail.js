import React from 'react'
import { Row, Col, Card, Table } from 'antd'
import * as actions from './reduck'
import { connect } from 'react-redux'
import { JcDisplayItem } from '../../components/styleComponents'
import { newOrderStatus } from 'Global/bizdictionary'
import noPic from 'Assets/images_mall/no-image.png'
import moment from 'moment'

class OrderDetail extends React.Component {
  state = {
    orderNo: this.props.match.match.params.orderNo
  }

  componentDidMount() {
    this.props.dispatch(actions.getOrderDetail({ orderNo: this.state.orderNo }))
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
      title: '商品图片',
      dataIndex: 'img',
      render: text => {
        return <img src={text || noPic} style={{ width: 50, height: 50 }} />
      }
    },
    {
      title: '商品名称',
      dataIndex: 'name'
    },
    {
      title: '销售价格(元)',
      dataIndex: 'price'
    },
    {
      title: '属性',
      dataIndex: 'scale',
      render: text => {
        return <span>{text && text.length > 0 && text.join(',')}</span>
      }
    },
    {
      title: '数量',
      dataIndex: 'num'
    },
    {
      title: '合计(元)',
      dataIndex: 'goodsPrice',
    }
  ]

  render() {
    const { orderDetail } = this.props

    return (
      <Row>
        <Card bordered={false} title={<h1>{`单号:${this.state.orderNo}`}</h1>} style={{ marginBottom: '20px' }}>
          <Row>
            <Col span={8}>
              <JcDisplayItem label='下单人员' text={orderDetail.name ? orderDetail.name : orderDetail.mobileNo} />
            </Col>
            <Col span={8}>
              <JcDisplayItem label='联系方式' text={orderDetail.mobileNo} />
            </Col>
            <Col span={8}>
              <JcDisplayItem label='下单时间' text={orderDetail.dateCreated && moment(orderDetail.dateCreated).format('YYYY-MM-DD HH:mm:ss')} />
            </Col>
            <Col span={8}>
              <JcDisplayItem label='订单状态' text={newOrderStatus[orderDetail.orderStatus]} />
            </Col>
            <Col span={8}>
              <JcDisplayItem label='支付方式' text={orderDetail.payType} />
            </Col>
            <Col span={8}>
              <JcDisplayItem label='支付时间' text={orderDetail.payTime && moment(orderDetail.payTime).format('YYYY-MM-DD HH:mm:ss')} />
            </Col>
          </Row>
        </Card>
        <Card bordered={false} title='商品信息' style={{ marginBottom: '20px' }}>
          <Table
            bordered
            rowKey={(item, index) => index}
            columns={this._columns}
            dataSource={orderDetail.goods && orderDetail.goods.map(item => ({ ...item, goodsPrice: item.goodsPrice && item.goodsPrice.toFixed(2), price: item.price && item.price.toFixed(2) }))}
            pagination={false}
          />
          <Row style={{ marginTop: '15px', float: 'right' }}>
            <JcDisplayItem extraClass='jc-amount-container' textAlign='right' label='商品总额' text={!(orderDetail.goodsAmount) ? '0\t元' : (orderDetail.goodsAmount.toFixed(2) + '\t元') || ''} />
            <div style={{ textAlign: 'right', fontSize: 20, color: '#FD5729' }}>
              <span style={{ marginRight: 20 }}>实付金额:</span>
              <span>{(!(orderDetail.amount) ? '0\t元' : (orderDetail.amount.toFixed(2) + '\t元')) || ''}</span>
            </div>
          </Row>
        </Card>
      </Row>
    )
  }
}

const mapStateToProps = state => {
  return {
    orderDetail: state.order.detail,
  }
}

export default connect(mapStateToProps)(OrderDetail)
