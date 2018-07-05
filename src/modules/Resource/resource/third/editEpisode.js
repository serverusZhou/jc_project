import { Form, Input, Modal, Row, Col } from 'antd'
import React, { Component } from 'react'
import * as actions from './reduck'
import style from './styles.less'

const FormItem = Form.Item

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

const assetBitrate = {
  '1': '240',
  '2': '480',
  '3': '720',
  '4': '1080',
}

class EditEpisode extends Component {

  _handleOk = () => {
    const { dispatch } = this.props
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        dispatch(
          actions.editEpisode({
            id: this.props.ediUrlParams.id,
            type: this.props.ediUrlParams.type,
            url: values.url,
            episodeId: this.props.episodeId
          }, () => this.props.form.resetFields())
        )
      }
    })
  }

  _handleCancel = () => {
    this.props.dispatch(actions.isShowModal(1, false))
    this.props.form.resetFields()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { ediUrlParams } = this.props
    return (
      <Modal
        title='编辑剧集'
        visible={this.props.showEditModal}
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
            {ediUrlParams.type === 1 ? '剧集' : '花絮'}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='标题：'
          >
            {ediUrlParams.title}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='源文件：'
          >
            <Row>
              <Col span={4}>{assetBitrate[ediUrlParams.asset]}</Col>
              <Col span={20}>
                {(getFieldDecorator('url', {
                  rules: [{
                    required: true,
                    message: '请填写URL'
                  }],
                  initialValue: ediUrlParams.url
                }))(
                  <Input
                    type='text'
                    placeholder='请输入URL源文件链接'
                    maxLength='280'
                  />
                )}
              </Col>
            </Row>

          </FormItem>
        </Form>
      </Modal>)
  }
}

export default Form.create()(EditEpisode)
