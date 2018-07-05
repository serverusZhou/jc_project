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
  getOTTMediaDetail,
  postOTTMediaAudit,
  getOTTMediaAuditLog,
} from '../reduck'
import {
  AuditStatusMap,
  AuditStatusKeyMap,
  OperateAuditType,
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

class OTTMediaDetail extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    serviceId: '',
    auditId: '',
    auditType: 1,
  }

  componentWillMount() {
    // 通过路由解析参数
    const params = this.props.match.params.id.split(',')
    const id = params[0]
    const serviceId = params[1]
    const auditId = params[2]
    //  审核类型：11=点播 12=资讯 13=推荐
    let auditType = 0
    const { OTTMediaPlay, OTTMediaNews, OTTMediaRecommend } = OperateAuditType
    switch (Number(id)) {
      case 1: auditType = OTTMediaPlay; break
      case 2: auditType = OTTMediaNews; break
      case 3: auditType = OTTMediaRecommend; break
    }
    this.setState({
      auditType,
      serviceId,
      auditId,
    })
    // 通过id获取详情
    this.props.dispatch(
      getOTTMediaDetail({
        id,
      })
    )
    this.props.dispatch(
      getOTTMediaAuditLog({ serviceId: serviceId, type: auditType })
    )
  }

  // 提交审核
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
        type: this.state.auditType,
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
      dispatch(postOTTMediaAudit(fieldsValue))
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
    console.log(this.props)
    const { detail, auditLogs, isBtnLoading } = this.props
    detail.auditStatus = detail.auditStatus + ''
    return (
      <Card title={this.getCardTitle()}>
        <Form>
          <FormItem {...formItemLayout} label='界面图'>
            {detail.logoUrl &&
              <img
                className={styles['advertise-image']}
                src={detail.logoUrl}
                alt='界面图'
                onClick={() => this.handlePreview(detail.logoUrl)}
              />}
          </FormItem>
          <FormItem {...formItemLayout} label='更新内容'>
            {detail.content}
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
    detail: state.resource.audit.ottMediaAuditDetail,
    auditLogs: state.resource.audit.ottMediaAuditLogs,
    isBtnLoading: state.common.showButtonSpin
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(
  Form.create()(OTTMediaDetail)
)
