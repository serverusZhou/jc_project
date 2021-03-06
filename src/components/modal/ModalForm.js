import React from 'react'
import ReactDOM from 'react-dom'
import { Modal, Form, Input, Button, message } from 'antd'
import styles from './ModalForm.less'

const defaultFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

const FormItem = Form.Item

const showModalForm = (params = {}) => {
  const maskDiv = document.createElement('div')
  document.body.appendChild(maskDiv)

  const { title, onOk, okText, okVisible, cancelText, cancelVisible, fields, validator, formItemLayout, onCancel } = params

  const _close = () => {
    onCancel && onCancel()
    const unmountResult = ReactDOM.unmountComponentAtNode(maskDiv)
    if (unmountResult) {
      maskDiv.parentNode.removeChild(maskDiv)
    }
  }

  class ModalForm extends React.Component {
    _onSubmit = e => {
      e.preventDefault()
      this.props.form.validateFields((err, values) => {
        if (!err) {
          let isFinish = true
          if (validator) {
            const validateResult = validator(values)
            if (validateResult.error) {
              message.error(validateResult.payload, 3)
              isFinish = false
            }
          }

          if (isFinish) {
            const res = onOk && onOk(values)
            if (res instanceof Promise) {
              res.then((res) => {
                res && _close()
              })
            } else {
              _close()
            }
          }
        }
      })
    }

    render() {
      const { form } = this.props
      const { getFieldDecorator } = form
      return (
        <Modal
          visible={true}
          onCancel={_close}
          maskClosable={false}
          footer={null}
          title={title || '输入框'}
          style={{ minWidth: '580px' }}
        >
          <div>
            <Form
              className={styles['jc-modal-form']}
              onSubmit={this._onSubmit}
            >
              {
                fields.map(field => (
                  <FormItem
                    key={field.id}
                    {...(formItemLayout || defaultFormItemLayout)}
                    {...field.props}
                  >
                    {getFieldDecorator(field.id, field.options)(
                      field.element || <Input placeholder={field.placeHolder} />
                    )}
                  </FormItem>
                ))
              }
              <FormItem className={styles['jc-modal-form-footer']}>
                {
                  cancelVisible !== false &&
                  <Button
                    key='cancel'
                    onClick={_close}
                  >{cancelText || '取消'}
                  </Button>
                }

                {
                  okVisible !== false &&
                  <Button
                    key='confirm'
                    type='primary'
                    htmlType='submit'
                  >{okText || '确定'}
                  </Button>
                }
              </FormItem>
            </Form>
          </div>
        </Modal>
      )
    }
  }

  ReactDOM.render(
    React.createElement(Form.create()(ModalForm)),
    maskDiv
  )
}

export { showModalForm }
