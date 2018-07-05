import { moduleEnum } from '../dict'
import React, { Component } from 'react'
import {
  Form,
  Input,
  Select,
  Button,
  Radio,
  Row,
  Col
  } from 'antd'
import { FlowType } from '../dict'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
const specFormItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}

class AddLayoutForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      privateTimeList: ''
    }
  }

  _handlerSelect(value) {
    const { form } = this.props
    form.setFieldsValue({ isFlow: value })
  }

  _handleClose() {
    // const { history } = this.props
    console.log(this.props)
    // history.push(`${urls.OPERATE_HOME_MANAGE_ADD}`)
  }

  _handleSubmit(e) {
    const { handlerAdd } = this.props
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        handlerAdd({ num: this.getNum(this.props.layoutType), ...values })
      }
    })
  }
  // 展示个数
  getNum = (data) => {
    const { form } = this.props
    const value = data && data.reduce((sum, o) => {
      if (o.value === form.getFieldValue('type')) {
        sum = o.num
      }
      return sum
    }, 0)
    return value
  }

  render() {
    const { form, handleClose } = this.props
    const { getFieldDecorator } = form
    return (
      <Form onSubmit={(e) => this._handleSubmit(e)}>
        <Row>
          <Col span={22}>
            <FormItem
              {...specFormItemLayout}
              label='内容名称：'
            >
              {getFieldDecorator('name', {
                initialValue: '',
                rules: [{
                  required: true,
                  message: '请输入内容名称',
                }]
              })(
                <Input
                  maxLength={8}
                  placeholder={'请输入内容名称'}
                />
              )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <FormItem
              {...specFormItemLayout}
              label='排序序号：'
            >
              {getFieldDecorator('sort', {
                initialValue: 1,
                rules: [{
                  required: true,
                  message: '请输入排序号',
                }, {
                  pattern: /^[1-9]\d*$/,
                  message: '只能输入1-9999的整数',
                }]
              })(
                <Input
                  maxLength='4'
                  placeholder={'请输入排序号'}
                />
              )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <FormItem
              {...specFormItemLayout}
              label='内容种类：'
            >
              {getFieldDecorator('isFlow', {
                initialValue: '0',
                rules: [{
                  required: true,
                  message: '请选择内容种类',
                }]
              })(
                <RadioGroup
                  size='large'
                  name='isFlowRadio'
                  onChange={(e) => this._handlerSelect(e.target.value)}
                >
                  {
                    FlowType && FlowType.map((o, i) => <Radio disabled={i === 1} key={o.value} value={o.value} >{o.name}</Radio>)
                  }
                </RadioGroup>
              )
              }
            </FormItem>
          </Col>
        </Row>
        {form.getFieldValue('isFlow') === '0' && <Row>
          <Col span={22}>
            <FormItem
              {...specFormItemLayout}
              label={'样式布局'}
            >
              <div
                id='type'
              >
                {getFieldDecorator('type', {
                  initialValue: '1',
                  rules: [{
                    required: true,
                    message: '请选择样式布局',
                  }]
                })(
                  <RadioGroup size='large' name='type'>
                    {
                      (this.props.layoutType).map((o) => <Radio key={o.value} value={o.value}>{o.name}</Radio>)
                    }
                  </RadioGroup>
                )}
              </div>
            </FormItem>
          </Col>
        </Row>}
        {form.getFieldValue('isFlow') === '0' && <Row>
          <Col span={22}>
            <Row>
              <Col span={4} style={{ textAlign: 'right', color: 'rgba(0, 0, 0, 0.85)' }}>展示个数：</Col><Col span={20}>{this.getNum(this.props.layoutType)}</Col>
            </Row>
          </Col>
        </Row>}
        {form.getFieldValue('isFlow') === '1' && <Row>
          <Col span={22}>
            <FormItem
              {...specFormItemLayout}
              label='所有内容：'
            >
              {getFieldDecorator('flowNum', {
                initialValue: '',
                // rules: [{
                //   required: true,
                //   message: '请输入展示内容',
                // }]
              })(
                <Input
                  disabled={true}
                  placeholder={'请输入展示内容的个数'}
                />
              )
              }
            </FormItem>
          </Col>
        </Row>}
        {form.getFieldValue('isFlow') === '1' && <Row>
          <Col span={22}>
            <FormItem
              {...specFormItemLayout}
              label='分 页 数：'
            >
              {getFieldDecorator('flowNextNum', {
                initialValue: '',
                // rules: [{
                //   required: true,
                //   message: '请输入分页数',
                // }]
              })(
                <Input
                  disabled={true}
                  placeholder={'请输入分页数'}
                />
              )
              }
            </FormItem>
          </Col>
        </Row>}
        {form.getFieldValue('isFlow') === '1' && <Row>
          <Col span={22}>
            <FormItem
              {...specFormItemLayout}
              label={'其他'}
            >
              <div
                id='type'
              >
                {getFieldDecorator('flowId', {
                  initialValue: '',
                  // rules: [{
                  //   required: true,
                  //   message: '请选择其他瀑布流名称',
                  // }]
                })(
                  <Select
                    disabled={true}
                    allowClear
                    showSearch={false}
                    placeholder='请选择其他瀑布流名称'
                    filterOption={false}
                    required={true}
                  >
                    {moduleEnum && moduleEnum.map(item => (
                      <Option
                        key={item.value}
                        value={item.value}
                        title={item.name}
                      >
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </div>
            </FormItem>
          </Col>
        </Row>}
        <Row>
          <Col span={24}>
            <div style={{ 'float': 'right' }}>
              <Button
                title='点击取消'
                onClick={handleClose}
              >取消
              </Button>
              <Button
                type='primary'
                style={{ marginLeft: 30 }}
                onClick={(e) => this._handleSubmit(e)}
              >
                保存
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    )
  }
}

// const mapStateToProps = state => {
//   return {
//     // reservationInfo: state.sportSchedule.reservationInfo,
//     // reservationMemberInfo: state.sportSchedule.reservationMemberInfo,
//     showButtonSpin: state.common.showButtonSpin,
//   }
// }
//
// const mapDispatchToProps = dispatch => ({
//   dispatch
// })
export default Form.create()(AddLayoutForm)
// export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddLayoutForm))
