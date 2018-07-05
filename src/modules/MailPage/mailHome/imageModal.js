import React, { Component } from 'react'
import { Modal, Form, Input } from 'antd'
import { UpLoadBtn } from '../../components/styleComponents'
import AliUpload from '../../components/upload/aliUpload'
// import { imgPrefix } from 'Utils/config'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}

class ImageModal extends Component {
  // 图片上传控制
  normFile = e => {
    if (Array.isArray(e)) {
      return e
    }
    let fileList = e && e.fileList
    fileList = fileList.map(file => {
      if (file.response && file.response.requestUrls) {
        // file.url = imgPrefix.concat(file.response.requestUrls[0].slice(48))
        file.url = file.response.requestUrls[0]
      }
      return file
    })
    return fileList
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { onSubmit, info } = this.props
        const updataInfo = {
          posId: info.posId,
          type: info.type,
          url: values.url,
          homePicReqs: values.images.map((item, index) => ({ url: item.url, playOrder: index + 1 }))
        }
        onSubmit(updataInfo)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { info, isShowModal, modalLoading, hideModal, qiniuToken } = this.props
    const picRes = info.homePagePicRes
    const commonUploadConfig = {
      listType: 'picture-card',
      // action: 'http://upload.qiniu.com',
      aliToken: qiniuToken,
      accept: 'image/jpg, image/jpeg, image/png',
      needOrder: info.posId === 1,
      max: info.posId === 1 ? 5 : 1
    }
    return (
      <Modal
        destroyOnClose
        visible={isShowModal}
        onOk={this.handleSubmit}
        onCancel={hideModal}
        title={'配置内容'}
        okText={'确认'}
        confirmLoading={modalLoading}
      >
        <Form className={'modal-form'}>
          <FormItem label='URL地址：' {...formItemLayout}>
            {getFieldDecorator('url', {
              initialValue: info.url || '',
              rules: [{ required: true, message: '请填写URL地址！' }]
            })(<Input placeholder='请输入链接地址' />)}
          </FormItem>
          <FormItem label='上传图片：' {...formItemLayout}>
            {getFieldDecorator('images', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
              initialValue: picRes && picRes.length > 0 ? picRes.map((e, i) => ({ url: e.url, uid: i })) : [],
              rules: [{ required: true, message: '请上传图片！' }]
            })(
              <AliUpload {...commonUploadConfig}>
                <UpLoadBtn />
              </AliUpload>
            )}
          </FormItem>
          <p style={{ paddingLeft: '80px', lineHeight: '1.5', color: '#C0C0C0' }}>
            图片支持png、jpg格式，
            {info.posId === 1 && '建议尺寸：922*520，最多上传五张'}
            {(info.posId === 2 || info.posId === 3) && '建议尺寸：390*520'}
            {(info.posId === 4 || info.posId === 5 || info.posId === 6) && '建议尺寸：566*268'}
          </p>
        </Form>
      </Modal>
    )
  }
}
export default Form.create()(ImageModal)
