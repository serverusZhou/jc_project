import React from 'react'
import { connect } from 'react-redux'
import { JcContent, JcFilter } from '../../components/styleComponents'
import { Tabs } from 'antd'
import BindGoods from './bindGoods'
import CancelGoods from './cancelGoods'
import { getGoodsList, getTreeData } from './reduck'

const TabPane = Tabs.TabPane

class Bind extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shopId: this.props.match.match.params.shopId || '',
      activeKey: '0',
    }
  }
  componentWillMount() {
    const { filter } = this.props
    this._getGoodsList(filter, filter.currentPage)
    this._getTreeData()
  }
  _search = values => {
    const args = {
      shopId: this.state.shopId,
      bindFlag: this.state.activeKey === '0' ? 'N' : 'Y',
      goodsTitle: values.goodsTitle || '',
      categoryFrontId: values.categoryFrontId || '',
      pageSize: 10
    }
    this._getGoodsList(args)
  }

  _getGoodsList = (values, currentPage = 1) => {
    const args = {
      shopId: this.state.shopId,
      bindFlag: this.state.activeKey === '0' ? 'N' : 'Y',
      goodsTitle: values.goodsTitle || '',
      categoryFrontId: values.categoryFrontId || '',
      currentPage,
      pageSize: 10
    }
    this.props.dispatch(getGoodsList(args))
  }

  _getTreeData = () => {
    const args = {}
    this.props.dispatch(getTreeData(args))
  }

  _callback = key => {
    const { filter } = this.props
    this.setState({ activeKey: key }, () => {
      this._getGoodsList(filter)
    })
  }

  render() {
    const { treeData } = this.props
    const fields = [
      {
        label: '商品类目',
        fieldName: 'categoryFrontId',
        componentType: 'TreeSelect',
        treeData: treeData
      },
      {
        label: '商品名称',
        fieldName: 'goodsTitle',
        componentType: 'Input',
        initialValue: ''
      }
    ]
    const buttons = [
      {
        desc: '查询',
        type: 'action',
        btnType: 'primary',
        onClick: this._search
      }
    ]
    return (
      <JcContent>
        <JcFilter fields={fields} buttons={buttons} />
        <Tabs
          defaultActiveKey={this.state.activeKey}
          onChange={this._callback}
          type='0'
        >
          <TabPane
            tab='未绑定'
            key='0'
          >
            <BindGoods />
          </TabPane>
          <TabPane
            tab='已绑定'
            key='1'
          >
            <CancelGoods />
          </TabPane>
        </Tabs>
      </JcContent>
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
export default connect(mapStateToProps)(Bind)
