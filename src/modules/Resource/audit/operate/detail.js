import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Form,
  Button,
  Radio,
  Input,
  Card,
  Tag,
  Row,
  Col,
  Modal,
  message
} from 'antd'
import {
  getOperateDetail,
  postOperateAudit,
  getOperateAuditLog
} from '../reduck'
import moment from 'moment'
import {
  AuditStatusMap,
  AuditStatusKeyMap,
  OperateAuditType,
  OperateLevelMap,
  OperateLevelKeyMap,
  AuditLogSearchType
} from '../dict'
import styles from '../styles.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  }
}
const tailFormItemLayout = {
  wrapperCol: {
    span: 14,
    offset: 6
  }
}
const statusColor = {
  wait: 'orange',
  pass: 'green-inverse',
  fail: 'red-inverse'
}
const auditType = OperateAuditType.OperateCate

class OperationDetail extends Component {
  state = {
    previewVisible: false,
    previewImage: ''
  }

  componentWillMount() {
    const params = this.props.match.params.id.split(',')
    const serviceId = params[0]
    const auditId = params[1]
    this.setState({ serviceId, auditId })
    this.props.dispatch(
      getOperateDetail({
        serviceId,
        auditId,
        cateId: serviceId,
        type: auditId ? AuditLogSearchType : auditType
      })
    )
    this.props.dispatch(
      getOperateAuditLog({ serviceId: serviceId, type: auditType })
    )
  }

  // 提交审核
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      const fieldsValue = {
        ...values,
        serviceId: this.state.serviceId,
        type: auditType,
        // 提审数据的中文名称
        serviceName: '',
        // 提审数据快照
        snapShot: JSON.stringify(this.props.detail)
      }
      if (
        fieldsValue.status === AuditStatusKeyMap.FAIL.value &&
        !fieldsValue.suggestion
      ) {
        message.error('请填写不通过原因')
        return
      }
      this.props.dispatch(postOperateAudit(fieldsValue))
    })
  }

  // 生成标题：名称、状态
  getCardTitle = () => {
    const { detail } = this.props
    const status = AuditStatusMap[detail.auditStatus]
    detail.auditStatus = detail.auditStatus + ''
    return (
      <div>
        <span className='margin-right'>
          {detail.cateName}
        </span>
        <Tag
          color={
            (detail.auditStatus === AuditStatusKeyMap.FAIL.value &&
              statusColor.fail) ||
            (detail.auditStatus === AuditStatusKeyMap.WAIT.value &&
              statusColor.wait) ||
            (detail.auditStatus === AuditStatusKeyMap.PASS.value &&
              statusColor.pass)
          }
        >
          {status && status.name}
        </Tag>
      </div>
    )
  }

  // 表格图片点击预览
  handlePreview = url => {
    this.setState({
      previewImage: url,
      previewVisible: true
    })
  }

  // modal点击关闭
  handleCancel = () => this.setState({ previewVisible: false })

  render() {
    const { getFieldDecorator } = this.props.form
    const { detail, auditLogs, isBtnLoading } = this.props
    detail.auditStatus = detail.auditStatus + ''
    return (
      <Card title={this.getCardTitle()}>
        <Form>
          <FormItem {...formItemLayout} label='分类名称'>
            {detail.cateName}
          </FormItem>
          <FormItem {...formItemLayout} label='分类Logo'>
            {detail.logoUrl &&
              <img
                className={styles['advertise-image']}
                // src={detail.adImg1Url}
                src={detail.logoUrl}
                alt='Logo'
                onClick={() => this.handlePreview(detail.logoUrl)}
              />}
          </FormItem>
          <FormItem {...formItemLayout} label='排序'>
            {detail.sort}
          </FormItem>
          <FormItem {...formItemLayout} label='分类类型'>
            {OperateLevelMap[detail.level] &&
              OperateLevelMap[detail.level].name}
          </FormItem>
          {detail.level + '' === OperateLevelKeyMap.LEVEL_CHILD.value &&
            <FormItem {...formItemLayout} label='上级分类'>
              {detail.parentCateName}
            </FormItem>}
          <FormItem {...formItemLayout} label='创建日期'>
            {moment(detail.createTime).format('YYYY-MM-DD HH:mm')}
          </FormItem>
        </Form>
        {detail.auditStatus === AuditStatusKeyMap.WAIT.value &&
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label='审核'>
              {getFieldDecorator('status', {
                rules: [
                  {
                    required: true,
                    message: '请选择审核状态'
                  }
                ]
              })(
                <RadioGroup>
                  <Radio value={AuditStatusKeyMap.PASS.value}>通过</Radio>
                  <Radio value={AuditStatusKeyMap.FAIL.value}>不通过</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='审核备注'>
              {getFieldDecorator('suggestion', {})(<Input />)}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type='primary' htmlType='submit' loading={isBtnLoading}>
                审核
              </Button>
            </FormItem>
          </Form>}
        <Card title='审核记录'>
          {auditLogs &&
            auditLogs.map(log => {
              return (
                <Row key={log.id}>
                  <Col span={6}>
                    {moment(log.createTime).format('YYYY-MM-DD HH:mm')}
                  </Col>
                  <Col span={4}>
                    {AuditStatusMap[log.status] &&
                      AuditStatusMap[log.status].name}
                  </Col>
                  <Col span={14}>
                    {log.status + '' === AuditStatusKeyMap.WAIT.value
                      ? '提审人'
                      : '审核人'}：{log.userName}
                  </Col>
                  <Col span={18} offset={6} className={styles['audit-memo']}>
                    {log.suggestion}
                  </Col>
                </Row>
              )
            })}
        </Card>
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt='' style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </Card>
    )
  }
}

const mapStateToProps = state => {
  return {
    detail: state.resource.audit.operateDetail,
    auditLogs: state.resource.audit.operateAuditLogs,
    isBtnLoading: state.common.showButtonSpin
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(
  Form.create()(OperationDetail)
)
