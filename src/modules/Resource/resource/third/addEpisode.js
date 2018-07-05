import { Form, Input, Modal, Radio, message } from 'antd'
import React, { Component } from 'react'
import * as actions from './reduck'
import style from './styles.less'
import { isEmpty, trim } from 'Utils/lang'

const FormItem = Form.Item
const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
}

class AddEpisode extends Component {

  constructor(props) {
    super(props)
    this.state = {
      type: 1
    }
  }

  _handleItem = (e) => {
    const { setFieldsValue } = this.props.form
    setFieldsValue({ params: '' })
    this.setState({
      type: e.target.value
    })
  }

    // 重名校验
  _validDuplicate = (list, fieldName, target) => {
    if (isEmpty(list)) return false
    return list.some(item => item[fieldName].toString() === trim(target))
  }

  _handleOk = () => {
    const { dispatch, mediaList, highlightList } = this.props
    const { type } = this.state
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
         // 剧集、花絮重名校验
        let isDuplicate = false
        if (type === 1) {
          isDuplicate = this._validDuplicate(mediaList, 'sort', values.params)
        } else {
          isDuplicate = this._validDuplicate(highlightList, 'title', values.params)
        }
        if (isDuplicate) {
          message.error('剧集或花絮已存在！')
          return
        }

        let videoList = []
        values.baseUrl ? videoList.push({ assetBitrate: '1', url: values.baseUrl }) : ''
        values.highUrl ? videoList.push({ assetBitrate: '2', url: values.highUrl }) : ''
        values.superUrl ? videoList.push({ assetBitrate: '3', url: values.superUrl }) : ''
        values.url1024p ? videoList.push({ assetBitrate: '4', url: values.url1024p }) : ''
        let params = type === 1 ? {
          parentEpisodeId: this.props.episodeId,
          sort: values.params,
          videoList: videoList
        } : {
          episodeId: this.props.episodeId,
          title: values.params,
          videoList: videoList
        }
        dispatch(actions.addEpisode(params, () => this.props.form.resetFields())).then(res => {
          res.status === 'success' ? dispatch(actions.getDetail({ episodeId: this.props.episodeId })) : ''
        })
      }
    })
  }

  _handleCancel = () => {
    this.props.dispatch(actions.isShowModal(0, false))
    this.props.form.resetFields()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title='添加剧集'
        visible={this.props.showAddModal}
        maskClosable={false}
        onOk={this._handleOk}
        onCancel={this._handleCancel}
        style={{ top: '30px' }}
      >
        <Form className={style['form-media']}>
          <FormItem
            {...formItemLayout}
            label='类型：'
          >
            <RadioGroup value={this.state.type} onChange={this._handleItem}>
              <Radio value={1}>剧集</Radio>
              <Radio value={2}>花絮</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.state.type === 1 ? '集数' : '标题'}
          >
            {getFieldDecorator('params', {
              rules: [{
                required: true,
                pattern: this.state.type === 1 ? '^\\+?[1-9][0-9]*$' : '',
                message: '请输入集数或者花絮标题(集数为正整数)'
              }]
            })(
              <Input
                type='text'
                placeholder='请输入集数或者花絮标题'
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='源文件：'
          >
            {(
              <div>
                <span>请添加不同分辨率的URL文件</span>
              </div>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='240'
            className={style['nodian']}
          >
            {getFieldDecorator('baseUrl', {
              rules: [{
                required: true,
                message: '请填写URL'
              }]
            })(
              <Input
                type='text'
                placeholder='请输入URL源文件链接'
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='480'
            className={style['nodian']}
          >
            {getFieldDecorator('highUrl', {
              rules: [{
                required: true,
                message: '请填写URL'
              }]
            })(
              <Input
                type='text'
                placeholder='请输入URL源文件链接'
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='720'
            className={style['nodian']}
          >
            {getFieldDecorator('superUrl', {
              rules: [{
                required: true,
                message: '请填写URL'
              }]
            })(
              <Input
                type='text'
                placeholder='请输入URL源文件链接'
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='1080'
            className={style['nodian']}
          >
            {getFieldDecorator('url1024p', {
              rules: [{
                required: true,
                message: '请填写URL'
              }]
            })(
              <Input
                type='text'
                placeholder='请输入URL源文件链接'
              />
            )}
          </FormItem>
        </Form>
      </Modal>)
  }
}

export default Form.create()(AddEpisode)
