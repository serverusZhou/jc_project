import { Form, Input, Modal, Radio } from 'antd'
import React, { Component } from 'react'
import * as actions from './reduck'
import style from './styles.less'
import { isEmpty, trim } from 'Utils/lang'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const passwordKey = 'As]|QE%@'
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

class EditAuths extends Component {

  constructor(props) {
    super(props)
    this.state = {
      password: passwordKey
    }
  }

  _handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const { dispatch, page } = this.props
        dispatch(
          actions.edit({
            adminId: this.props.detail.adminId,
            adminName: trim(values.adminName),
            telephone: values.telephone,
            password: values.password === passwordKey ? '' : values.password,
            roleId: values.roleList
          }, () => this.props.form.resetFields()))
          .then((res) => {
            if (res.status === 'success') {
              dispatch(actions.getList({ currentPage: page.pageNo, pageSize: page.pageSize }))
            }
          })
      }
    })
  }

  _handleCancel = () => {
    this.props.dispatch(actions.isShowModal(1, false))
    this.props.form.resetFields()
  }

  _clearPasswordIpt = () => {
    const { setFieldsValue } = this.props.form
    setFieldsValue({ password: '' })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { detail, roleList } = this.props
    return (
      <Modal
        title='编辑管理员'
        visible={this.props.showEditModal}
        maskClosable={false}
        onOk={this._handleOk}
        onCancel={this._handleCancel}
        style={{ top: '30px' }}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label='管理员姓名：'
          >
            {getFieldDecorator('adminName', {
              rules: [{
                required: true,
                message: '管理员姓名不能为空'
              }],
              initialValue: detail.adminName
            })(
              <Input
                type='text'
                placeholder='请输入管理员姓名'
                maxLength='10'
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='手机号码：'
          >
            {getFieldDecorator('telephone', {
              rules: [{
                required: true,
                pattern: /^[\d-]{11}$/,
                message: '请输入正确的手机号'
              }],
              initialValue: detail.telephone
            })(
              <Input
                type='text'
                placeholder='请输入手机号码'
                autoComplete='new-password'
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='密码：'
          >
            {getFieldDecorator('password', {
              rules: [{
                required: true,
                message: '请输入密码'
              }],
              initialValue: this.state.password
            })(
              <Input
                type='password'
                placeholder='请输入密码'
                onFocus={this._clearPasswordIpt}
                autoComplete='new-password'
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='角色：'
          >
            {(getFieldDecorator('roleList', {
              rules: [{
                required: true,
                message: '请选择角色'
              }],
              initialValue: detail.roleId
            }))(
              <RadioGroup>
                {
                  !isEmpty(roleList) && roleList.map((item, index) => {
                    let arry = item.menuList && item.menuList.map(m => m.menuName)
                    let aStr = arry && arry.length > 0 ? arry.join('，') : ''
                    return (
                      <Radio key={index} value={item.roleId}>{item.roleName}<span className={style['subordinate']}>({aStr})</span></Radio>
                    )
                  })
                }
              </RadioGroup>
            )}
          </FormItem>
        </Form>
      </Modal>)
  }
}

export default Form.create()(EditAuths)
