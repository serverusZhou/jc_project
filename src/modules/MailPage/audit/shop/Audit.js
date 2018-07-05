import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Modal, Input, Radio, Spin, message, Divider } from 'antd'
import Detail from './Detail'
import * as reduck from './reduck'
import '../goods/styles.css'

const RadioGroup = Radio.Group
const auditInfo = {
  audit: '审核结果',
  remark: '原因'
}

class Audit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      auditResType: '1'
    }
  }
  static defaultProps = {
    shopId: '',
    isShowModal: false,
    isModalLoading: false
  }

  _handleCancel = () => {
    this.props.dispatch(reduck.showModalAction(false))
    this._handleResetFields()
  }

  _handleResetFields = () => {
    this.props.form.resetFields()
    this.setState({ auditResType: '1' })
  }

  _handleOk = () => {
    this.props.form.validateFields(async (errors, values) => {
      if (!errors) {
        let response = await this.props.dispatch(reduck.auditShop({ shopId: this.props.shopId, ...values }))
        this._handleOkCallBack(response)
      }
    })
  }
  _handleOkCallBack = async response => {
    if (response.code === 0) {
      this.props.dispatch(reduck.showModalAction(false))
      this.props.handleTableSendAction()
      this._handleResetFields()
    } else {
      message.error(response.errmsg)
    }
  }
  _handleRadioChange = e => {
    this.setState({ auditResType: `${e.target.value}` })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title='店铺审核'
        width='800px'
        visible={this.props.isShowModal}
        onOk={this._handleOk}
        onCancel={this._handleCancel}
        confirmLoading={this.props.isModalLoading}
      >
        <Form>
          <Spin spinning={this.props.isModalLoading}>
            <Detail />
            <Divider key='Divider_02' style={{ marginBottom: 32 }} />
            <div key='store' className='audit-title'>
              审核建议
            </div>
            <Form.Item label={auditInfo.audit}>
              {getFieldDecorator('auditResType', {
                initialValue: 1,
                rules: [
                  {
                    required: true,
                    message: '请审核'
                  }
                ]
              })(
                <RadioGroup onChange={this._handleRadioChange}>
                  <Radio value={1}>通过</Radio>
                  <Radio value={2}>不通过</Radio>
                </RadioGroup>
              )}
            </Form.Item>
            {this.state.auditResType === '2' && (
              <Form.Item label={auditInfo.remark}>
                {getFieldDecorator('auditMessage', {
                  rules: [
                    {
                      required: true,
                      message: '请输入不通过原因'
                    }
                  ]
                })(<Input.TextArea placeholder='请输入不通过原因' />)}
              </Form.Item>
            )}
          </Spin>
        </Form>
      </Modal>
    )
  }
}

const mapDispatchToProps = dispatch => ({ dispatch })
const mapStateToProps = state => {
  return {
    shopId: state.auditShopReduck.shopId,
    isModalLoading: state.globalReduck.showSpinBool
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Audit))
