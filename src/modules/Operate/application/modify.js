import React, { Component } from 'react'
import { Form, Modal, Input, Row, Col, Button, Select, Icon, message } from 'antd'

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

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}
const formSmallItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

const scoreAry = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
let url = (operateUrl === '/') ? `http://${location.host}` : operateUrl

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
      iconUrl: [],
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
        const apkdata = {
          downloadUrl: detail.apkUrl,
          packageSize: detail.apkSize * 1024 * 1024,
          md5Code: detail.md5Code,
          apkMeta: {
            versionCode: detail.appVersionCode,
            packageName: detail.apkPackageName
          }
        }
        this.props.form.setFieldsValue({ appName: detail.appName })
        this.props.form.setFieldsValue({ appVersion: detail.appVersion })
        this.setState({
          iconUrl: detail.appIcon ? [{ url: detail.appIcon, uid: 'iconUrl' }] : [],
          coverUrl: detail.imgList ? list : [],
          apkData: apkdata,
          apkInfo: [{
            uid: 'apkinfo',
            name: detail.apkPackageName,
            status: 'done',
            response: { code: 0, data: apkdata }
          }]
        })
      }
    }
  }

  // 上传前校验
  _beforeUpload = (file) => {
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
    if (!isEmpty(apkdata)) {
      this.props.form.setFieldsValue({ appName: apkdata.apkMeta.label })
      this.props.form.setFieldsValue({ appVersion: apkdata.apkMeta.versionName })
    }
  }

  _handleApkCoverRemove = (file) => {
    this.props.form.setFieldsValue({ appName: '' })
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

  _handleSubmit = e => {
    const { iconUrl, coverUrl, apkData } = this.state
    const { dispatch, match, detail, history } = this.props

    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (coverUrl.length < 3) {
          message.error('请上传3张应用截图')
          return false
        }
        if (isEmpty(apkData)) {
          message.error('请上传软件安装包')
          return false
        }
        const arg = {
          appName: values.appName,
          cateId: values.cateId,
          appVersion: values.appVersion,
          language: values.language,
          score: values.score,
          info: values.info,
          appIcon: iconUrl[0].url,
          imgList: isEmpty(coverUrl) ? [] : coverUrl.map(image => image.url),
          appVersionCode: apkData.apkMeta.versionCode,
          apkPackageName: apkData.apkMeta.packageName,
          apkUrl: apkData.downloadUrl,
          apkSize: (Number(apkData.packageSize) / 1024 / 1024).toFixed(2),
          md5Code: apkData.md5Code
        }
        if (match.params.appId) {
          arg.appId = detail.appId
          arg.versionId = detail.versionId
        }
        dispatch(actions.modifyApplication(arg)).then((res) => {
          if (res.status === 'success') {
            history.push(OPERATE_APP_CENTER)
          }
        })
      }
    })
  }

  render() {
    const { form, aliToken, cateList, detail } = this.props
    const { getFieldDecorator } = form
    const { iconUrl, coverUrl, previewVisible, previewImage, apkInfo, apkData } = this.state
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
                {getFieldDecorator('appName', {
                  rules: [{
                    required: true,
                    message: '请上传APK'
                  }],
                })(
                  <Input
                    placeholder='上传APK后自动获取'
                    maxLength='30'
                    disabled={true}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={9}>
              <FormItem
                {...formSmallItemLayout}
                label='应用类型：'
              >
                {getFieldDecorator('cateId', {
                  rules: [{
                    required: true,
                    message: '请选择应用类型'
                  }],
                  initialValue: isEmpty(detail) ? undefined : detail.cateId
                })(
                  <Select
                    allowClear
                    showSearch={false}
                    placeholder='请选择类型'
                    filterOption={false}
                    required={true}
                  >
                    {cateList && cateList.map(item => (
                      <Option
                        key={item.cateId}
                        value={item.cateId}
                      >
                        {item.cateName}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={9}>
              <FormItem
                {...formSmallItemLayout}
                label='版本号：'
              >
                {getFieldDecorator('appVersion', {
                  rules: [{
                    required: true,
                    message: '请上传APK'
                  }],
                })(
                  <Input
                    placeholder='上传APK后自动获取'
                    disabled={true}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={9}>
              <FormItem
                {...formSmallItemLayout}
                label='应用语言：'
              >
                {getFieldDecorator('language', {
                  rules: [{
                    required: true,
                    message: '请选择应用语言'
                  }],
                  initialValue: isEmpty(detail) ? undefined : detail.language
                })(
                  <Select
                    allowClear
                    showSearch={false}
                    placeholder='请选择'
                    filterOption={false}
                    required={true}
                  >
                    <Option value='中文'>中文</Option>
                    <Option value='英文'>英文</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={9}>
              <FormItem
                {...formSmallItemLayout}
                label='应用评分：'
              >
                {getFieldDecorator('score', {
                  rules: [{
                    required: true,
                    message: '请选择应用评分'
                  }],
                  initialValue: isEmpty(detail) ? undefined : detail.score
                })(
                  <Select
                    allowClear
                    showSearch={false}
                    placeholder='请选择'
                    filterOption={false}
                    required={true}
                  >
                    {scoreAry && scoreAry.map(value => (
                      <Option
                        key={value}
                        value={value}
                      >
                        {value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <FormItem
                {...formItemLayout}
                label='简介：'
              >
                {getFieldDecorator('info', {
                  rules: [{
                    required: true,
                    message: '请输入应用简介'
                  }],
                  initialValue: isEmpty(detail) ? undefined : detail.info
                })(
                  <TextArea
                    placeholder='请输入应用简介，最多200字'
                    autosize={{ minRows: 3, maxRows: 6 }}
                    maxLength='200'
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <FormItem
                {...formItemLayout}
                label='应用图标：'
              >
                {getFieldDecorator('iconUrl', {
                  rules: [{
                    required: true,
                    message: '请上传应用图标'
                  }],
                  initialValue: iconUrl
                })(
                  <div>
                    <OrderUpload
                      listType='picture-card'
                      className={styles['app-uploader1']}
                      onPreview={this._handlePreview}
                      beforeUpload={this._beforeUpload}
                      onChange={(data) => { this._handleCoverChange(data, 'iconUrl') }}
                      onRemove={(data) => { this._handleCoverRemove(data, 'iconUrl') }}
                      aliToken={aliToken}
                      rootPath='operate'
                      fileList={iconUrl}
                      accept='image/jpg, image/jpeg, image/png'
                    >
                      {iconUrl.length >= 1 ? null : <div><Icon type='plus' /><div className='ant-upload-text'>上传图片</div></div>}
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
                    <p>支持jpg、jpge、png等格式，建议尺寸300*300px，大小10M</p>
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
                      className={styles['app-uploader1']}
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
            <Col span={18}>
              <FormItem
                {...formItemLayout}
                label='安装包：'
              >
                {getFieldDecorator('apkUrl', {
                  rules: [{
                    required: true,
                    message: '请上传软件安装包'
                  }],
                  initialValue: apkData
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
    cateList: state.operate.application.cateList,
    detail: state.operate.application.detail,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddApp))
