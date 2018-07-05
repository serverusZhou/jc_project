import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  getUnAuditedDetail,
  applyAudit
} from '../reduck'
import {
  Card,
  Form,
  Radio,
  Modal,
  Input,
  Button
} from 'antd'
import style from '../styles.less'

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

class UnAudited extends Component {
  constructor(props) {
    super(props)
    this.state = {
      versionId: this.props.match.params.id,
      previewVisible: false,
      previewImage: '',
      suggestion: ''
    }
  }

  componentWillMount() {
    const { versionId } = this.state
    this.props.dispatch(
      getUnAuditedDetail({ versionId: versionId })
    )
  }

  handlePreview = url => {
    this.setState({
      previewImage: url,
      previewVisible: true
    })
  }

  // modal点击关闭
  handleCancel = () => this.setState({ previewVisible: false })

  _selectValue = (e) => {
    this.setState({
      suggestion: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      const { detail, dispatch } = this.props
      const fieldsValue = {
        ...values,
        serviceId: this.state.versionId,
        type: 7,
        // 提审数据快照
        snapShot: JSON.stringify(detail)
      }
      dispatch(applyAudit(fieldsValue))
    })
  }

  render () {
    const { detail, isBtnLoading } = this.props
    const { getFieldDecorator } = this.props.form
    const { suggestion } = this.state
    return (
      <div>
        <Card>
          <Form>
            <FormItem {...formItemLayout} label='应用名称'>
              {detail.appName}
            </FormItem>
            <FormItem {...formItemLayout} label='应用类型'>
              {detail.cateName}
            </FormItem>
            <FormItem {...formItemLayout} label='应用评分'>
              {detail.score}
            </FormItem>
            <FormItem {...formItemLayout} label='版本号'>
              {detail.appVersion}
            </FormItem>
            <FormItem {...formItemLayout} label='排序序号'>
              {detail.sort}
            </FormItem>
            <FormItem {...formItemLayout} label='应用语言'>
              {detail.language}
            </FormItem>
            <FormItem {...formItemLayout} label='应用简介' style={{ wordBreak: 'break-all' }}>
              {detail.info}
            </FormItem>
            <FormItem {...formItemLayout} label='应用图标'>
              <img
                className={style['icon-style']}
                src={detail.appIcon}
                alt='应用图标'
                onClick={() => this.handlePreview(detail.appIcon)}
              />
            </FormItem>
            <FormItem {...formItemLayout} label='应用截图'>
              {detail.imgList && detail.imgList.map((item, index) => (
                <img
                  key={index}
                  className={style['icon-style']}
                  src={item}
                  alt='应用图标'
                  onClick={() => this.handlePreview(item)}
                />
                )
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='安装包'>
              <a href={detail.apkUrl} download='download' style={{ display: 'block' }}>
                {detail.apkUrl}
              </a>
              <span>文件大小&nbsp;&nbsp;{detail.apkSize}M</span>
            </FormItem>
            <FormItem {...formItemLayout} label='MD5'>
              {detail.md5Code}
            </FormItem>
          </Form>
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
                <RadioGroup onChange={this._selectValue}>
                  <Radio value='3'>通过</Radio>
                  <Radio value='2'>不通过</Radio>
                </RadioGroup>
              )}
            </FormItem>
            {
              suggestion === '2' && <FormItem {...formItemLayout} label='不通过原因'>
                {getFieldDecorator('suggestion', {
                  rules: [
                    {
                      required: true,
                      message: '请填写审核不通过原因'
                    }
                  ]
                })(
                  <Input />
                )}
              </FormItem>
            }
            <FormItem {...tailFormItemLayout}>
              <Button type='primary' htmlType='submit' loading={isBtnLoading}>
                审核
              </Button>
            </FormItem>
          </Form>
        </Card>
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt='' style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    detail: state.resource.audit.unAuditedDetail,
    isBtnLoading: state.common.showButtonSpin
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(UnAudited))

