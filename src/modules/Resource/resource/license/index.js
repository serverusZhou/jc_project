import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table, Input, Row, Radio, Popconfirm } from 'antd'
import { genPlanColumn, genSelectColumn, genPagination } from 'Utils/helper'
import { RESOURCE_MEDIA_LICENSE_DETAIL, RESOURCE_MEDIA_LICENSE } from 'Global/urls'
import * as actions from './reduck'
import styles from './styles.less'

const Search = Input.Search

const enableStatus = [
  { value: true, name: '上架' },
  { value: false, name: '未上架' }
]

class License extends Component {
  constructor(props) {
    super(props)
    this.state = {
      classify: [],
      filter: this.props.filter
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    if (!location.pathname.startsWith(RESOURCE_MEDIA_LICENSE)) {
      dispatch(actions.resetQueryPar())
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(actions.getCategoryList({ cateParentId: 1 })).then(res => {
      if (res.status === 'success') {
        this.setState({
          classify: res.result
        })
      }
    })
    dispatch(actions.getList(this.state.filter))
  }

  selectClassify = (e) => {
    const { filter } = this.state
    filter.cateId = e.target.value
    filter.currentPage = 1
    this.setState({
      filter
    }, () => {
      this.props.dispatch(actions.getList(filter))
    })
  }

  _handleSearchChange = (value) => {
    const { filter } = this.state
    filter.episodeCnName = value
    filter.currentPage = 1
    this.setState({
      filter
    }, () => {
      this.props.dispatch(actions.getList(filter))
    })
  }

  _handleIsEnable = (id, isEnable) => {
    const { dispatch } = this.props
    dispatch(actions.isEnable({ episodeId: id, enable: isEnable })).then((res) => {
      dispatch(actions.getList(this.state.filter))
    })
  }

  _onPaginationChange = (pagination) => {
    const { filter } = this.state
    filter.currentPage = pagination.current
    filter.pageSize = pagination.pageSize
    this.setState({
      filter
    }, () => {
      this.props.dispatch(actions.getList(filter))
    })
  }

  render() {
    const { list, showListSpin, page } = this.props
    const columns = [
      genPlanColumn('episodeId', '媒资ID'),
      genPlanColumn('episodeCnName', '中文名称'),
      genPlanColumn('cateName', '所属分类'),
      genSelectColumn('enable', '运营状态', enableStatus),
      {
        key: 'operate',
        title: '操作',
        dataIndex: 'operate',
        render: (text, record, index) => {
          return (
            <div className={styles['operabtn']}>
              <Link to={`${RESOURCE_MEDIA_LICENSE_DETAIL}/${record.episodeId}`}>查看</Link>
              <Popconfirm
                title={record.enable ? '禁用后该媒资在视听中心中无法搜索到，你还要继续吗？' : '启用后该媒资在视听中心中可被搜索使用，你还要继续吗？'}
                onConfirm={() => this._handleIsEnable(record.episodeId, !record.enable)}
              >
                <a size='small'>{record.enable ? '禁用' : '启用'}</a>
              </Popconfirm>
            </div>
          )
        }
      }
    ]

    return (
      <div>
        <div>
          <Row className={styles['params-row']}>
            <label>分类：</label>
            <Radio.Group value={this.state.filter.cateId} onChange={this.selectClassify}>
              <Radio.Button value='' style={{ border: 0 }}>全部</Radio.Button>
              {
                this.state.classify && this.state.classify.map((item, index) => {
                  return (<Radio.Button key={index} value={item.cateId} style={{ border: 0 }}>{item.cateName}</Radio.Button>)
                })
              }
            </Radio.Group>
          </Row>
          <Row className={styles['params-row']}>
            <Search
              placeholder='输入媒资名称进行搜索'
              style={{ width: 300, float: 'right' }}
              onSearch={(value) => this._handleSearchChange(value)}
              enterButton
            />
          </Row>
        </div>
        <Table
          columns={columns}
          loading={showListSpin}
          bordered={true}
          dataSource={list}
          onChange={this._onPaginationChange}
          rowKey={'episodeId'}
          pagination={genPagination(page)}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    list: state.resource.license.list,
    filter: state.resource.license.filter,
    page: state.resource.license.pagination,
    showListSpin: state.common.showListSpin
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(License)
