import React from 'react'
import { JcContent, JcFilter } from '../../components/styleComponents'
import { connect } from 'react-redux'
import * as urls from 'Global/urls'
// import * as urls from 'Global/routepath'
import { Link } from 'react-router-dom'
import { Table } from 'antd'
import { getShopAddList } from './reduck'

class ShopAddList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {
    const { filter } = this.props
    this._getShopAddList(filter, filter.currentPage)
  }

  _getShopAddList = (values, currentPage = 1) => {
    const args = {
      shopId: values.shopId || '',
      shopName: values.shopName || '',
      currentPage,
      pageSize: 10
    }
    this.props.dispatch(getShopAddList(args))
  }

  render() {
    const { shopAddList, records, pageSize, pageNo, filter } = this.props
    const fields = [
      {
        label: '店铺ID',
        fieldName: 'shopId',
        componentType: 'Input',
        initialValue: filter.shopId || ''
      },
      {
        label: '店铺名称',
        fieldName: 'shopName',
        componentType: 'Input',
        initialValue: filter.shopName || ''
      }
    ]
    const buttons = [
      {
        desc: '查询',
        type: 'action',
        btnType: 'primary',
        onClick: this._getShopAddList
      }
    ]
    const columns = [
      {
        title: '店铺ID',
        dataIndex: 'shopId',
        key: 'shopId',
        width: 70,
      }, {
        title: '店铺名称',
        dataIndex: 'shopName',
        key: 'shopName',
        width: 70,
      }, {
        title: '店主电话',
        dataIndex: 'ownerPhone',
        key: 'ownerPhone',
        width: 70,
      }, {
        title: '店主姓名',
        dataIndex: 'owner',
        key: 'owner',
        width: 70,
      }, {
        title: '操作',
        dataIndex: 'active',
        key: 'active',
        width: 70,
        render: (text, record) => {
          return record.isAdd === '0' ? (
            <span>
              <Link
                to={`${urls.SHOP_ADD_DETAIL}/${record.shopId}/${record.shopName || ''}/${record.ownerPhone || ''}/${record.owner || ''}`}
              >
                店铺信息
              </Link>
            </span>
          ) : (
            <span>已添加</span>
          )
        }
      }
    ]
    return (
      <JcContent>
        <JcFilter fields={fields} buttons={buttons} />
        <Table
          rowKey={record => record.shopId}
          columns={columns}
          dataSource={shopAddList}
          pagination={{
            current: pageNo,
            total: records,
            pageSize: pageSize,
            showTotal: records => `总共 ${records} 条`,
            onChange: (pageNo) => this._getShopList(filter, pageNo),
            showQuickJumper: true
          }}
        />
      </JcContent>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    shopAddList: state.shop.shopAddList && state.shop.shopAddList.data,
    total: state.shop.shopAddList && state.shop.shopAddList.records,
    limit: state.shop.shopAddList && state.shop.shopAddList.pageSize,
    pages: state.shop.shopAddList && state.shop.shopAddList.pages,
    currPageNo: state.shop.shopAddList && state.shop.shopAddList.pageNo,
    filter: state.shop.shopAddList && state.shop.shopAddList.filter,
    preRouter: state.router.pre,
  }
}

export default connect(mapStateToProps)(ShopAddList)
