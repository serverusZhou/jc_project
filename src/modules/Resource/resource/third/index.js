import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Input, Row, Radio, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
import { RESOURCE_MEDIA_DETAIL, RESOURCE_MEDIA_EDIT, RESOURCE_MEDIA_THIRD } from 'Global/urls'
import { genPlanColumn, genSelectColumn, genPagination } from 'Utils/helper'
import * as actions from './reduck'
import { AuditStatusKeyMap } from '../../audit/dict'
import styles from './styles.less'

const Search = Input.Search

const sourceList = [
  { value: 'self', text: '自有源' },
  { value: 'yk', text: '酷喵' }
]
const auditStatus = {
  '0': '未提审',
  '1': '待审核',
  '2': '未通过',
  '3': '审核通过'
}

const enableStatus = [
  { value: true, name: '上架' },
  { value: false, name: '未上架' }
]
const statusColor = {
  init: '#1890ff',
  wait: 'orange',
  pass: 'green',
  fail: 'red'
}

class Third extends Component {
  constructor(props) {
    super(props)
    this.state = {
      classify: [],
      thirdFilter: this.props.thirdFilter
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    if (!location.pathname.startsWith(RESOURCE_MEDIA_THIRD)) {
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
    dispatch(actions.thirdList(this.state.thirdFilter))
  }

  selectClassify = (e) => {
    const { thirdFilter } = this.state
    thirdFilter.cateId = e.target.value
    thirdFilter.currentPage = 1
    this.setState({
      thirdFilter
    }, () => {
      this.props.dispatch(actions.thirdList(thirdFilter))
    })
  }

  selectSource = (e) => {
    const { thirdFilter } = this.state
    thirdFilter.source = e.target.value
    thirdFilter.currentPage = 1
    this.setState({
      thirdFilter
    }, () => {
      this.props.dispatch(actions.thirdList(thirdFilter))
    })
  }

  _handleSearchChange = (value) => {
    const { thirdFilter } = this.state
    thirdFilter.episodeCnName = value
    thirdFilter.currentPage = 1
    this.setState({
      thirdFilter
    }, () => {
      this.props.dispatch(actions.thirdList(thirdFilter))
    })
  }

  _handleIsEnable = (id, isEnable) => {
    const { dispatch } = this.props
    dispatch(actions.isEnable({ episodeId: id, enable: isEnable })).then((res) => {
      if (res.status === 'success') {
        dispatch(actions.thirdList(this.state.thirdFilter))
      }
    })
  }

  _handleDelete = (id) => {
    const { dispatch } = this.props
    dispatch(actions.deleteMedia({ episodeId: id })).then((res) => {
      dispatch(actions.thirdList(this.state.thirdFilter))
    })
  }

  _onPaginationChange = (pagination) => {
    const { thirdFilter } = this.state
    thirdFilter.currentPage = pagination.current
    thirdFilter.pageSize = pagination.pageSize
    this.setState({
      thirdFilter
    }, () => {
      this.props.dispatch(actions.thirdList(thirdFilter))
    })
  }

  render() {
    const { thirdList, showListSpin, page } = this.props
    const columns = [
      genPlanColumn('episodeId', '媒资ID'),
      genPlanColumn('episodeCnName', '中文名称'),
      genPlanColumn('cateName', '分类'),
      {
        key: 'source',
        title: '内容来源',
        dataIndex: 'source',
        render: (text, record) => {
          let sourceStr = sourceList.map(m => { if (m.value === record.source) { return m.text } })
          return (
            <span>{sourceStr}</span>
          )
        }
      },
      {
        key: 'auditStatus',
        title: '状态',
        dataIndex: 'auditStatus',
        render: (text, record) => {
          let color = (record.auditStatus.toString() === AuditStatusKeyMap.INIT.value && statusColor.init) ||
            (record.auditStatus.toString() === AuditStatusKeyMap.FAIL.value && statusColor.fail) ||
            (record.auditStatus.toString() === AuditStatusKeyMap.WAIT.value && statusColor.wait) ||
            (record.auditStatus.toString() === AuditStatusKeyMap.PASS.value && statusColor.pass)
          return (
            <span style={{ color: color }}>{auditStatus[record.auditStatus]}</span>
          )
        }
      },
      genSelectColumn('enable', '运营状态', enableStatus),
      {
        key: 'operate',
        title: '操作',
        dataIndex: 'operate',
        render: (text, record, index) => {
          return (
            <div className={styles['operabtn']}>
              {
                record.source !== 'yk' &&
                <div>
                  <Link to={`${RESOURCE_MEDIA_DETAIL}/${record.episodeId}`}>查看</Link>
                  {record.source === 'self' ? <Link to={`${RESOURCE_MEDIA_EDIT}/${record.episodeId}`}>编辑</Link> : ''}

                  <Popconfirm
                    title={'删除本介质？删除后本介质对应的媒资将从视听中心直接删除，请确保该媒资不在首页推荐广告位，否则将影响显示，你还要继续吗？'}
                    onConfirm={() => this._handleDelete(record.episodeId)}
                  >
                    {record.source === 'self' ? <a size='small'>删除</a> : ''}
                  </Popconfirm>
                </div>
              }
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
            <Radio.Group value={this.state.thirdFilter.cateId} onChange={this.selectClassify}>
              <Radio.Button value='' style={{ border: 0 }}>全部</Radio.Button>
              {
                this.state.classify && this.state.classify.map((item, index) => {
                  return (<Radio.Button key={index} value={item.cateId} style={{ border: 0 }}>{item.cateName}</Radio.Button>)
                })
              }
            </Radio.Group>
          </Row>
          <Row className={styles['params-row']}>
            <label>来源：</label>
            <Radio.Group value={this.state.thirdFilter.source} onChange={this.selectSource}>
              <Radio.Button value='' style={{ border: 0 }}>全部</Radio.Button>
              {
                sourceList && sourceList.map((item, index) => {
                  return (<Radio.Button key={index} value={item.value} style={{ border: 0 }}>{item.text}</Radio.Button>)
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
          dataSource={thirdList}
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
    thirdList: state.resource.third.thirdList,
    thirdFilter: state.resource.third.thirdFilter,
    page: state.resource.third.thirdPagination,
    showListSpin: state.common.showListSpin
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Third)
