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
  getAdvertiseDetail,
  postAdvertiseAudit,
  getAdvertiseAuditLog
} from '../reduck'
import moment from 'moment'
import {
  AuditStatusMap,
  AuditStatusKeyMap,
  OperateAuditType,
  AssetBitrateMap,
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
//  审核类型：1=广告 2=布局 3=媒资
const auditType = OperateAuditType.Advertise

class AdvertiseDetail extends Component {
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
      getAdvertiseDetail({
        serviceId,
        auditId,
        adId: serviceId,
        type: auditId ? AuditLogSearchType : auditType
      })
    )
    this.props.dispatch(
      getAdvertiseAuditLog({ serviceId: serviceId, type: auditType })
    )
  }

  // 提交审核
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      const { detail } = this.props
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
      this.props.dispatch(postAdvertiseAudit(fieldsValue))
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
          {detail.positionName}
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

  _getVideoList = () => {
    const { detail } = this.props
    let videoList = []
    detail.episodeMediaList &&
      detail.episodeMediaList.map((episode, eIndex) => {
        if (!episode.videoList) return
        // 非自由源只要显示视频列表
        if (detail.episodeSource !== 'self') {
          videoList.push(
            <Button>{detail.episodeName}</Button>
          )
        } else {
          const _videoList = episode.videoList.map((video, vIndex) => {
            return (
              <Row
                key={eIndex + '-' + vIndex}
                className={styles['margin-bottom']}
              >
                <Col span={18}>
                  <Input
                    readOnly={true}
                    addonBefore={this._getVideoTitle(detail, episode, video)}
                    value={video.url}
                  />
                </Col>
              </Row>
            )
          })
          videoList = videoList.concat(_videoList)
        }
      })
    return videoList
  }

  _getVideoTitle = (detail, episode, video) => {
    return `${detail.episodeName}-${(AssetBitrateMap[video.assetBitrate] && AssetBitrateMap[video.assetBitrate].name) || ''}`
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { detail, auditLogs, isBtnLoading } = this.props
    detail.auditStatus = detail.auditStatus + ''
    return (
      <Card title={this.getCardTitle()}>
        <Form>
          <FormItem {...formItemLayout} label='广告位置'>
            {detail.positionName}
          </FormItem>
          {detail.adImg1Url &&
            <FormItem {...formItemLayout} label='广告图(16:9)'>
              <img
                className={styles['advertise-image']}
                // src={detail.adImg1Url}
                src={detail.adImg1Url}
                alt='广告图'
                onClick={() => this.handlePreview(detail.adImg1Url)}
              />
            </FormItem>}
          {detail.adImg2Url &&
            <FormItem {...formItemLayout} label='广告图(4:3)'>
              <img
                className={styles['advertise-image']}
                // src={detail.adImg2Url}
                src={detail.adImg2Url}
                alt='广告图'
                onClick={() => this.handlePreview(detail.adImg2Url)}
              />
            </FormItem>}
          {detail.episodeImgUrl &&
            <FormItem {...formItemLayout} label='视频图片'>
              <img
                className={styles['advertise-image']}
                // src={detail.adImg2Url}
                src={detail.episodeImgUrl}
                alt='广告图'
                onClick={() => this.handlePreview(detail.episodeImgUrl)}
              />
            </FormItem>}
          {
            detail.positionId !== '3' && <FormItem {...formItemLayout} label='视频列表'>
              {this._getVideoList()}
            </FormItem>
          }
          {
            detail.positionId === '3' && <FormItem {...formItemLayout} label='应用名称'>
              { detail.episodeName }
            </FormItem>
          }
          {
            detail.imgShowTime && <FormItem {...formItemLayout} label='播放时长'>
              {detail.imgShowTime ? `${detail.imgShowTime}秒` : '' }
            </FormItem>
          }
          <FormItem {...formItemLayout} label='排序序号'>
            {detail.sort}
          </FormItem>
          <FormItem {...formItemLayout} label='广告周期'>
            {`${moment(detail.showStartTime).format(
              'YYYY-MM-DD HH:mm:ss'
            )}至${moment(detail.showEndTime).format('YYYY-MM-DD HH:mm:ss')}`}
          </FormItem>
          {/* <FormItem {...formItemLayout} label='提审日期'>
            2018-02-12 12:00
          </FormItem> */}
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
          width='900px'
        >
          <img alt='' style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </Card>
    )
  }
}

const mapStateToProps = state => {
  return {
    detail: state.resource.audit.advertiseDetail,
    auditLogs: state.resource.audit.advertiseAuditLogs,
    isBtnLoading: state.common.showButtonSpin
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(
  Form.create()(AdvertiseDetail)
)
