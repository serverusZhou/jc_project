import React, { Component } from 'react'
import { Form, Row, Col, Input, Button, Icon } from 'antd'
import { connect } from 'react-redux'
import AliUpload from 'Components/upload/aliUploadV2'
import { getAliToken } from 'Global/action'
import { showepisodeListModal } from '../../component/episodeListModal'
import { handleImgUrl } from 'Utils/ottUtils'

const FormItem = Form.Item
const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 }}

const uploadButton = (
  <div>
    <Icon type='plus' />
    <div className='ant-upload-text'>上传封面图</div>
  </div>
)

class VideoForm extends Component {
  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getAliToken())
  }
  _normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }
  _handleSubmit = () => {
    const { form, onOk } = this.props
    const { getFieldsValue, validateFields, resetFields } = form
    validateFields((err, values) => {
      if (!err) {
        const values = getFieldsValue()
        onOk({
          ...getFieldsValue(),
          imageUrl: values.imgFiles && values.imgFiles[0] ? values.imgFiles[0]['url'] : '',
          flag: 0,
          imgFiles: undefined
        })
        resetFields()
      }
    })
  }
  close = () => {
    this.props.form.resetFields()
    this.props.onClose()
  }
  render() {
    const { aliToken, form, initData } = this.props
    const { getFieldDecorator, setFieldsValue } = form
    return (
      <Form>
        <Row>
          <Col span={22}>
            <FormItem
              {...formItemLayout}
              label='资源ID'
            >
              {getFieldDecorator('videoId', {
                initialValue: (initData && initData.videoId) || '',
                rules: [{
                  required: true,
                  message: '请选择资源!'
                }],
              })(
                <Input
                  maxLength='4'
                  placeholder='请选择资源'
                  onClick={() => showepisodeListModal({
                    showHighlight: false,
                    onSelect: (data) => {
                      this.setState({ vedioSource: data })
                      setFieldsValue({ videoId: data.id, name: data.episodeCnName, imgFiles: [{ uid: 0, url: handleImgUrl(data.cover34Url) }] })
                    }
                  }, {
                    title: '选择',
                    width: 800
                  })}
                />
          )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <FormItem
              {...formItemLayout}
              label = '一级标题'
            >
              {getFieldDecorator('name', {
                initialValue: (initData && initData.name) || '',
                rules: [{
                  required: true,
                  message: '请输入一级标题!'
                }],
              })(
                <Input placeholder={`请输入一级标题`} />
                        )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <FormItem
              {...formItemLayout}
              label = '二级标题'
            >
              {getFieldDecorator('subName', {
                initialValue: (initData && initData.subName) || '',
              })(
                <Input placeholder={`请输入二级标题`} />
                        )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <FormItem
              {...formItemLayout}
              label = 'URL'
            >
              {getFieldDecorator('url', {
                initialValue: (initData && initData.url) || '',
              })(
                <Input placeholder={`请输入URL`} />
                        )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <FormItem
              {...formItemLayout}
              label = '封面图'
            >
              {getFieldDecorator('imgFiles', {
                valuePropName: 'fileList',
                getValueFromEvent: this._normFile,
                initialValue: initData && initData.imageUrl && [{ uid: 0, url: handleImgUrl(initData.imageUrl) }],
              })(
                <AliUpload
                  listType='picture-card' aliToken={aliToken} rootPath='tvOperate'
                  accept='image/*' max={1}
                >
                  {uploadButton}
                </AliUpload>
                        )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={22} style={{ textAlign: 'right' }}>
            <Button
              className='input-plus-btn'
              type='primary'
              onClick={(e) => this._handleSubmit(e)}
            >
                确认
              </Button>
            <Button style={{ marginLeft: '6px' }} className='input-plus-btn' onClick={this.close}>
                取消
            </Button>
          </Col>
        </Row>
      </Form>
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(VideoForm))
