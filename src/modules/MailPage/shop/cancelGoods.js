import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { getGoodsList, bindingGoods } from './reduck'
import StandardTable from '../../components/StandardTable'

class BindGoods extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      loading: false,
    }
  }

  _getGoodsList = (values, currentPage = 1) => {
    const args = {
      shopId: values.shopId || '',
      bindFlag: values.bindFlag || 'Y',
      goodsTitle: values.goodsTitle || '',
      categoryFrontId: values.categoryFrontId || '',
      currentPage,
      pageSize: 10
    }
    this.props.dispatch(getGoodsList(args))
  }

  _start = () => {
    this.setState({ loading: true })
    let goodsIdList = []
    this.state.selectedRowKeys.length > 0 && this.state.selectedRowKeys.map(e => {
      goodsIdList.push(e.goodsId)
    })
    const args = {
      operationType: 2,
      shopId: this.props.filter.shopId,
      goodsIdList: goodsIdList
    }
    this.props.dispatch(bindingGoods(args, this.props.filter), this.setState({
      selectedRowKeys: [],
      loading: false,
    }))
  }

  _onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  render() {
    const { loading, selectedRowKeys } = this.state
    const hasSelected = selectedRowKeys.length > 0

    const { goodsList, records, pageSize, pageNo, filter } = this.props
    const columns = [
      {
        title: '商品ID',
        dataIndex: 'goodsId',
        key: 'goodsId',
      }, {
        title: '商品名称',
        dataIndex: 'goodsTitle',
        key: 'goodsTitle',
      }, {
        title: '商品类目',
        dataIndex: 'categoryName',
        key: 'categoryName',
      }, {
        title: '销售价格（元）',
        dataIndex: 'price',
        key: 'price',
      }
    ]
    const pagination = {
      current: pageNo,
      total: records,
      pageSize: pageSize,
      showTotal: records => `总共 ${records} 条`,
      onChange: (pageNo) => this._getGoodsList(filter, pageNo),
      showQuickJumper: true
    }
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button
            type={'primary'}
            onClick={this._start}
            disabled={!hasSelected}
            loading={loading}
          >
            取消绑定
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `已选择 ${selectedRowKeys.length} 个商品` : ''}
          </span>
        </div>
        <StandardTable
          selectedRows={selectedRowKeys}
          data={{ list: goodsList.map(item => ({ ...item, price: item.price && item.price.toFixed(2) })), pagination }}
          rowKey={record => record.shopId}
          message={''}
          columns={columns}
          onSelectRow={this._onSelectChange}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    treeData: state.shop.treeData,
    goodsList: state.shop.goodsList && state.shop.goodsList.data,
    records: state.shop.goodsList && state.shop.goodsList.records,
    pageSize: state.shop.goodsList && state.shop.goodsList.pageSize,
    pages: state.shop.goodsList && state.shop.goodsList.pages,
    pageNo: state.shop.goodsList && state.shop.goodsList.pageNo,
    filter: state.shop.goodsList && state.shop.goodsList.filter,
    preRouter: state.router.pre,
  }
}
export default connect(mapStateToProps)(BindGoods)
