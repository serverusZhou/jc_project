import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Table, Row, Card, Col, Tooltip, Input, Badge } from 'antd'
import { showModalForm } from '../../../components/modal/ModalForm'
import moment from 'moment'
import './index.css'
import { auditStatus } from 'Global/bizdictionary'

class IsAudit extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  _reject = (record) => {
    showModalForm({
      title: '属性审核',
      fields: [
        {
          id: 'auditStatus',
          props: {
            label: '审核状态'
          },
          element: (<span>{auditStatus[record.auditStatus]}</span>)
        },
        {
          id: 'auditMessage',
          props: {
            label: '原因'
          },
          element: (<span>{record.auditMessage}</span>)
        },
        {
          id: 'updateUser',
          props: {
            label: '审核责任人'
          },
          element: (<span>{record.updateUser}</span>)
        },
        {
          id: 'updateTime',
          props: {
            label: '审核时间'
          },

          element: (<span>{moment(record.updateTime).format('YYYY-MM-DD HH:mm:ss')}</span>)
        },
        {
          id: 'propertyName',
          props: {
            label: '属性名称'
          },
          options: {
            initialValue: record.propertyName,
          },
          element: (<Input />)
        }
      ],
      showCancel: false,
      onOk: (values) => {
      },
      okText: '返回'
    })
  }

  render() {
    const { cardData } = this.props

    const columns = [
      {
        title: '排序',
        dataIndex: 'sort',
        width: '10%',
        sorter: (a, b) => a.sort - b.sort
      },
      {
        title: '属性名称',
        dataIndex: 'propertyName',
        width: '17%',
      },
      {
        title: '审核责任人',
        dataIndex: 'updateUser',
        width: '17%',
      },
      {
        title: '审核时间',
        dataIndex: 'updateTime',
        width: '20%',
        render: (text, record) => {
          return (
            <Tooltip>
              <span>{moment(record.updateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
            </Tooltip>
          )
        }
      },
      {
        title: '状态',
        dataIndex: 'auditStatus',
        width: '15%',
        render: (text, record) => {
          if (text === '3') {
            return <Badge status='success' text={auditStatus[text]} />
          } else if (text === '4') {
            return (
              <Badge status='error' text={auditStatus[text]} />
            )
          }
        }
      },
      {
        title: '操作',
        key: 'address',
        render: (text, record) => {
          const review = '查看'
          return (
            <span>
              {
                record.auditStatus === '2' ||
                <span>
                  <a onClick={() => this._reject(record)}>{review}</a>
                </span>
              }
            </span>)
        }
      }]

    return (
      <div className='attr-wrapper'>
        <Row>
          {
            cardData && cardData.map((item, index) => {
              if (item.item.length > 0) {
                return (
                  <Col
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(IsAudit))
