import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Divider, Table } from 'antd'

import DescriptionList from '../../../components/DescriptionList'
import './styles.css'

const { Description, Describe } = DescriptionList

const baseInfo = {
  goodsName: '商品名称',
  goodsSubName: '商品副标题',
  type: '所属类目',
  price: '销售价格',
  stock: '总库存',
  unit: '单位',
  imageUrl: '商品图'
}
const goodsDetail = {
  tips: '购买须知',
  detail: '图文详情'
}
class Detail extends Component {
  static defaultProps = {
    goodsId: '',
    spuId: '',
    goodsTitle: '',
    goodsSubTitle: '',
    sort: '',
    categoryName: '',
    price: '',
    stock: '',
    auditStatus: '',
    unit: '',
    imageUrl: '',
    column: [],
    table: [],
    propertyPull: [],
    item: [],
    goodsImage: [],
    detail: [],
    tips: ''
  }
  render() {
    return [
      <DescriptionList size='large' key='baseInfo' title='基础信息' style={{ marginBottom: 32 }}>
        <Description term={baseInfo.goodsName}>{this.props.goodsTitle}</Description>
        <Description term={baseInfo.goodsSubName}>{this.props.goodsSubTitle}</Description>
        <Description term={baseInfo.type}>{this.props.categoryName}</Description>
        <Description term={baseInfo.price}>{`${this.props.price && this.props.price.toFixed(2)}`}</Description>
        <Description term={baseInfo.stock}>{`${this.props.stock}`}</Description>
        <Description term={baseInfo.unit}>{this.props.unit}</Description>
      </DescriptionList>,
      <div key='goodsImages' className='goodsDetailImg'>
        {this.props.goodsImage.map((item, index) => (
          <img className='goodsImg' width='100px' height='100px' key={index} src={item} />
        ))}
      </div>,
      <Divider key='Divider_goods_01' style={{ marginBottom: 32 }} />,
      <div key='kuc' className='audit-title'>
        库存/属性
      </div>,
      <Table
        style={{ marginBottom: 32 }}
        key='shuxing'
        bordered={true}
        pagination={false}
        dataSource={this.props.table.map(item => ({ ...item, price: item.price && item.price.toFixed(2) }))}
        columns={this.props.column}
        rowKey='id'
      />,
      <Divider key='Divider_goods_001' style={{ marginBottom: 32 }} />,
      <DescriptionList size='large' key='goodsDetail' title='商品详情' col='1' style={{ marginBottom: 32 }}>
        <Describe term={goodsDetail.tips}>{this.props.tips}</Describe>
      </DescriptionList>,
      <Divider key='Divider_goods_02' style={{ marginBottom: 32 }} />,
      <div key='goodsDetailTitle' className='audit-title'>
        {goodsDetail.detail}
      </div>,
      <div key='goodsDetailImg' className='goodsDetailImg'>
        {this.props.detail.map((item, index) => (
          <img className='goodsImg' width='100px' height='100px' key={index} src={item} />
        ))}
      </div>
    ]
  }
}

const mapDispatchToProps = dispatch => ({ dispatch })
const mapStateToProps = state => {
  return {
    goodsId: state.auditGoodsReduck.goodsId,
    spuId: state.auditGoodsReduck.spuId,
    goodsTitle: state.auditGoodsReduck.goodsTitle,
    goodsSubTitle: state.auditGoodsReduck.goodsSubTitle,
    sort: state.auditGoodsReduck.sort,
    categoryName: state.auditGoodsReduck.categoryName,
    price: state.auditGoodsReduck.price,
    stock: state.auditGoodsReduck.stock,
    auditStatus: state.auditGoodsReduck.auditStatus,
    unit: state.auditGoodsReduck.unit,
    imageUrl: state.auditGoodsReduck.imageUrl,
    column: state.auditGoodsReduck.column,
    table: state.auditGoodsReduck.table,
    propertyPull: state.auditGoodsReduck.propertyPull,
    item: state.auditGoodsReduck.item,
    goodsImage: state.auditGoodsReduck.goodsImage,
    detail: state.auditGoodsReduck.detail,
    tips: state.auditGoodsReduck.tips
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail)
