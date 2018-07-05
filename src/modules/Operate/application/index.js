import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Button, Popconfirm, Divider } from 'antd'
import { showModalForm } from 'Components/modal/ModalForm'

import { genPlanColumn, genPagination } from 'Utils/helper'
import Filter from 'Components/Filter'
import { OPERATE_APP_CENTER_ADD, OPERATE_APP_CENTER_EDIT, OPERATE_APP_CENTER_UPDATE } from 'Global/urls'

import * as actions from './reduck'

const statusEnum = [
  { name: '未提审', value: 0 },
  { name: '待审核', value: 1 },
  { name: '未通过', value: 2 },
  { name: '启用', value: 3 },
  { name: '未启用', value: 4 }
]

class Application extends Component {

  constructor(props) {
    super(props)
    this.state = {
      content: ''
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(actions.applicationList({ currentPage: 1, pageSize: 10, appName: '', cateId: '', auditStatus: '' }))
    dispatch(actions.cateList())
  }

  _columns = [
    genPlanColumn('appIcon', '应用图标', {
      render: (text, record) => {
        return (
          <div>
            <img style={{ width: '60px' }} src={text} />
          </div>
        )
      }
    }),
    genPlanColumn('appName', '应用信息', {
      render: (text, record) => {
        return (
          <div>
            <p>{record.appName}</p>
            <p>{record.appVersion}</p>
            <p>{record.language}-{record.apkSize}M</p>
          </div>
        )
      }
    }),
    genPlanColumn('cateName', '分类'),
    genPlanColumn('sort', '排序编号'),
    genPlanColumn('createTime', '创建时间'),
    genPlanColumn('auditStatusName', '状态'),
    genPlanColumn('operateUser', '操作人'),
    genPlanColumn('appDetail', '操作', {
      render: (text, record) => {
        return (
          <div style={{ textAlign: 'left' }}>
            {
              record.auditStatus !== 1 &&
              <a href={`${OPERATE_APP_CENTER_EDIT}/${record.appId}`}>修改
                <Divider type='vertical' />
              </a>
            }
            {
              (record.auditStatus === 0 || record.auditStatus === 2 || record.auditStatus === 4) &&
              <Popconfirm
                title={'确定删除吗？'}
                onConfirm={() => this._handleDelete(record.appId, record.versionId)}
              >
                <a size='small'>删除</a>
                <Divider type='vertical' />
              </Popconfirm>
            }
            {
              record.auditStatus === 4 &&
              <Popconfirm
                title={'确定上架吗？'}
                onConfirm={() => this._handleLower(record.appId, record.versionId, true)}
              >
                <a size='small'>上架</a>
              </Popconfirm>
            }
            {
              record.auditStatus === 3 &&
              <Popconfirm
                title={'确定下架吗？'}
                onConfirm={() => this._handleLower(record.appId, record.versionId, false)}
              >
                <a size='small'>下架</a>
                <Divider type='vertical' />
              </Popconfirm>
            }
            {
              record.auditStatus === 0 &&
              <Popconfirm
                title={'确定提交审核？'}
                onConfirm={() => this._handleAudit(record.versionId)}
              >
                <a size='small'>提交审核</a>
              </Popconfirm>
            }
            {
              record.auditStatus === 2 &&
              <a onClick={() => this._handleSuggestion(record.versionId)}>查看原因</a>
            }
            {
              record.auditStatus === 3 &&
              <a href={`${OPERATE_APP_CENTER_UPDATE}/${record.appId}`}>更新</a>
            }
          </div>
        )
      }
    }),
  ]

  _handleSuggestion = (versionId) => {
    this.props.dispatch(actions.auditRecord({
      serviceId: versionId,
      type: 7
    })).then((res) => {
      res.status === 'success' && showModalForm({
        title: '查看原因',
        fields: [
          {
            id: 'forbidReason',
            props: {
              label: '审核未通过原因:',
            },
            element: (
              <span>{res.data[0].suggestion}</span>
            )
          }
        ]
      })
    })
  }

  _handleSearch = searchData => {
    const { dispatch, filter } = this.props

    const finalFilter = Object.assign({}, filter, searchData, { currentPage: 1 })
    dispatch(actions.applicationList(finalFilter))
  }

  _handleDelete = (appId, versionId) => {
    const { dispatch, filter } = this.props
    dispatch(actions.deleteApp({ appId: appId, versionId: versionId })).then((res) => {
      if (res.status === 'success') {
        dispatch(actions.applicationList(filter))
      }
    })
  }

  _handleAudit = (id) => {
    const { dispatch, filter } = this.props
    dispatch(actions.auditApp({
      serviceId: id,
      status: 1,
      type: 7,
    })).then((res) => {
      if (res.status === 'success') {
        dispatch(actions.applicationList(filter))
      }
    })
  }

  _handleLower = (appId, versionId, isEnable) => {
    const { dispatch, filter } = this.props
    dispatch(actions.lowerApp({
      appId: appId,
      versionId: versionId,
      isEnabled: isEnable
    })).then((res) => {
      if (res.status === 'success') {
        dispatch(actions.applicationList(filter))
      }
    })
  }

  _genFilterFields = (filter) => {
    const fields = [
      {
        key: 'appName',
        label: '应用名称',
        initialValue: filter['appName'],
        type: 'Input',
      },
      {
        key: 'cateId',
        label: '分类',
        initialValue: filter['cateId'] || '',
        type: 'Select',
        content: this.props.cateList && this.props.cateList.map((item) => {
          return {
            name: item.cateName,
            value: item.cateId
          }
        }) || []
      },
      {
        key: 'auditStatus',
        label: '状态',
        initialValue: filter['auditStatus'] || '',
        type: 'Select',
        content: statusEnum
      }
    ]
    return fields
  }

  _handleChange = (pages) => {
    const { dispatch, filter, page } = this.props
    const { pageSize } = page
    const finalFilter = { ...filter, currentPage: pages.pageSize !== pageSize ? 1 : pages.current, pageSize: pages.pageSize }
    dispatch(actions.applicationList(finalFilter))
  }

  render() {
    const { showListSpin, list, filter, page } = this.props
    const fields = this._genFilterFields(filter)
    const pagination = genPagination(page)

    return (
      <div>
        <Button type='primary' href={OPERATE_APP_CENTER_ADD} style={{ float: 'right', margin: '4px 0' }}>新增</Button>
        <Filter
          fields={fields}
          onSearch={this._handleSearch}
        />
        <Table
          pagination={pagination}
          columns={this._columns}
          onChange={this._handleChange}
          dataSource={list}
          rowKey='appId'
          loading={showListSpin}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,
    list: state.operate.application.applicationList,
    filter: state.operate.application.applicationFilter,
    page: state.operate.application.applicationPage,
    cateList: state.operate.application.cateList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Application)
