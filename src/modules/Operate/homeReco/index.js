import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Popover, Divider, Modal, Button, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'

import { genPlanColumn, genPagination } from 'Utils/helper'
import * as actions from './reduck'
import * as urls from 'Global/urls'
import AddAudit from './addAudit'
import * as commonActions from '../reduck'
import { RecoType } from '../dict'

class HomeReco extends Component {

  constructor(props) {
    super(props)
    let pageFrom = RecoType.VEDIO
    let addUrl = urls.OPERATE_VEDIO_RECO_ADD
    let infoUrl = urls.OPERATE_VEDIO_RECO_INFO
    if (props.match.path === urls.OPERATE_HOME_MANAGE) {
      pageFrom = RecoType.HOME
      addUrl = urls.OPERATE_HOME_MANAGE_ADD
      infoUrl = urls.OPERATE_HOME_MANAGE_INFO
    }
    this.state = ({
      showModal: false,
      pageFrom,
      currentChannel: '',
      addUrl,
      infoUrl
    })
  }

  componentWillMount() {
    const { dispatch } = this.props
    const { pageFrom } = this.state
    dispatch(actions.homeRecoList({ pageSize: 10, currentPage: 1, channelPosition: pageFrom === RecoType.HOME ? 'index' : 'videoIndex' }))
  }
  
  _enableChannel = (item, beEnable) => {
    const { dispatch, filter } = this.props
    const arg = {
      channelId: item.channelId,
      isUse: beEnable
    }
    dispatch(actions.enableChannel(arg)).then((arg) => {
      if (arg.status === 'success') {
        dispatch(actions.homeRecoList({ pageSize: 10, currentPage: 1, ...filter }))
      }
    })
  }
  _showAudit = (item) => {
    this.setState({
      showModal: true,
      currentChannel: item
    })
  }

  _auditDetails = (item) => {
    const { dispatch } = this.props
    const arg = {
      serviceId: item.channelId,
      type: 2,
      // 保存快照信息
      // snapShot: JSON.stringify(item)
    }
    dispatch(commonActions.auditDetails(arg))
  }

  _columns = [
    genPlanColumn('auditStatus', '状态', {
      render: (text, record) => {
        switch (record.auditStatus) {
          case 0: {
            return ('未提审')
          }
          case 1: {
            return ('待审核')
          }
          case 2: {
            return ('审核不通过')
          }
          case 3:
          case 4: {
            if (record.isUse) {
              return ('启用')
            } else {
              return ('未启用')
            }
          }
          default: {
            return null
          }
        }
      }
    }),
    genPlanColumn('createTime', '创建时间'),
    genPlanColumn('modifyTime', '更新时间'),
    genPlanColumn('operName', '操作人'),
    genPlanColumn('operate', '操作', {
      render: (text, record) => {
        switch (record.auditStatus) {
          case 0: {
            return (
              <div>
                <Link
                  to={{
                    pathname: `${this.state.addUrl}/${record.channelId}`,
                    state: { current: record }
                  }}
                >
                  编辑
                </Link>
                <Divider type='vertical' />
                <Link
                  to={{
                    pathname: `${this.state.infoUrl}/${record.channelId}`,
                    state: { current: record, isPreview: true }
                  }}
                >
                  预览
                </Link>
                <Divider type='vertical' />
                <a
                  href='javascript:;'
                  onClick={() => { this._showAudit(record) }}
                >提交审核
                </a>
              </div>
            )
          }
          case 1: {
            return (
              <div>
                <Link
                  to={{
                    pathname: `${this.state.infoUrl}/${record.channelId}`,
                    state: { current: record, isPreview: true }
                  }}
                >预览
                </Link>
              </div>
            )
          }
          case 2: {
            return (
              <div>
                <Popover
                  title='原因'
                  content={this.props.auditDetails && this.props.auditDetails.suggestion || ''}
                  trigger='click'
                  placement='topRight'
                >
                  <a
                    href='javascript:;'
                    onClick={() => this._auditDetails(record)}
                  >查看原因
                  </a>
                </Popover>
                <Divider type='vertical' />
                <Link
                  to={{
                    pathname: `${this.state.addUrl}/${record.channelId}`,
                    state: { current: record }
                  }}
                >编辑
                </Link>
                <Divider type='vertical' />
                <Link
                  to={{
                    pathname: `${this.state.infoUrl}/${record.channelId}`,
                    state: { current: record, isPreview: true }
                  }}
                >预览
                </Link>
                <Divider type='vertical' />
                <a
                  href='javascript:;'
                  onClick={() => { this._showAudit(record) }}
                >提交审核
                </a>
              </div>
            )
          }
          case 3:
          case 4: {
            if (record.isUse) {
              return (
                <div>
                  <Link
                    to={`${this.state.infoUrl}/${record.channelId}`}
                  >预览
                  </Link>
                </div>
              )
            } else {
              return (
                <div>
                  <Link
                    to={`${this.state.infoUrl}/${record.channelId}`}
                  >预览
                  </Link>
                  <Divider type='vertical' />
                  <Popconfirm
                    title='确认要使用吗?'
                    onConfirm={() => { this._enableChannel(record, 1) }}
                    okText='确认'
                    cancelText='取消'
                  >
                    <a
                      href='javascript:;'
                      // onClick={() => this._enableChannel(record, 1)}
                    >使用</a>
                  </Popconfirm>
                </div>
              )
            }
          }
          case 5: {
            return (
              <div className={styles['table_collect']}>
                <Link
                  to={`${this.state.infoUrl}/${record.channelId}`}
                >预览
                </Link>
                <a
                  href='javascript:;'
                  onClick={() => this._enableChannel(record, 1)}
                >使用</a>
              </div>
            )
          }
          default: {
            return null
          }
        }
      }
    }),
  ]

  _handleCancel = () => {
    this.setState({
      showModal: false
    })
  }

  _handleAdd = () => {
    const { dispatch } = this.props
    const { pageFrom } = this.state
    dispatch(actions.addChannel({ channelPosition: pageFrom === RecoType.HOME ? 'index' : 'videoIndex', channelName: '' })).then((res) => {
      if (pageFrom === RecoType.HOME) {
        this.props.history.push(this.state.addUrl + '/' + res.channelId)
      } else {
        this.props.history.push(urls.OPERATE_VEDIO_RECO_ADD + '/' + res.channelId)
      }
    })
  }
  _handleSelect = () => {
    this._handleCancel()
  }

  _handlerLayoutAudit = (data) => {
    const { filter, dispatch } = this.props
    const { currentChannel, pageFrom } = this.state
    const snapData = {
      channelId: currentChannel.channelId,
      channelPosition: pageFrom === 'HOME' ? 'index' : 'videoIndex',
      channelLogoUrl: data.channelLogoUrl,
      updateContent: data.updateInfo,
      installationFileUrl: data.downloadUrl
    }
    const arg = {
      serviceId: currentChannel.channelId,
      status: 1,
      type: 2,
      ...snapData,
      // 保存快照信息
      snapShot: JSON.stringify(snapData)
    }
    dispatch(commonActions.auditConfirm(arg)).then((arg) => {
      if (arg.status === 'success') {
        dispatch(actions.homeRecoList({ pageSize: 10, currentPage: 1, ...filter }))
      }
    })
  }

  _handleChange = (pagination, filters, sorter) => {
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(actions.homeRecoList(finalFilter))
  }

  render() {
    const { showListSpin, list, page } = this.props
    const { showModal } = this.state
    const pagination = genPagination(page)
    return (
      <div>
        <Button
          style={{ float: 'right', marginBottom: 10 }}
          type='primary'
          onClick={this._handleAdd}
        >
          创建
        </Button>
        <Table
          style={{ clear: 'both' }}
          pagination={pagination}
          columns={this._columns}
          rowKey='channelId'
          dataSource={list}
          onChange={this._handleChange}
          loading={showListSpin}
        />
        <Modal
          width={'800px'}
          title='提交审核'
          visible={showModal}
          onOk={this._handleSelect}
          onCancel={this._handleCancel}
          footer={null}
          maskClosable={false}
        >
          <AddAudit
            handlerAdd={this._handlerLayoutAudit}
            onClose={this._handleCancel}
          />
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,
    auditDetails: state.operate.operateCommon.auditDetails,

    list: state.operate.homeReco.homeRecoList,
    filter: state.operate.homeReco.homeRecoFilter,
    page: state.operate.homeReco.homeRecoPage,
    channel: state.operate.homeReco.homeRecoChannel,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeReco)
