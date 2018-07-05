import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, Spin, Button, Divider } from 'antd'
import Detail from './Detail'
import * as reduck from './reduck'
import DescriptionList from '../../../components/DescriptionList'

const { Description } = DescriptionList
const auditInfo = {
  audit: '审核状态',
  remark: '原因',
  auditTime: '审核时间',
  auditor: '审核责任人'
}

class AuditDetail extends Component {
  static defaultProps = {
    isShowDetailModal: false,
    isModalLoading: false,
    auditStatus: '',
    unapprovedReason: '',
    auditor: '',
    auditTimeStr: ''
  }

  _handleCancel = () => {
    this.props.dispatch(reduck.showModalDetailAction(false))
  }
  _handleOk = () => {
    this.props.dispatch(reduck.showModalDetailAction(false))
  }
  render() {
    return (
      <Modal
        title='店铺审核'
        width='800px'
        visible={this.props.isShowDetailModal}
        onOk={this._handleOk}
        onCancel={this._handleCancel}
        footer={[
          <Button key='close' onClick={this._handleCancel}>
            关闭
          </Button>
        ]}
      >
        <Spin spinning={this.props.isModalLoading}>
          <DescriptionList size='large' key='baseInfo' title='审核信息' style={{ marginBottom: 32 }}>
            <Description term={auditInfo.audit}>{this.props.auditStatus}</Description>
            <Description term={auditInfo.auditor}>{this.props.auditor}</Description>
            <Description term={auditInfo.auditTime}>{this.props.auditTimeStr}</Description>
            <Description term={auditInfo.remark}>{this.props.unapprovedReason}</Description>
          </DescriptionList>
          <Divider key='Divider_03' style={{ marginBottom: 32 }} />
          <Detail />
        </Spin>
      </Modal>
    )
  }
}

const mapDispatchToProps = dispatch => ({ dispatch })
const mapStateToProps = state => {
  return {
    auditStatus: state.auditShopReduck.auditStatus,
    unapprovedReason: state.auditShopReduck.unapprovedReason,
    auditor: state.auditShopReduck.auditor,
    auditTimeStr: state.auditShopReduck.auditTimeStr,
    isModalLoading: state.globalReduck.showSpinBool
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuditDetail)
