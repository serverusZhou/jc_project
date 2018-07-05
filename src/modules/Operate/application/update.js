import React, { Component } from 'react'
import { Form, Modal, Input, Row, Col, Button, Icon, message } from 'antd'

import { connect } from 'react-redux'
import { getAliToken } from 'Global/action'
import { OPERATE_APP_CENTER } from 'Global/urls'
import OrderUpload from 'Components/upload/aliUpload'
import ApkUpload from 'Components/upload'
import { isEmpty } from 'Utils/lang'
import * as actions from './reduck'
import storage from 'Utils/storage'
import { operateUrl } from '../../../config'
import styles from './style.less'

let url = (operateUrl === '/') ? `http://${location.host}` : operateUrl

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}
const formSmallItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

const UploadButton = (
  <div>
    <Icon type='plus' />
    <div className='ant-upload-text'>上传图片(16:9)</div>
  </div>
)

class AddApp extends Component {

  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      coverUrl: [],
      apkInfo: [],
      apkData: {},
    }
  }

  componentWillMount() {
    const { dispatch, match } = this.props
    dispatch(getAliToken())
    dispatch(actions.cateList())
    if (match.params && match.params.appId) {
      dispatch(actions.getDetail({ appId: match.params.appId }))
    }
  }

  componentWillReceiveProps(nextProps) {
    const { detail } = nextProps
    if (this.props.detail !== detail) {
      if (!isEmpty(detail)) {
        const list = detail.imgList.map((item, index) => {
          return { url: item, uid: 'coverUrl' + index }
        })
        this.setState({
          coverUrl: detail.imgList ? list : []
        })
      }
    }
  }

  // 上传前校验
  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
    if (!isJPG) {
      message.error('请上传jpeg、jpg或者png格式的图片!')
    }
    const isLtKb = file.size / 1024 / 1024 < 10
    if (!isLtKb) {
      message.error('请上传10M以下的图片!')
    }
    return isJPG && isLtKb
  }

  // apk上传前校验
  _apkBeforeUpload = (file) => {
    const isFormat = file.type === 'application/vnd.android.package-archive'
    if (!isFormat) {
      message.error('上传文件格式不对!')
    }
    return isFormat
  }

  // 上传图片change事件
  _handleCoverChange = ({ fileList }, type) => {
    const coverImages = fileList.map((file, index) => {
      file.sort = index
      return file
    })
    this.setState({ [type]: coverImages })
  }

  // 图片remove事件
  _handleCoverRemove = (file, type) => {
    const { iconUrl, coverUrl } = this.state
    const data = {
      iconUrl,
      coverUrl
    }
    const index = data[type].indexOf(file)
    data[type].splice(index, 1)
    this.setState({ [type]: data[type] })
  }

  // 上传APK详情图
  _handleApkCoverChange = e => {
    // const apk = e.fileList.map((file, index) => {
    //   if (file.response && file.response.code === 0) {
    //     file.data = file.response.data
    //   }
    //   return file
    // })
    const apkdata = e.fileList[0] && e.fileList[0].response ? e.fileList[0].response.data : {}
    if (!isEmpty(e.fileList) && e.fileList[0].response && e.fileList[0].response.code !== 0) {
      message.error('apk上传失败')
      this.setState({ apkInfo: [] })
      return
    }
    this.setState({
      apkInfo: e.fileList,
      apkData: apkdata
    })
    const { form, match } = this.props
    if (!isEmpty(apkdata) && match.params && match.params.appId) {
      form.setFieldsValue({ appVersion: apkdata.apkMeta.versionName })
    }
  }

  _handleApkCoverRemove = (file) => {
    this.props.form.setFieldsValue({ appVersion: '' })
  }

  // 预览
  _handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  // 关闭预览
  _previewCancel = () => this.setState({ previewVisible: false })

  _handleCancelClick = () => {
    this.props.history.push(OPERATE_APP_CENTER)
  }

  _handleSubmit = (e, isAudit) => {
    const { coverUrl, apkData } = this.state
    const { dispatch, detail, history } = this.props

    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (coverUrl.length < 3) {
          message.error('请上传3张应用截图')
          return false
        }
        const arg = {
          appId: detail.appId,
          appVersion: values.appVersion,
          updateLog: values.updateLog,
          imgList: isEmpty(coverUrl) ? [] : coverUrl.map(image => image.url),
          appVersionCode: apkData.apkMeta.versionCode,
          apkPackageName: apkData.apkMeta.packageName,
          apkUrl: apkData.downloadUrl,
          apkSize: (Number(apkData.packageSize) / 1024 / 1024).toFixed(2),
          md5Code: apkData.md5Code
        }
        dispatch(actions.updateApp(arg)).then((res) => {
          if (res.status === 'success') {
            history.push(OPERATE_APP_CENTER)
          }
        })
      }
    })
  }

  render() {
    const { form, aliToken, detail } = this.props
    const { getFieldDecorator } = form
    const { coverUrl, previewVisible, previewImage, apkInfo, apkData } = this.state
    const userInfo = storage.get('userInfo')

    return (
      <div>
        <Form>
          <Row>
            <Col span={9}>
              <FormItem
                {...formSmallItemLayout}
                label='应用名称：'
              >
                <span>{detail && detail.appName}</span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={9}>
              <FormItem
                {...formSmallItemLayout}
                label='当前版本号：'
              >
                <span>{detail && detail.appVersion}</span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={9}>
              <FormItem
                {...formSmallItemLayout}
                label='版本编号：'
              >
                {getFieldDecorator('appVersion', {
                  rules: [{
                    required: true,
                    message: '请上传APK'
                  }],
                })(
                  <Input
                    placeholder='上传APK后新版本编号'
                    disabled={true}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <FormItem
                {...formItemLayout}
                label='更新日志：'
              >
                {getFieldDecorator('updateLog', {
                  rules: [{
                    required: true,
                    message: '请填写更新说明'
                  }]
                })(
                  <TextArea
                    placeholder='请填写更新说明，最多100字'
                    autosize={{ minRows: 3, maxRows: 6 }}
                    maxLength='100'
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <FormItem
                {...formItemLayout}
                label='安装包：'
              >
                {getFieldDecorator('apkData', {
                  rules: [{
                    required: true,
                    message: '请上传软件安装包'
                  }],
                })(
                  <div>
                    <ApkUpload
                      action={`${url}/api/apk/upload/v1`}
                      beforeUpload={this._apkBeforeUpload}
                      onChange={this._handleApkCoverChange}
                      onRemove={(data) => { this._handleApkCoverRemove(data) }}
                      rootPath='operate'
                      fileList={apkInfo}
                      accept='application/vnd.android.package-archive'
                      headers={{ ticket: userInfo && userInfo.ticket }}
                    >
                      {!isEmpty(apkData) ? '' : <Button><Icon type='upload' /> 上传APK</Button>}
                    </ApkUpload>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <FormItem
                {...formItemLayout}
                label='应用截图：'
              >
                {getFieldDecorator('imgList', {
                  rules: [{
                    required: true,
                    message: '请上传3张应用截图'
                  }],
                  initialValue: coverUrl,
                })(
                  <div>
                    <OrderUpload
                      listType='picture-card'
                      className={styles['app-uploader1']}
                      onPreview={this._handlePreview}
                      beforeUpload={this._beforeUpload}
                      onChange={(data) => { this._handleCoverChange(data, 'coverUrl') }}
                      onRemove={(data) => { this._handleCoverRemove(data, 'coverUrl') }}
                      aliToken={aliToken}
                      rootPath='operate'
                      fileList={coverUrl}
                      accept='image/jpg, image/jpeg, image/png'
                    >
                      {coverUrl.length >= 3 ? null : UploadButton}
                    </OrderUpload>
                    <Modal
                      visible={previewVisible}
                      footer={null}
                      onCancel={this._previewCancel}
                    >
                      <img
                        alt='example'
                        style={{ width: '100%' }}
                        src={previewImage}
                      />
                    </Modal>
                    <p>支持jpg、jpge、png等格式，建议尺寸1782*1002px，大小10M</p>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={18} style={{ textAlign: 'center' }}>
              <Button
                style={{ marginLeft: '6px' }}
                className='input-plus-btn'
                onClick={this._handleCancelClick}
              >
                取消
              </Button>
              <Button
                className='input-plus-btn'
                // icon='plus'
                type='primary'
                onClick={(e) => this._handleSubmit(e)}
              >
                保存
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
    aliToken: state.common.aliToken,
    detail: state.operate.application.detail,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddApp))
