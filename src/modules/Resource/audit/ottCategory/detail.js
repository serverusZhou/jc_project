import React from 'react'
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
  getOTTCategoryDetail,
  postOttCategoryAudit,
  getCategoryAuditLog
} from '../reduck'
import {
  AuditStatusMap,
  AuditStatusKeyMap,
  OperateAuditType,
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
//  审核类型：1=广告 2=布局 3=媒资
const auditType = OperateAuditType.OTTCategory
const statusColor = {
  wait: 'orange',
  pass: 'green-inverse',
  fail: 'red-inverse'
}

class InterphaseDetail extends React.Component {
  state = {
    previewVisible: false,
    previewImage: ''
  }

  componentWillMount() {
    // 通过路由解析参数
    const params = this.props.match.params.id.split(',')
    const serviceId = params[0]
    const auditId = params[1]
    this.setState({ serviceId, auditId })
    // 通过id获取详情
    this.props.dispatch(
      getOTTCategoryDetail({
        serviceId,
        auditId,
        cateId: serviceId,
        type: auditId ? AuditLogSearchType : auditType
      })
    )
    this.props.dispatch(
      getCategoryAuditLog({ serviceId: serviceId, type: auditType })
    )
  }

  // 提交界面审核
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      const { detail, dispatch } = this.props
      const fieldsValue = {
        ...values,
        serviceId: this.state.serviceId,
        type: auditType,
        // 提审数据的中文名称
        serviceName: '',
        // 提审数据快照
        snapShot: JSON.stringify(detail)
      }
      if (
        fieldsValue.status === AuditStatusKeyMap.FAIL.value &&
        !fieldsValue.suggestion
      ) {
        message.error('请填写不通过原因')
        return
      }
      dispatch(postOttCategoryAudit(fieldsValue))
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
          {detail.channelPosition}
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
          <FormItem {...formItemLayout} label='logo'>
            {detail.logoUrl &&
              <img
                className={styles['advertise-image']}
                // src={detail.adImg1Url}
                src={detail.logoUrl}
                alt='界面图'
                onClick={() => this.handlePreview(detail.logoUrl)}
              />}
          </FormItem>
          <FormItem {...formItemLayout} label='更新内容'>
            {detail.updateContent}
          </FormItem>
          <FormItem {...formItemLayout} label='安装包下载'>
            <a href={detail.installationFileUrl} download='download'>
              下载安装包
            </a>
          </FormItem>
          <FormItem {...formItemLayout} label='提审日期'>
            {moment(detail.modifyTime).format('YYYY-MM-DD HH:mm')}
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
    detail: state.resource.audit.categoryAuditDetail || [],
    auditLogs: state.resource.audit.categoryAuditLogs,
    isBtnLoading: state.common.showButtonSpin
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(
  Form.create()(InterphaseDetail)
)
