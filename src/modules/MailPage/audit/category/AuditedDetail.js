import React, { Component } from 'react'
import { Modal, Button, Spin } from 'antd'
import DescriptionList from '../../../components/DescriptionList'
import { auditStatus } from 'Global/bizdictionary'

const { Description } = DescriptionList

const auditInfo = {
  auditStatus: '审核不通过',
  auditer: '审核责任人',
  auditTime: '审核时间',
  categoryName: '类目名称',
  categoryLevel: '类目级别',
  parentName: '上级类目',
  sort: '类目排序',
}

class AuditedDetail extends Component {
  static defaultProps = {
    isModalLoading: false,
  }
  constructor(props) {
    super(props)
    this.state = {
      isAuditedToPass: true
    }
  }
  render() {
    return (
      <Modal
        key='auditResultmodal'
        title= '审核结果'
        visible={this.props.isShowModal}
        destroyOnClose={true}
        onCancel={this.props.close}
        width='800px'
        footer={[
          <Button key='close' onClick={this.props.close}>关闭</Button>
        ]}
      >
        <Spin spinning={this.props.isModalLoading}>
          <DescriptionList size='large' key='auditInfo' title='审核信息' style={{ marginBottom: 32 }}>
            <Description term={'审核状态'}>{auditStatus[this.props.categoryInfo.status]}</Description>
            <Description term={'原因'}>{this.props.categoryInfo.unapprovedReason || ' '}</Description>
            <Description term={auditInfo.auditer}>{this.props.categoryInfo.updateUser}</Description>
            <Description term={auditInfo.auditTime}>{moment(this.props.categoryInfo.createTime).format('YYYY-MM-DD HH:mm')}</Description>
          </DescriptionList>
          <DescriptionList size='large' key='baseInfo' title='基础信息' style={{ marginBottom: 32 }}>
            <Description term={auditInfo.categoryName}>{this.props.categoryInfo.categoryName}</Description>
            <Description term={auditInfo.categoryLevel}>{(parseInt(this.props.categoryInfo.parentId) === 0) ? '一级目录' : '二级目录'}</Description>
            <Description term={auditInfo.parentName}>{this.props.categoryInfo.parentName || ' '}</Description>
            <Description term={auditInfo.sort}>{String(this.props.categoryInfo.sort)}</Description>
          </DescriptionList>
        </Spin>
      </Modal>
    )
  }
}

export default AuditedDetail
