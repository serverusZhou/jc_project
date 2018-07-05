import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Modal, Radio, Input, Spin } from 'antd'
import * as actions from './reduck'
import DescriptionList from '../../../components/DescriptionList'
import '../goods/styles.css'

const { Description } = DescriptionList
const RadioGroup = Radio.Group
const FormItem = Form.Item
const TextArea = Input.TextArea

const auditInfo = {
  categoryName: '类目名称',
  categoryLevel: '类目级别',
  parentName: '上级类目',
  sort: '类目排序',
  audit: '审核结果',
  remark: '原因'
}

class Audit extends Component {
  static defaultProps = {
    isModalLoading: false,
  }

  // 审核
  _handleOk = () => {
    this.props.form.validateFields(async (errors, values) => {
      if (!errors) {
        const requestParas = [
          {
            categoryId: this.props.categoryInfo.categoryId,
            ...values
          }
        ]
        const response = await this.props.dispatch(actions.audit({ categoryAuditVOs: requestParas }))
        if (response.code === 0) {
          this.props.close(true)
        }
      }
    })
  }

  _close = () => {
    this.setState({
      isAuditedToPass: true
    }, () => {
      this.props.close()
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    console.log(getFieldValue('status'))
    return (
      <Modal
        key='modal'
        title= '类目审核'
        visible={this.props.isShowModal}
        destroyOnClose={true}
        onCancel={this._close}
        width='800px'
        onOk={this._handleOk}
      >
        <Spin spinning={this.props.isModalLoading}>
          <DescriptionList size='large' key='baseInfo' title='审核信息' style={{ marginBottom: 32 }}>
            <Description term={auditInfo.categoryName}>{this.props.categoryInfo.categoryName}</Description>
            <Description term={auditInfo.categoryLevel}>{(parseInt(this.props.categoryInfo.parentId) === 0) ? '一级目录' : '二级目录'}</Description>
            <Description term={auditInfo.parentName}>{this.props.categoryInfo.parentName || '无'}</Description>
            <Description term={auditInfo.sort}>{String(this.props.categoryInfo.sort)}</Description>
          </DescriptionList>
        </Spin>
        <div key='store' className='audit-title'>
          审核建议
        </div>
        <Form>
          <Form.Item label={auditInfo.audit}>
            {getFieldDecorator('status', {
              initialValue: 3,
              rules: [
                {
                  required: true,
                  message: '请审核'
                }
              ]
            })(
              <RadioGroup>
                <Radio value={3}>通过</Radio>
                <Radio value={4}>不通过</Radio>
              </RadioGroup>
            )}
          </Form.Item>
          {getFieldValue('status') === 4 && (
            <FormItem label={auditInfo.remark}>
              {getFieldDecorator('unapprovedReason', {
                rules: [
                  {
                    required: true,
                    message: '请输入不通过原因'
                  }
                ]
              })(<TextArea placeholder='请输入不通过原因' />)}
            </FormItem>
          )}
        </Form>
      </Modal>
    )
  }
}

const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(mapDispatchToProps)(Form.create()(Audit))
