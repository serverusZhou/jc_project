import React, { Component } from 'react'
import { Form, Input, Row, Col, Button, Switch } from 'antd'

const FormItem = Form.Item

const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 }}

class AddAudit extends Component {

  _handleSubmit() {
    const { form } = this.props
    form.validateFields((err, values) => {
      if (err) { return }
      this.props.callBack(values)
    })
  }

  render() {
    const { form } = this.props
    const { getFieldDecorator } = form
    return (
      <div>
        <Form>
          <Row>
            <Col span={22}>
              <FormItem
                {...formItemLayout}
                label='名称：'
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    message: '请输入名称',
                    max: 20
                  }],
                })(
                  <Input placeholder='请输入名称' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={22}>
              <FormItem
                {...formItemLayout}
                label='启用：'
              >
                {getFieldDecorator('enable', { initialValue: false })(
                  <Switch checkedChildren='开' unCheckedChildren='关' />
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
              <Button
                style={{ marginLeft: '6px' }}
                className='input-plus-btn'
                onClick={this.props.onClose}
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

export default Form.create()(AddAudit)
