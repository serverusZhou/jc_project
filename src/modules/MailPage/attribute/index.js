import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from './reduck'
import { JcContent } from '../../components/styleComponents'
import { showModalForm } from '../../components/modal/ModalForm'
import { Table, Button, Row, Card, Popconfirm, Col, Icon, Form, Input, Divider, InputNumber, Tooltip, Badge } from 'antd'
import { isEmpty } from 'Utils/lang'
import './index.css'

const auditStatusMap = {
  '1': '未审核',
  '2': '审核中',
  '3': '已通过',
  '4': '不通过'
}

class Attribute extends Component {

  state = {
    globalSelectedRowKeys: []
  }

  static defaultProps = {
    list: []
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(actions.getAttribute())
  }

  _delAttr = (record) => {
    const propertyId = record.propertyId
    this.props.dispatch(actions.delAttr({ propertyId }))
  }

  _delGroupAttr = (item) => {
    const groupId = item.groupId
    this.props.dispatch(actions.delGroup({ groupId }))
  }

  // 新增，修改属性
  _handleShowModal = (type, groupId, record) => {
    const classTypeName = {
      'adddata': '新增属性',
      'editdata': '编辑属性'
    }

    showModalForm({
      title: `${classTypeName[type]}`,
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      fields: [
        {
          id: 'propertyName',
          props: {
            label: '属性名称'
          },
          options: {
            initialValue: type === 'editdata' && record.propertyName ? record.propertyName : '',
            rules: [
              { required: true, message: '请输入属性名称' },
              { max: 10, message: '属性名称最多输入10个字符' }
            ],
          },
          element: (
            <Input placeholder='请输入标题名称' />
          )
        },
        {
          id: 'sort',
          props: {
            label: '排序'
          },
          options: {
            initialValue: type === 'editdata' && record.sort ? record.sort : '',
            rules: [
              { pattern: /^[1-9]\d*$/, message: '请输入正整数' }
            ],
          },
          element: (
            <InputNumber style={{ width: '100%' }} maxLength={4} min={1} placeholder='排序' />
          )
        },
      ],
      onOk: (values) => {
        const ids = {
          groupId: groupId,
          propertyId: record && record.propertyId ? record.propertyId : '',
        }
        const arg = {
          propertyName: values.propertyName,
          sort: values.sort && values.sort || ''
        }
        const { dispatch } = this.props
        if (type === 'editdata') {
          dispatch(actions.modifyAttr({ ...arg, ...ids }))
        }
        if (type === 'adddata') {
          dispatch(actions.addAttr({ ...arg, ...ids }))
        }
      }
    })
  }

  // 新增，修改属性组
  _handleShowGroupModal = (type, record) => {
    const classTypeName = {
      'addgroup': '新增属性组',
      'editgroup': '编辑属性组',
    }

    showModalForm({
      title: `${classTypeName[type]}`,
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      fields: [
        {
          id: 'groupName',
          props: {
            label: '属性组名称'
          },
          options: {
            initialValue: type === 'editgroup' ? record.groupName : '',
            rules: [
              { required: true, message: '请输入属性组名称' },
              { max: 10, message: '属性组名称最多输入10个字符' }
            ],
          },
          element: (
            <Input placeholder='请输入属性组名称' />
          )
        },
      ],
      onOk: (values) => {
        const ids = {
          groupId: record && record.groupId ? record.groupId : '',
        }
        const arg = {
          groupName: values.groupName,
          groupType: '2'
        }
        const { dispatch } = this.props
        if (type === 'editgroup') {
          dispatch(actions.modifyGroup({ ...arg, ...ids }))
        }
        if (type === 'addgroup') {
          dispatch(actions.addGroup({ ...arg }))
        }
      }
    })
  }

  _batchAudit = () => {
    const arr = [].concat.apply([], this.state.globalSelectedRowKeys)
    this.props.dispatch(actions.sendAudit({ propertyIds: arr }))
      .then(res => {
        if (res) {
          this.setState({
            globalSelectedRowKeys: []
          })
        }
      })
  }

  render() {
    const { cardData } = this.props
    const { globalSelectedRowKeys } = this.state
    const columns = [{
      title: '序号',
      dataIndex: 'rowNo',
      width: '10%',
      render: (text, row, index) => {
        return Number(index) + 1
      }
    },
    {
      title: '属性名称',
      dataIndex: 'propertyName',
      width: '15%',
    }, {
      title: '状态',
      dataIndex: 'auditStatus',
      width: '100px',
      render: (auditStatus, record) => {
        if (auditStatus === '1') {
          return <Badge status='warning' text={auditStatusMap[auditStatus]} />
        } else if (auditStatus === '2') {
          return <Badge status='processing' text={auditStatusMap[auditStatus]} />
        } else if (auditStatus === '3') {
          return <Badge status='success' text={auditStatusMap[auditStatus]} />
        } else if (auditStatus === '4') {
          return (
            <span>
              <Badge status='error' text={auditStatusMap[auditStatus]} />
              <Tooltip
                placement='bottom'
                title={isEmpty(record.auditMessage) ? '拒绝原因：暂无' : <p className='tip-title'>拒绝原因:{record.auditMessage}</p>}
              >
                <Icon style={{ color: 'red' }} type='question-circle' />
              </Tooltip>
            </span>
          )
        }
      }
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: '100px',
      sorter: (a, b) => a.sort - b.sort
    },
    {
      title: '操作',
      key: 'address',
      render: (text, record) => {
        return (
          <div>
            <div>
              <a
                disabled={record.auditStatus === '2' || record.auditStatus === '3'}
                onClick={() => {
                  this.props.dispatch(actions.sendAudit({ propertyIds: [record.propertyId] }))
                }}
              >
              提审
              </a>
              <Divider type='vertical' />
              <a
                disabled={record.auditStatus !== '2'}
                onClick={() => {
                  this.props.dispatch(actions.reverseAudit({ propertyId: record.propertyId }))
                }}
              >
                撤销
              </a>
            </div>
            <div>
              <a disabled={record.auditStatus === '2'} onClick={() => { this._handleShowModal('editdata', record.groupId, record) }} >编辑</a>
              <Divider type='vertical' />
              <Popconfirm
                title='你确定要删除此属性么?'
                onConfirm={() => { this._delAttr(record) }}
                okText='确定'
                cancelText='取消'
              >
                <a>删除</a>
              </Popconfirm>
            </div>
          </div>
        )
      }
    }]

    const extra = (item) => {
      return (
        <div>
          <div className='title-right'>
            <Popconfirm
              title='你确定要删除此属性么?'
              onConfirm={() => { this._delGroupAttr(item) }}
              okText='是'
              cancelText='否'
            ><a>删除组</a>
            </Popconfirm>
          </div>
          <div className='title-right title-middle'>
            <a onClick={() => { this._handleShowGroupModal('editgroup', item) }}>编辑组</a>
          </div>
          <div className='title-right'>
            <a onClick={() => { this._handleShowModal('adddata', item.groupId) }}>新增属性</a>
          </div>
        </div>
      )
    }

    return (
      <JcContent>
        <div className='attr-wrapper'>
          <div className='add-group'>
            <Button
              type='primary'
              onClick={() => { this._handleShowGroupModal('addgroup') }}
            >新增属性组
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              disabled={globalSelectedRowKeys.length <= 0}
              onClick={this._batchAudit}
            >批量提审
            </Button>
          </div>
          <Row gutter={16}>
            {
              cardData && cardData.map((item, index) => {
                return (
                  <Col
                    span={12}
                    className='padding-btm-20'
                    key={index}
                  >
                    <Card
                      hoverable={true}
                      title={item.groupName}
                      bodyStyle={{ 'padding': 0, 'height': 290 }}
                      extra={extra(item)}
                    >
                      <Table
                        size='middle'
                        rowKey='propertyId'
                        rowSelection={{
                          selectedRowKeys: globalSelectedRowKeys[index],
                          onChange: (selectedRowKeys) => {
                            globalSelectedRowKeys[index] = selectedRowKeys
                            this.setState({
                              globalSelectedRowKeys
                            })
                          }
                        }}
                        border={true}
                        columns={columns}
                        dataSource={item.item}
                        pagination={false}
                        scroll={{ y: 230 }}
                        className='table-center'
                      />
                    </Card>
                  </Col>
                )
              })
            }
          </Row>
        </div>
      </JcContent>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    cardData: state.attributeData.cardData
  }
}

export default connect(mapStateToProps)(Form.create()(Attribute))
