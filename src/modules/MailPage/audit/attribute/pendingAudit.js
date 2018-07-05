import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Table, Row, Card, Col, Input, Modal, Radio, Button, Badge } from 'antd'
import { audit } from './reduck'
import './index.css'
import { auditStatus } from 'Global/bizdictionary'

const { TextArea } = Input
const RadioGroup = Radio.Group
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
}

class PendingAudit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      entity: {}
    }
  }

  _reject = (record) => {
    this.setState({ entity: record }, () => { this._setVisible() })
  }

  _handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this._setVisible()
        const { dispatch } = this.props
        const { entity } = this.state
        dispatch(audit({ ...values, propertyId: entity.propertyId }))
      }
    })
  }
  // 关闭modal
  _handleCancel = () => {
    this._setVisible()
  }

  _setVisible = () => {
    this.setState({ visible: !this.state.visible })
  }

  render() {
    const { cardData } = this.props
    const { visible, entity } = this.state
    const { getFieldDecorator, getFieldValue } = this.props.form

    const columns = [
      {
        title: '排序',
        dataIndex: 'sort',
        width: '20%',
        sorter: (a, b) => a.sort - b.sort
      },
      {
        title: '属性名称',
        dataIndex: 'propertyName',
        width: '30%',
      }, {
        title: '状态',
        dataIndex: 'auditStatus',
        width: '30%',
        render: (text, record) => {
          return (
            <Badge status='warning' text={auditStatus[text]} />
          )
        }
      },
      {
        title: '操作',
        key: 'address',
        render: (text, record) => {
          const review = '审核'
          return (
            <span>
              {
                <span>
                  <a onClick={() => this._reject(record)}>{review}</a>
                </span>
              }
            </span>)
        }
      }]

    return (
      <div className='attr-wrapper'>
        <Row gutter={16}>
          {
            cardData && cardData.map((item, index) => {
              if (item.item.length > 0) {
                return (
                  <Col
                    span={12}
                    className='padding-btm-20'
                    key={index}
                  >
                    <Card
                      hoverable={true}
                      title={item.groupName}
                      bodyStyle={{ 'padding': 0, 'height': 300 }}
                    >
                      <Table
                        rowKey='propertyId'
                        border={true}
                        columns={columns}
                        dataSource={item.item}
                        pagination={false}
                        scroll={{ y: 200 }}
                        className='table-center'
                      />
                    </Card>
                  </Col>
                )
              }
            })
          }
        </Row>
        <Modal
          key='modal'
          title= '属性审核'
          visible={visible}
          destroyOnClose={true}
          onCancel={this._handleCancel}
          footer={[
            <Button
              key='cancel'
              onClick={this._handleCancel}
            >
              取消
            </Button>,
            <Button
              key='confirm'
              type='primary'
              onClick={this._handleOk}
            >
              确定
            </Button>,
          ]}
        >
          <Form>
            <FormItem
              label='属性名称'
              {...formItemLayout}
            >
              {getFieldDecorator('propertyName', {
                initialValue: entity.propertyName || ''
              })(
                <Input autoComplete={'off'} />
              )}
            </FormItem>
            <FormItem
              label='审核结果'
              {...formItemLayout}
            >
              {getFieldDecorator('auditStatus', {
                initialValue: '3',
                rules: [{
                  required: true,
                  message: '审核结果不能为空',
                }]
              })(
                <RadioGroup>
                  <Radio key='3' value='3'>通过</Radio>
                  <Radio key='4' value='4'>不通过</Radio>
                </RadioGroup>
              )}
            </FormItem>
            {
              getFieldValue('auditStatus') === '4' &&
              <FormItem
                label='原因'
                {...formItemLayout}
              >
                {getFieldDecorator('auditMessage', {
                  initialValue: '',
                  rules: [
                    { required: true, message: '不通过原因必填' },
                    { max: 50, message: '不通过原因必须小于50个字符' }
                  ]
                })(
                  <TextArea placeholder='请输入不通过原因' />
                )}
              </FormItem>
            }
          </Form>
        </Modal>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({ dispatch })
const mapStateToProps = state => {
  return {
    cardData: state.auditAttributeData.cardData
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PendingAudit))
