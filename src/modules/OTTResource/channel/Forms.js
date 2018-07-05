import React, { Component } from 'react'
import { Form, Input, Row, Col, Button, Switch } from 'antd'

const FormItem = Form.Item

const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 }}

class Forms extends Component {

  _handleSubmit() {
    const { form } = this.props
    form.validateFields((err, values) => {
      if (err) { return }
      form.resetFields()
      this.props.callBack({ ...values, enable: Number(values.enable) })
    })
  }

  render() {
    const { form, values } = this.props
    const { getFieldDecorator } = form
    return (
      <div>
        <Form>
          {
                values.map((value, index) => {
                  if (value.type === 'Input') {
                    return (
                      <Row key={index}>
                        <Col span={22}>
                          <FormItem
                            {...formItemLayout}
                            label={value.label}
                          >
                            {getFieldDecorator(value.field, {
                              initialValue: value.initialValue,
                              rules: value.rules
                            })(
                              <Input placeholder={`请输入${value.label}`} />
                        )}
                          </FormItem>
                        </Col>
                      </Row>
                    )
                  }
                  if (value.type === 'Switch') {
                    return (
                      <Row key={index}>
                        <Col span={22}>
                          <FormItem
                            {...formItemLayout}
                            label={value.label}
                          >
                            {getFieldDecorator(value.field, { valuePropName: 'checked', initialValue: value.initialValue })(
                              <Switch checkedChildren='开' unCheckedChildren='关' />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    )
                  }
                })
            }
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

export default Form.create()(Forms)
