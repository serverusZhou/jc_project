import React, { Component } from 'react'
import { Form, Icon, Input, message, Row, Col, Button } from 'antd'

import { connect } from 'react-redux'
import { getAliToken } from 'Global/action'
import OrderUpload from 'Components/upload/aliUpload'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}

const uploadButton = (
  <div>
    <Icon type='plus' />
  </div>
)

const apkUploadButton = (
  <Button>
    <Icon type='upload' /> 上传APK
  </Button>
)
class AddAudit extends Component {

  constructor(props) {
    super(props)
    this.state = {
      channelImgUrl: [],
      downloadUrl: [],
      showModal: false,
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getAliToken())
  }
  // 上传详情图
  _handleCoverChange = ({ fileList }, imgType) => {
    const coverImages = fileList.map((file, index) => {
      if (file.response) {
        file.imageType = '1'
        file.sort = index
        file.url = file.response.url
        file.name = file.response.name
      }
      return file
    })
    this.setState({ [imgType]: coverImages })
  }
  // 上传APK详情图
  _handleApkCoverChange = ({ fileList }, imgType) => {
    const coverImages = fileList.map((file, index) => {
      if (file.response) {
        file.imageType = '1'
        file.sort = index
        file.url = file.response.url
        file.name = file.response.name
      }
      return file
    })
    this.setState({ [imgType]: coverImages })
  }

  // 上传前校验
  _beforeUpload = (file) => {
    const isFormat = ['image/jpg', 'image/jpeg', 'image/png'].includes(file.type)
    if (!isFormat) {
      message.error('图片格式不对!')
    }
    const isLt50M = file.size / 1024 / 1024 < 50
    if (!isLt50M) {
      message.error('上传的图片不能大于50M!')
    }
    return isFormat && isLt50M
  }

  // 上传前校验
  _apkBeforeUpload = (file) => {
    const isFormat = file.type === 'application/vnd.android.package-archive'
    if (!isFormat) {
      message.error('上传文件格式不对!')
    }
    const isLt45M = file.size / 1024 / 1024 < 45
    if (!isLt45M) {
      message.error('上传文件不能大于45M!')
    }
    return isFormat && isLt45M
  }

  _handleSubmit(e) {
    const { handlerAdd } = this.props
    e.preventDefault()
    const { form, onClose } = this.props
    const {
      channelImgUrl,
      downloadUrl
    } = this.state
    form.validateFields((err, values) => {
      if (!err) {
        const arg = {
          channelLogoUrl: channelImgUrl && channelImgUrl[0] && channelImgUrl[0].url,
          updateInfo: values.updateInfo,
          downloadUrl: downloadUrl && downloadUrl[0] && downloadUrl[0].url
        }
        handlerAdd(arg)
        onClose && onClose()
      }
    })
    this.clearInputContent()
  }
  _handleCancelClick = () => {
    const { onClose } = this.props
    onClose && onClose()
    this.clearInputContent()
  }

  clearInputContent = () => {
    this.setState({
      channelImgUrl: [],
      downloadUrl: []
    })
  }

  componentWillUnmount() {
    this.clearInputContent()
  }

  render() {
    const { form, aliToken } = this.props
    const { channelImgUrl, downloadUrl } = this.state

    const { getFieldDecorator } = form
    return (
      <div>
        <Form
          onSubmit={() => this._handleSubmit()}
        >
          <Row>
            <Col span={22}>
              <FormItem
                {...formItemLayout}
                label='图片：'
              >
                {getFieldDecorator('channelLogoUrl', {
                  initialValue: [],
                  rules: [{
                    required: true,
                    message: '请选择图片',
                  }]
                })(
                  <div>
                    <OrderUpload
                      listType='picture-card'
                      beforeUpload={this._beforeUpload}
                      onChange={(e) => this._handleCoverChange(e, 'channelImgUrl')}
                      aliToken={aliToken}
                      showUploadList={false}
                      rootPath='operate'
                      fileList={channelImgUrl}
                      accept='image/jpg, image/jpeg, image/png'
                    >
                      {channelImgUrl && channelImgUrl.length > 0 ? <img src={channelImgUrl && channelImgUrl[channelImgUrl.length - 1] && channelImgUrl[channelImgUrl.length - 1].url} style={{ width: '100%', height: '100%' }} /> : uploadButton}
                    </OrderUpload>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={22}>
              <FormItem
                {...formItemLayout}
                label='安装包：'
              >
                {getFieldDecorator('downloadUrl', {
                  initialValue: [],
                })(
                  <div>
                    <OrderUpload
                      beforeUpload={this._apkBeforeUpload}
                      onChange={(e) => this._handleApkCoverChange(e, 'downloadUrl')}
                      aliToken={aliToken}
                      showUploadList={false}
                      rootPath='operate'
                      fileList={downloadUrl}
                      accept='application/vnd.android.package-archive'
                    >
                      {(downloadUrl && downloadUrl[downloadUrl.length - 1] && downloadUrl[downloadUrl.length - 1].url) ? downloadUrl[downloadUrl.length - 1].url : apkUploadButton}
                    </OrderUpload>
                  </div>
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={22}>
              <FormItem
                {...formItemLayout}
                label='更新内容：'
              >
                {getFieldDecorator('updateInfo', {
                  rules: [{
                    required: true,
                    message: '请输入更新详情',
                    // max: 50
                  }],
                  // initialValue: detail.roleDesc
                })(
                  <TextArea
                    placeholder='请输入更新详情'
                    autosize={{ minRows: 2, maxRows: 6 }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={22} style={{ textAlign: 'right' }}>
              <Button
                className='input-plus-btn'
                // icon='plus'
                type='primary'
                onClick={(e) => this._handleSubmit(e)}
              >
                确认
              </Button>
              <Button
                style={{ marginLeft: '6px' }}
                className='input-plus-btn'
                onClick={this._handleCancelClick}
              >
                取消
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,

    aliToken: state.common.aliToken,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddAudit))
