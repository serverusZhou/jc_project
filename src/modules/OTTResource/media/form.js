import React, { Component } from 'react'
import { connect } from 'react-redux'
import style from './style.module.less'
import { Form, Input, Button, Icon, Switch } from 'antd'
import AliUpload from 'Components/upload/aliUploadV2'
import { getAliToken } from 'Global/action'
import { showepisodeListModal } from '../component/episodeListModal'

const FormItem = Form.Item
const uploadButton = (
  <div>
    <Icon type='plus' />
    <div className='ant-upload-text'>上传封面图</div>
  </div>
)

class ConfigVideo extends Component {
  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getAliToken())
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        if (this.props.saveVideoData) {
          const { card } = this.props
          const { sort } = card
          const newValues = {
            url: values.imgFiles && values.imgFiles[0] ? values.imgFiles[0]['url'] : '',
            videoId: values.videoId,
            title: values.title,
            sort,
            isEnable: values.isEnable ? 1 : 0,
          }
          const result = await this.props.saveVideoData(newValues)
          if (result) {
            this.props.form.resetFields()
          }
        }
      }
    })
  }
  _normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    }
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 2,
      }
    }
    const { card, aliToken } = this.props
    const { getFieldDecorator, setFieldsValue } = this.props.form
    return (
      <div className={style.configModule}>
        <p>视频配置</p>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <FormItem
            {...formItemLayout}
            label='是否启用'
          >
            {getFieldDecorator('isEnable', {
              valuePropName: 'checked',
              initialValue: Boolean(card.isEnable)
            })(
              <Switch />
                        )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='资源'
          >
            {getFieldDecorator('videoId', {
              initialValue: (card && card.videoId) || '',
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
                    console.info('vedioSourcevedioSource', data)
                    this.setState({ vedioSource: data })
                    setFieldsValue({ videoId: data.id, title: data.episodeCnName, imgFiles: [{ uid: 0, url: data.cover34Url }] })
                  }
                }, {
                  title: '选择',
                  width: 800
                })}
              />
          )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='一级标题'
          >
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入标题名称' }],
              initialValue: card.title
            })(
              <Input maxLength='20' />
                        )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='封面图'
          >
            {getFieldDecorator('imgFiles', {
              valuePropName: 'fileList',
              getValueFromEvent: this._normFile,
              initialValue: card && card.url && [{ uid: 0, url: card.url }],
            })(
              <AliUpload
                listType='picture-card' aliToken={aliToken} rootPath='tvOperate'
                accept='image/*' max={1}
              >
                {uploadButton}
              </AliUpload>
                        )}
          </FormItem>

          <FormItem {...tailFormItemLayout}>
            <Button
              key='submit' type='primary' htmlType='submit'
              loading={this.props.loading} className={style.saveButton}
            >保存</Button>
            <Button onClick={this.props.backToList}>返回</Button>
          </FormItem>
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ConfigVideo))
