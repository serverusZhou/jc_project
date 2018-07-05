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
    auditTime: '',
    auditUser: '',
    auditMessage: '',
    auditStatus: ''
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
        title='商品审核'
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
            <Description term={auditInfo.auditor}>{this.props.auditUser}</Description>
            <Description term={auditInfo.auditTime}>{this.props.auditTime}</Description>
            <Description term={auditInfo.remark}>{this.props.auditMessage}</Description>
          </DescriptionList>
          <Divider key='Divider_goods_04' style={{ marginBottom: 32 }} />
          <Detail />
        </Spin>
      </Modal>
    )
  }
}

const mapDispatchToProps = dispatch => ({ dispatch })
const mapStateToProps = state => {
  return {
    isModalLoading: state.globalReduck.showSpinBool,
    auditStatus: state.auditGoodsReduck.auditStatus,
    auditMessage: state.auditGoodsReduck.auditMessage,
    auditUser: state.auditGoodsReduck.auditUser,
    auditTime: state.auditGoodsReduck.auditTime
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuditDetail)
