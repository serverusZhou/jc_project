import React from 'react'
import { JcContent, JcFilter } from '../../components/styleComponents'
import { connect } from 'react-redux'
import * as urls from 'Global/urls'
// import * as urls from 'Global/routepath'
import { Link } from 'react-router-dom'
import { Popconfirm, Divider, Button, Tooltip, Icon, Badge } from 'antd'
import { getShopList, setShopList, updateShopStatus, submitAudit, cancelAudit, deleteShop } from './reduck'
import { ShopStatus, ShopAuditStatus, ShopType, BusinessTypes } from 'Global/bizdictionary'
import StandardTable from '../../components/StandardTable'
import { isEmpty } from 'Utils/lang'
import '../style.less'

class ShopList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: []
    }
  }

  componentWillMount() {
    const { filter } = this.props
    this._getShopList(filter, filter.currentPage)
  }

  componentWillUnmount() {
    if (!location.pathname.startsWith(urls.SHOP_LIST)) {
      this.props.dispatch(setShopList({ data: [], records: 0, pageSize: 10, pages: 1, pageNo: 1, filter: { currentPage: 1 }}))
    }
  }

  _getShopList = (values, currentPage = 1) => {
    const args = {
      shopId: values.shopId || '',
      shopName: values.shopName || '',
      businessType: values.businessType || '',
      currentPage,
      pageSize: 10
    }
    this.props.dispatch(getShopList(args))
  }

  _updateShopStatus = (shopStatus, shopId) => {
    const args = {
      shopId,
      shopStatus: shopStatus === '1' ? '2' : '1'
    }
    this.props.dispatch(updateShopStatus(args))
  }

  _submitAudit = shopId => {
    this.props.dispatch(submitAudit({ shopIdList: [shopId] }))
  }

  _batchSubmitAudit = () => {
    this.props.dispatch(submitAudit({ shopIdList: this.state.selectedRowKeys }))
      .then(res => {
        if (res) {
          this.setState({
            selectedRowKeys: []
          })
        }
      })
  }

  _cancelAudit = shopId => {
    this.props.dispatch(cancelAudit({ shopId }))
  }

  _onSelectChange = (selectedRows, selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  _deleteShop = shopId => {
    this.props.dispatch(deleteShop({ shopId }))
  }

  render() {
    const { shopList, records, pageSize, pageNo, filter } = this.props
    const { selectedRowKeys } = this.state
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
      },
      {
        label: '业务类型',
        fieldName: 'businessType',
        componentType: 'Select',
        dictionary: BusinessTypes,
        initialValue: filter.businessType || ''
      }
    ]
    const buttons = [
      {
        desc: '查询',
        type: 'action',
        btnType: 'primary',
        onClick: this._getShopList
      }
    ]
    const columns = [
      {
        title: '店铺ID',
        dataIndex: 'shopId',
        key: 'shopId',
        width: 80,
      }, {
        title: '店铺名称',
        dataIndex: 'shopName',
        key: 'shopName',
        width: 80,
      }, {
        title: '店铺类型',
        dataIndex: 'shopType',
        key: 'shopType',
        width: 70,
        render: (text) => {
          return ShopType[text]
        }
      }, {
        title: '业务类型',
        dataIndex: 'businessTypeList',
        key: 'businessTypeList',
        width: 70,
        render: (businessTypeList) => {
          return businessTypeList.map(businessType => BusinessTypes[businessType]).toString()
        }
      }, {
        title: '上下架状态',
        dataIndex: 'shopStatus',
        key: 'shopStatus',
        width: 30,
        render: (text, record) => {
          return ShopStatus[text]
        }
      }, {
        title: '店铺状态',
        dataIndex: 'auditStatus',
        key: 'auditStatus',
        width: 30,
        render: (auditStatus, record) => {
          if (auditStatus === '1') {
            return <Badge status='warning' text={ShopAuditStatus[auditStatus]} />
          } else if (auditStatus === '2') {
            return <Badge status='processing' text={ShopAuditStatus[auditStatus]} />
          } else if (auditStatus === '3') {
            return <Badge status='success' text={ShopAuditStatus[auditStatus]} />
          } else if (auditStatus === '4') {
            return (
              <span>
                <Badge status='error' text={ShopAuditStatus[auditStatus]} />
                <Tooltip
                  placement='bottom'
                  title={isEmpty(record.unapprovedReason) ? '拒绝原因：暂无' : <p className='tip-title'>拒绝原因:{record.unapprovedReason}</p>}
                >
                  <Icon
                    style={{ color: 'red' }}
                    type='question-circle'
                  />
                </Tooltip>
              </span>
            )
          }
        }
      }, {
        title: '操作',
        dataIndex: 'active',
        key: 'active',
        width: 140,
        render: (text, record) => {
          return (
            <span>
              {
                record.auditStatus === '3' && (
                  <span>
                    <Link to={`${urls.SHOP_BIND_GOODS}/${record.shopId}`}>
                      绑定商品
                    </Link>
                    <Divider type='vertical' />
                  </span>
                )
              }
              <Link to={`${urls.SHOP_DETAIL}/${record.shopId}`}>
                详情
              </Link>
              <Divider type='vertical' />
              {
                record.auditStatus === '3' && (
                  <span>
                    <Popconfirm
                      placement='bottom'
                      title={`确定要${record.shopStatus === '1' ? '下线' : '上线'}吗？`}
                      onConfirm={() => this._updateShopStatus(record.shopStatus, record.shopId)}
                      okText='确定'
                      cancelText='取消'
                    >
                      <a>{record.shopStatus === '1' ? '下线' : '上线'}</a>
                    </Popconfirm>
                    <Divider type='vertical' />
                  </span>
                )
              }
              {
                record.auditStatus === '2' && (
                  <span>
                    <Popconfirm
                      placement='bottom'
                      title={'确定要撤销审核吗？'}
                      onConfirm={() => this._cancelAudit(record.shopId)}
                      okText='确定'
                      cancelText='取消'
                    >
                      <a>撤销</a>
                    </Popconfirm>
                    <Divider type='vertical' />
                  </span>
                )
              }
              {
                (record.auditStatus === '1' || record.auditStatus === '4') && (
                  <span>
                    <a onClick={() => this._submitAudit(record.shopId)}>
                      提审
                    </a>
                    <Divider type='vertical' />
                  </span>
                )
              }
              {
                record.auditStatus !== '2' && (
                  <span>
                    <Popconfirm
                      placement='bottom'
                      title={`确定要删除该店铺吗？`}
                      onConfirm={() => this._deleteShop(record.shopId)}
                      okText='确定'
                      cancelText='取消'
                    >
                      <a>删除</a>
                    </Popconfirm>
                  </span>
                )
              }
            </span>
          )
        }
      }
    ]

    const pagination = {
      current: pageNo,
      total: records,
      pageSize: pageSize,
      showTotal: records => `总共 ${records} 条`,
      onChange: (pageNo) => this._getShopList(filter, pageNo),
      showQuickJumper: true
    }
    return (
      <JcContent>
        <JcFilter fields={fields} buttons={buttons} />
        <div style={{ marginBottom: '20px' }}>
          <Button
            type={'primary'}
            onClick={() => this.props.match.history.push(urls.SHOP_ADD_LIST)}
          >
            新增
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            disabled={selectedRowKeys.length === 0}
            onClick={this._batchSubmitAudit}
          >
            批量提审
          </Button>
        </div>
        <StandardTable
          selectedRows={selectedRowKeys}
          data={{ list: shopList, pagination }}
          rowKey={record => record.shopId}
          message={''}
          columns={columns}
          onSelectRow={this._onSelectChange}
        />
      </JcContent>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    shopList: state.shop.shopList && state.shop.shopList.data,
    records: state.shop.shopList && state.shop.shopList.records,
    pageSize: state.shop.shopList && state.shop.shopList.pageSize,
    pages: state.shop.shopList && state.shop.shopList.pages,
    pageNo: state.shop.shopList && state.shop.shopList.pageNo,
    filter: state.shop.shopList && state.shop.shopList.filter,
    preRouter: state.router.pre,
  }
}

export default connect(mapStateToProps)(ShopList)
