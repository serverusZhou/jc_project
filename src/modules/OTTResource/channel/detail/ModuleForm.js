import React, { Component } from 'react'
import { Form, Row, Col, Input, Button, Switch, Select, Icon } from 'antd'
import { connect } from 'react-redux'
import AliUpload from 'Components/upload/aliUploadV2'
import { getAliToken } from 'Global/action'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 }}

const layoutMap = {
  1: '模板1(4个426*240)',
  2: '模板2(1个726*362，3个272*362)',
  3: '模板3(6个320*426)',
  4: '模板4(3个342*730，6个320*350)',
  5: '模板5(2个885*450)',
  6: '模板6(1个726*362，2个272*362)',
  7: '模板7(6个275*155)',
}

const uploadButton = (
  <div>
    <Icon type='plus' />
    <div className='ant-upload-text'>上传运营图</div>
  </div>
)

class AddModuleForm extends Component {
  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getAliToken())
  }
  _normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }
  _handleSubmit = () => {
    const { form, onOk } = this.props
    const { validateFields } = form
    validateFields((err, values) => {
      if (!err) {
        onOk({
          ...values,
          iconImg: values.imgFiles && values.imgFiles[0] ? values.imgFiles[0]['url'] : '',
          isEnable: Number(values.isEnable),
          imgFiles: undefined
        })
      }
    })
  }
  render() {
    const { aliToken, form, initData } = this.props
    const { getFieldDecorator } = form
    return (
      <Form>
        <Row>
          <Col span={22}>
            <FormItem
              {...formItemLayout}
              label = '模板名称'
            >
              {getFieldDecorator('layoutName', {
                initialValue: (initData && initData.layoutName) || '',
                rules: [{
                  required: true,
                  message: '请输入名称',
                  max: 20
                }]
              })(
                <Input placeholder={`请输入模板名称`} />
                        )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <FormItem
              {...formItemLayout}
              label = '状态'
            >
              {getFieldDecorator('isEnable', { valuePropName: 'checked', initialValue: initData ? !!initData.isEnable : false })(
                <Switch checkedChildren='开' unCheckedChildren='关' />
                        )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <FormItem
              {...formItemLayout}
              label = '模板类型'
            >
              {getFieldDecorator('layoutId', {
                initialValue: (initData && initData.layoutId) || 1,
              })(
                !this.props.isEdit
                  ? <Select disabled={this.props.isEdit}>
                    {
                    Object.keys(layoutMap).map((index) => <Option value={Number(index)} key={index}>{layoutMap[index]}</Option>)
                }
                  </Select> : <p style={{ height: '30px', border: '1px solid #d9d9d9', margin: '5px 0', lineHeight: '30px', paddingLeft: '10px', borderRadius: '4px' }}>{layoutMap[initData.layoutId]}</p>
                        )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <FormItem
              {...formItemLayout}
              label = '循环次数'
            >
              {getFieldDecorator('loop', {
                initialValue: (initData && initData.loop) || 1,
              })(
                <Select>
                  {
                    ['', '', '', ''].map((item, index) => <Option value={index + 1} key={index}>循环{index + 1}次</Option>)
                  }
                </Select>
                        )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <FormItem
              {...formItemLayout}
              label = '地址'
            >
              {getFieldDecorator('moreUrl', {
                initialValue: (initData && initData.moreUrl) || '',
              })(
                <Input placeholder={`请输入地址`} />
                        )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <FormItem
              {...formItemLayout}
              label = '图标'
            >
              {getFieldDecorator('imgFiles', {
                valuePropName: 'fileList',
                getValueFromEvent: this._normFile,
                initialValue: initData && initData.iconImg && [{ uid: 0, url: initData.iconImg }],
              })(
                <AliUpload
                  listType='picture-card' aliToken={aliToken} rootPath='tvOperate'
                  accept='image/*' max={1}
                >
                  {uploadButton}
                </AliUpload>
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
            <Button style={{ marginLeft: '6px' }} className='input-plus-btn' onClick={this.props.onClose}>
                取消
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,
    aliToken: state.common.aliToken,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddModuleForm))
