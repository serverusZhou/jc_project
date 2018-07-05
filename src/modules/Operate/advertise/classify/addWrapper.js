import { Component } from 'react'
import styles from '../advertise.less'

import { Button, Form, Row, Col, Input } from 'antd'

const FormItem = Form.Item

const specFormItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}

class AddWrapper extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  _handleSubmit = (e) => {
    const { handlerAdd, data } = this.props
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        handlerAdd(values, data && data.positionId)
      }
    })
  }
  render() {
    const { form, data } = this.props
    const { getFieldDecorator } = form

    return (
      <Form
        onSubmit={this._handleSubmit}
      >
        <Row>
          <Col span={22}>
            <FormItem
              {...specFormItemLayout}
              label={'广告位名称'}
            >
              <div
                id='name'
                style={{ position: 'relative', marginBottom: '5px' }}
              >
                {getFieldDecorator('name', {
                  initialValue: data && data.name || '',
                  rules: [{
                    required: true,
                    message: '请输入名称',
                  }]
                })(
                  <Input
                    maxLength='50'
                    placeholder={'请输入广告位名称'}
                  />
                )}
              </div>
            </FormItem>
          </Col>
        </Row>

        <FormItem className={styles['operate-btn']}>
          <Button
            title='点击保存'
            type='primary'
            htmlType='submit'
          >
            保存
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(AddWrapper)
