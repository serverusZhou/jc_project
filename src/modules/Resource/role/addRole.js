import { Form, Input, Modal, Collapse, Checkbox, Row, Col, message } from 'antd'
import React, { Component } from 'react'
import * as actions from './reduck'
import style from './styles.less'
import { isEmpty, trim } from 'Utils/lang'

const FormItem = Form.Item
const { TextArea } = Input
const CheckboxGroup = Checkbox.Group
const Panel = Collapse.Panel

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

class AddRole extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activeKey: ['0'],
      checkValue: ['none']
    }
  }

  _handleMenus = (e, name) => {
    if (name === '媒资库管理') {
      (e.toString()).indexOf('resourceAudit/审核管理') > -1 && (e.toString()).indexOf('tvmall-audit/审核管理') < 0 ? e.push('tvmall-audit/审核管理') : ''
    }
    if (name === 'TV商城' && (e.toString()).indexOf('tvmall-audit/审核管理') < 0) {
      let index = e.indexOf('resourceAudit/审核管理')
      if (index > -1) {
        e.splice(index, 1)
      }
    }
    this.setState({ checkValue: e })
  }

  _handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        let list = []
        !isEmpty(this.state.checkValue) && this.state.checkValue.map((item) => {
          let ary = item.split('/')
          ary.length > 1 ? list.push({ menuTag: ary[0], menuName: ary[1] }) : ''
        })
        if (list.length < 1) {
          message.error(`请选择菜单权限！`)
          return false
        }
        this.props.dispatch(
          actions.addRole({
            roleName: trim(values.roleName),
            roleDesc: values.roleDesc,
            menuList: list
          }, () => {
            this.props.form.resetFields()
            this.setState({ activeKey: ['0'], menus: {}, checkValue: ['none'] })
          }))
      }
    })
  }

  _handleCancel = () => {
    this.props.dispatch(actions.isShowModal(0, false))
    this.props.form.resetFields()
    this.setState({ activeKey: ['0'], menus: {}, checkValue: ['none'] })
  }

  _handleActiveKey = (key) => {
    this.setState({ activeKey: key })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title='新增角色'
        visible={this.props.showAddModal}
        maskClosable={false}
        onOk={this._handleOk}
        onCancel={this._handleCancel}
        style={{ top: '30px' }}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label='角色名称：'
          >
            {getFieldDecorator('roleName', {
              rules: [{
                required: true,
                message: '角色名称不能为空'
              }],
            })(
              <Input
                type='text'
                placeholder='请输入角色名称'
                maxLength='10'
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='角色描述：'
          >
            {getFieldDecorator('roleDesc', {
              rules: [{
                required: true,
                message: '角色描述不能为空'
              }]
            })(
              <TextArea
                placeholder='请输入角色描述'
                autosize={{ minRows: 2, maxRows: 6 }}
                maxLength='50'
              />
            )}
          </FormItem>
          <Row>
            <Col span={6}>
              <span className={style['form-left']}><em>*</em>菜单权限：</span>
            </Col>
            <Col span={14}>
              <div className={style['alignmentbox']}>
                <Collapse activeKey={this.state.activeKey} onChange={this._handleActiveKey}>
                  {
                    !isEmpty(this.props.menuList) && this.props.menuList.map((menu, index) => {
                      let cchtml = !isEmpty(menu.children) && menu.children.map((item, kk) => {
                        return <Checkbox key={item.menuKey} value={item.menuKey + '/' + item.name}>{item.name}</Checkbox>
                      })
                      return (<Panel header={menu.name} key={index}><CheckboxGroup value={this.state.checkValue} onChange={(e) => { this._handleMenus(e, menu.name) }}>{cchtml}</CheckboxGroup></Panel>)
                    })
                  }
                </Collapse>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal>)
  }
}

export default Form.create()(AddRole)
