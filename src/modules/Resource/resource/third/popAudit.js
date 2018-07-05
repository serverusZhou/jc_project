import { Form, Input, Modal, Radio, message } from 'antd'
import React, { Component } from 'react'
import * as actions from './reduck'
import style from './styles.less'
import { AuditStatusKeyMap, MediaAuditType } from '../../audit/dict'

const FormItem = Form.Item
const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  }
}

class PopAudit extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  _handleItem = e => {
    this.setState({
      type: e.target.value
    })
  }

  _handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }
      const { detail, dispatch, episodeId } = this.props
      const fieldsValue = {
        ...values,
        serviceId: episodeId,
        type: MediaAuditType.Episode,
        // 提审数据的中文名称
        serviceName: detail.episodeAttr && detail.episodeAttr.episodeCnName,
        // 提审数据快照
        snapShot: JSON.stringify(detail)
      }
      if (fieldsValue.status === AuditStatusKeyMap.FAIL.value && !fieldsValue.suggestion) {
        message.error('请填写不通过原因')
        return
      }

      dispatch(actions.postEpisodeAudit(fieldsValue)).then(res => {
        if (res.status === 'success') {
          dispatch(actions.getDetail({ episodeId: episodeId }))
          // 获取当前介质的审核信息
          dispatch(actions.getEpisodeAuditDetail({ serviceId: episodeId, type: MediaAuditType.Episode }))
        }
      })
    })
  }

  _handleCancel = () => {
    this.props.dispatch(actions.showAuditPop(false))
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title='介质审核'
        visible={this.props.showAuditModal}
        onOk={this._handleOk}
        onCancel={this._handleCancel}
        style={{ top: '30px' }}
      >
        <Form className={style['form-media']}>
          <FormItem {...formItemLayout} label='审核'>
            {getFieldDecorator('status', {
              rules: [
                {
                  required: true,
                  message: '请选择审核状态'
                }
              ]
            })(
              <RadioGroup>
                <Radio value={AuditStatusKeyMap.PASS.value}>通过</Radio>
                <Radio value={AuditStatusKeyMap.FAIL.value}>不通过</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='审核备注'>
            {getFieldDecorator('suggestion', {})(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(PopAudit)
