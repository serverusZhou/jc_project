import React, { Component } from 'react'
import LayoutContainer from './layoutContainer'
import styles from './styles.less'
import { Button, Modal } from 'antd'

import { showModalWrapper } from 'Components/modal/ModalWrapper'
import * as urls from 'Global/urls'
import * as actions from './reduck'
import { connect } from 'react-redux'
import { getAliToken } from 'Global/action'
import AddAudit from './addAudit'

import AddLayoutForm from './addLayoutForm'
import * as commonaActions from '../reduck'
import { LayoutType, VedioLayoutType, RecoType } from '../dict'

class FormDetail extends Component {

  constructor(props) {
    super(props)
    let layoutType = LayoutType
    let pageFrom = RecoType.HOME
    let isPreview = false
    if (props.match.path.startsWith(urls.OPERATE_VEDIO_RECO_ADD)) {
      layoutType = VedioLayoutType
      pageFrom = RecoType.VEDIO
    }
    if (props.match.path.startsWith(urls.OPERATE_VEDIO_RECO_INFO) || props.match.path.startsWith(urls.OPERATE_HOME_MANAGE_INFO)) {
      isPreview = true
    }
    this.state = {
      dataSource: [],
      channelId: this.props.match.params.channelId,
      showModal: false,
      layoutType,
      pageFrom,
      isPreview
    }
  }

  componentWillMount() {
    // 请求接口 得到初始布局
    const { dispatch } = this.props
    const { channelId } = this.state
    dispatch(actions.listLayout({ channelId }))
    dispatch(getAliToken())
  }

  componentWillReceiveProps(nextProps) {
    // 比较两个props  如果不同 使用新的props 生成state
    if (this.props.list !== nextProps.list) {
      this.setState({
        dataSource: nextProps.list && nextProps.list.layoutDetailVOList
      })
    }
  }

// 新增布局确认
  _handlerAdd(data, onCancel) {
    const { dispatch } = this.props
    const { channelId } = this.state
    const arg = {
      ...data,
      channelId
    }
    dispatch(actions.addLayout(arg))
    onCancel && onCancel()
  }
// 新增布局取消
  _handlerClose(onCancel) {
    onCancel && onCancel()
  }
// 新增布局弹出框内容
  _Wrapper = props => {
    return (
      <AddLayoutForm
        layoutType={this.state.layoutType}
        handlerAdd={(data) => this._handlerAdd(data, props.onCancel)}
        handleClose={() => this._handlerClose(props.onCancel)}
      />
    )
  }
// 新增布局
  _showModal = () => {
    const Wrapper = this._Wrapper
    showModalWrapper((
      <Wrapper />
    ), {
      title: '添加',
      width: 800
    })
  }

  _bindContent = (data, callback) => {
    this.props.dispatch(actions.bindContent(data, this.state.channelId, callback))
  }
  _handleSelect = () => {
    this._handleCancel()
  }
  _showAudit = () => {
    this.setState({
      showModal: true
    })
  }
  _handleCancel = () => {
    this.setState({
      showModal: false
    })
  }
  _handlerLayoutAudit = (data) => {
    const { dispatch } = this.props
    const channelId = this.state.channelId
    // const currentRecord = location.state && location.state.current
    const { pageFrom } = this.state
    const snapData = {
      channelId,
      channelPosition: pageFrom === 'HOME' ? 'index' : 'videoIndex',
      channelLogoUrl: data.channelLogoUrl,
      updateContent: data.updateInfo,
      installationFileUrl: data.downloadUrl
    }
    const arg = {
      serviceId: channelId,
      status: 1,
      type: 2,
      ...snapData,
      // 保存快照信息
      snapShot: JSON.stringify(snapData)
    }
    dispatch(commonaActions.auditConfirm(arg)).then((req) => {
      if (req.status === 'success') {
        // dispatch(actions.getAdClassifyList({ currentPage: 1, pageSize: 10, ...filter }))
      }
    })
  }
  render() {
    const { dispatch, aliToken } = this.props
    const { dataSource, channelId, showModal, isPreview } = this.state

    return (
      <div>
        {!isPreview && <div className={styles.rightButtons}>
          <Button type='primary' onClick={() => this._showAudit()} >上传过审图</Button>
          <Button type='primary' onClick={() => this._showModal()}>新增布局</Button>
        </div>}
        <LayoutContainer
          isPreview={isPreview}
          channelId={channelId}
          dispatch={dispatch}
          dataSource={dataSource}
          bindContent={this._bindContent}
          aliToken={aliToken}
        />
        <Modal
          width={'800px'}
          title='提交审核'
          visible={showModal}
          onOk={this._handleSelect}
          onCancel={this._handleCancel}
          footer={null}
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
    aliToken: state.common.aliToken,
    list: state.operate.homeReco.layoutList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(FormDetail)
