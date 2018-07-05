import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Button, Form, Row, Col, Input, DatePicker, Checkbox } from 'antd'
import {
  addActor,
  getActorDetail,
  resetActorDetail,
} from './reduck'
import styles from './styles.less'
import * as urls from 'Global/urls'
import { isEmpty, trim } from 'Utils/lang'

const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item
const TextArea = Input.TextArea
const formItemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
}
const typeOptions = [
  { label: '演员', value: '1' },
  { label: '导演', value: '2' },
  { label: '编剧', value: '3' },
]

class ActorAdd extends Component {

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetActorDetail())
  }
  componentWillMount() {
    const { dispatch, match } = this.props
    if (match.params && match.params.actorId) {
      dispatch(getActorDetail({ actorId: match.params.actorId }))
    }
  }

  // 提交处理
  _handleSubmit = (e) => {
    e.preventDefault()
    const { dispatch, form, history, match } = this.props
    const isEdit = !isEmpty(match.params) && match.params.actorId !== ''
    form.validateFields((err, values) => {
      if (!err) {
        dispatch(addActor({
          ...this._getUserArg(values)
        }, isEdit)).then((res) => {
          if (res.status === 'success') {
            dispatch(resetActorDetail())
            history.push(urls.RESOURCE_ACTOR)
          }
        })
      }
    })
  }

  // 获取表单提交数据
  _getUserArg = (values) => {
    const { match } = this.props
    const actorId = isEmpty(match.params) ? '' : match.params.actorId
    return {
      actorId,
      name: trim(values.name),
      foreignName: trim(values.foreignName),
      aliasName: trim(values.aliasName),
      country: trim(values.country),
      height: values.height,
      weight: values.weight,
      birthplace: trim(values.birthplace),
      birthday: values.birthday ? moment(values.birthday).format('YYYY-MM-DD HH:mm:ss') : undefined,
      profession: trim(values.profession),
      graduate: trim(values.graduate),
      education: trim(values.education),
      achievement: trim(values.achievement),
      language: trim(values.language),
      typeList: values.typeList,
    }
  }

  // 根据一级分类动态生成表单
  _generateForm = () => {
    const { form, info } = this.props
    const { getFieldDecorator } = form
    return (
      <div>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='所属分类'
          >
            {getFieldDecorator('typeList', {
              initialValue: !isEmpty(info) ? info.typeList : [],
              rules: [{
                required: true,
                message: '请选择所属分类!'
              }]
            })(
              <CheckboxGroup>
                {
                    typeOptions.map((type) => {
                      return (
                        <Checkbox
                          key={type.value}
                          value={type.value}
                        >
                          {type.label}
                        </Checkbox>)
                    })
                    }
              </CheckboxGroup>
                )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='演员姓名'
          >
            {getFieldDecorator('name', {
              initialValue: !isEmpty(info) ? info.name : undefined,
              rules: [{
                required: true,
                message: '请输入演员姓名!'
              }]
            })(
              <Input
                placeholder='请输入演员姓名'
                maxLength='50'
              />
                )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='外文名'
          >
            {getFieldDecorator('foreignName', {
              initialValue: !isEmpty(info) ? info.foreignName : undefined
            })(
              <Input
                placeholder='请输入外文名'
                maxLength='50'
              />
                )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='别名'
          >
            {getFieldDecorator('aliasName', {
              initialValue: !isEmpty(info) ? info.aliasName : undefined
            })(
              <Input
                placeholder='请输入别名'
                maxLength='50'
              />
                )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='国籍'
          >
            {getFieldDecorator('country', {
              initialValue: !isEmpty(info) ? info.country : undefined
            })(
              <Input
                placeholder='请输入国籍'
                maxLength='50'
              />
                )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='身高'
          >
            {getFieldDecorator('height', {
              initialValue: !isEmpty(info) ? info.height : undefined,
              rules: [{
                pattern: /^[0-9]*$/,
                message: '请输入整数！',
              }]
            })(
              <Input
                placeholder='请输入身高'
                maxLength='50'
                addonAfter='CM'
              />
                )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='体重'
          >
            {getFieldDecorator('weight', {
              initialValue: !isEmpty(info) ? info.weight : undefined,
              rules: [{
                pattern: /^[0-9]*$/,
                message: '请输入整数！',
              }]
            })(
              <Input
                placeholder='请输入体重'
                maxLength='50'
                addonAfter='KG'
              />
                )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='出生地'
          >
            {getFieldDecorator('birthplace', {
              initialValue: !isEmpty(info) ? info.birthplace : undefined
            })(
              <Input
                placeholder='请输入出生地'
                maxLength='50'
              />
                )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='出生日期'
          >
            {getFieldDecorator('birthday', {
              initialValue: (!isEmpty(info) && info.birthday) ? moment(info.birthday) : undefined
            })(
              <DatePicker
                placeholder='请选择出生日期'
              />
                )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='职业'
          >
            {getFieldDecorator('profession', {
              initialValue: !isEmpty(info) ? info.profession : undefined
            })(
              <Input
                placeholder='请输入职业'
                maxLength='50'
              />
                )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='毕业院校'
          >
            {getFieldDecorator('graduate', {
              initialValue: !isEmpty(info) ? info.graduate : undefined
            })(
              <Input
                placeholder='请输入毕业院校'
                maxLength='50'
              />
                )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='学历'
          >
            {getFieldDecorator('education', {
              initialValue: !isEmpty(info) ? info.education : undefined
            })(
              <Input
                placeholder='请输入学历'
                maxLength='50'
              />
                )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='主要成就'
          >
            {getFieldDecorator('achievement', {
              initialValue: !isEmpty(info) ? info.achievement : undefined
            })(
              <TextArea
                placeholder='请输入主要成就'
                maxLength='200'
                rows={6}
              />
                )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='语言'
          >
            {getFieldDecorator('language', {
              initialValue: !isEmpty(info) ? info.language : undefined
            })(
              <Input
                placeholder='请输入语言'
                maxLength='50'
              />
                )}
          </FormItem>
        </Col>
      </div>
    )
  }

  // 返回
  _handleBack = () => {
    const { history } = this.props
    history.push(urls.RESOURCE_ACTOR)
  }
  
  render() {
    const { showButtonSpin, match } = this.props
    const isEdit = match.params && match.params.actorId
    return (
      <Form
        onSubmit={this._handleSubmit}
      >
        <Row>
          <Col span={12}>
            <Row>
              {this._generateForm()}
            </Row>
            <Row
              className={styles['submit-box']}
            >
              <FormItem>
                <Button
                  type='primary'
                  title='点击保存'
                  loading={showButtonSpin}
                  disabled={showButtonSpin}
                  htmlType='submit'
                >
                  保存
                </Button>
                {
                  isEdit &&
                  <Button
                    title='点击取消'
                    onClick={this._handleBack}
                  >
                  取消
                  </Button>
                }
              </FormItem>
            </Row>
          </Col>
        </Row>
      </Form>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    showButtonSpin: state.common.showButtonSpin,
    info: state.resource.actor.actorInfo,
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ActorAdd))
