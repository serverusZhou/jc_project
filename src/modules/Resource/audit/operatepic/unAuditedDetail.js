import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  getOperatePicUnAuditedDetail,
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
const source = {
  '1': '运营图', '2': '轮播位图'
}

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

class UnAuditedOperatePic extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sourceId: this.props.match.params.id,
      previewVisible: false,
      previewImage: '',
      suggestion: ''
    }
  }

  componentWillMount() {
    const { sourceId } = this.state
    this.props.dispatch(
      getOperatePicUnAuditedDetail({ sourceId: sourceId })
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
        serviceId: this.state.sourceId,
        type: 8,
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
            <FormItem {...formItemLayout} label='图片'>
              <img
                style={{ width: '300px' }}
                className={style['icon-style']}
                src={detail.operaterPic}
                alt='图片'
                onClick={() => this.handlePreview(detail.operaterPic)}
              />
            </FormItem>
            <FormItem {...formItemLayout} label='分类'>
              {source[detail.source]}
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
    detail: state.resource.audit.unAuditedPicDetail,
    isBtnLoading: state.common.showButtonSpin
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(UnAuditedOperatePic))

