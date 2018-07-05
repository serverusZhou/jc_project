import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Radio, Input, Card, Row, Col, Tag, message } from 'antd'
import styles from './styles.less'
import { getVideoDetail, postVideoAudit, getVideoAuditLogs } from './reduck'
import { AuditStatusMap, AuditStatusKeyMap, AssetBitrateMap } from '../../audit/dict'
import moment from 'moment'
import storage from 'Utils/storage'
import { isEmpty } from 'Utils/lang'

const userInfo = storage.get('userInfo')
let hasAuth = false
if (!isEmpty(userInfo)) {
  if (!isEmpty(userInfo.menuList)) {
    hasAuth = userInfo.menuList.some(menu => menu.menuTag === 'resourceAudit')
  }
  if (userInfo.roleId === '0') {
    hasAuth = true
  }
}

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

class MediaVideo extends React.Component {
  state = {
    mediaId: '',
    mediaType: '',
    isAudit: false,
    isShow: false,
  }

  componentWillUnmount() {
    this.player && this.player.dispose()
    this.timer && clearTimeout(this.timer)
  }

  componentDidMount() {
    const params = this.props.match.params.data.split(',')
    const mediaId = params[0]
    const mediaType = params[1]
    const isAudit = !!params[2]
    this.setState({
      mediaId: mediaId,
      mediaType: mediaType,
      isAudit: isAudit,
    })
    this.timer = setTimeout(() => {
      this.player = videojs(this.videoNode, {
        controls: true,
        playbackRates: [1, 2, 4],
        notSupportedMessage: '当前视频源无法播放！',
        width: '700px',
        height: '400px',
      })
      this.player.on('ready', () => {
        this.setState({ isShow: true })
      })
    }, 500)

    this.props.dispatch(getVideoDetail({ id: mediaId, type: mediaType === '4' ? 1 : 2 }))
    this.props.dispatch(getVideoAuditLogs({ serviceId: mediaId, type: mediaType }))
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      const { detail } = this.props
      const fieldsValue = {
        ...values,
        serviceId: this.state.mediaId,
        type: this.state.mediaType,
        // 提审数据的中文名称
        serviceName: detail.title,
        // 提审数据快照
        snapShot: JSON.stringify(detail)
      }
      if (fieldsValue.status === AuditStatusKeyMap.FAIL.value && !fieldsValue.suggestion) {
        message.error('请填写不通过原因')
        return
      }
      this.props.dispatch(postVideoAudit(fieldsValue))
    })
  }

  getVideoTitle = () => {
    const { detail } = this.props
    const status = AuditStatusMap[detail.auditStatus]
    detail.auditStatus = detail.auditStatus + ''
    return (
      <div>
        <span className='margin-right'>{detail.episodeCnName}</span>
        <span className='margin-right'>{`第${detail.title}集`}</span>
        <Tag>分辨率:{AssetBitrateMap[detail.assetBitrate] && AssetBitrateMap[detail.assetBitrate].name}</Tag>
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
        <Button className={styles['back-btn']} onClick={() => { history.go(-1) }}>
          返回
        </Button>
      </div>
    )
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { detail, auditLogs } = this.props
    const { isShow } = this.state
    detail.auditStatus = detail.auditStatus + ''
    return (
      <Card title={this.getVideoTitle()}>
        <Row>
          <Col span={18} offset={3}>
            <div style={isShow ? { display: 'block' } : { display: 'none' }}>
              <div data-vjs-player >
                <video
                  ref={(node) => { this.videoNode = node }}
                  x-webkit-airplay='true'
                  style={{ marginBottom: '30px' }}
                  className='video-js vjs-default-skin vjs-big-play-centered'
                  poster=''
                >
                  <source src={detail.url} />
                </video>
              </div>
            </div>
          </Col>
        </Row>
        {detail.auditStatus === AuditStatusKeyMap.WAIT.value && hasAuth &&
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
              <Button type='primary' htmlType='submit'>
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
                    {log.status + '' === AuditStatusKeyMap.WAIT.value ? '提审人' : '审核人'}：{log.userName}
                  </Col>
                  <Col span={18} offset={6} className={styles['audit-memo']}>
                    {log.suggestion}
                  </Col>
                </Row>
              )
            })}
        </Card>
      </Card>
    )
  }
}

const mapStateToProps = state => {
  return {
    mediaDetail: state.resource.third.detail,
    detail: state.resource.third.videoDetail,
    auditLogs: state.resource.third.videoAuditLogs
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(
  Form.create()(MediaVideo)
)
