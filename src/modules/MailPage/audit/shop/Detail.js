import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Divider } from 'antd'
import DescriptionList from '../../../components/DescriptionList'

const { Description } = DescriptionList

const businessTypeList = {
  '1': '商城',
  '2': '商超'
}

const baseInfo = {
  idName: '店铺ID',
  shopName: '店铺名称',
  businessType: '业务类型'
}

const shopkeeperInfo = {
  name: '姓名',
  phone: '手机号码'
}

class Detail extends Component {
  static defaultProps = {
    shopId: '',
    shopName: '',
    businessTypeList: [],
    owner: '',
    ownerPhone: '',
  }
  render() {
    return [
      <DescriptionList size='large' key='baseInfo' title='基础信息' style={{ marginBottom: 32 }}>
        <Description term={baseInfo.idName}>{this.props.shopId}</Description>
        <Description term={baseInfo.shopName}>{this.props.shopName}</Description>
        <Description term={baseInfo.businessType}>
          {this.props.businessTypeList.map(item => businessTypeList[item]).join(',')}
        </Description>
      </DescriptionList>,
      <Divider key='Divider_01' style={{ marginBottom: 32 }} />,
      <DescriptionList key='shopkeeperInfo' size='large' title='店主信息' style={{ marginBottom: 32 }}>
        <Description term={shopkeeperInfo.name}>{this.props.owner}</Description>
        <Description term={shopkeeperInfo.phone}>{this.props.ownerPhone}</Description>
      </DescriptionList>
    ]
  }
}

const mapDispatchToProps = dispatch => ({ dispatch })
const mapStateToProps = state => {
  return {
    shopId: state.auditShopReduck.shopId,
    shopName: state.auditShopReduck.shopName,
    businessTypeList: state.auditShopReduck.businessTypeList,
    owner: state.auditShopReduck.owner,
    ownerPhone: state.auditShopReduck.ownerPhone
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail)
