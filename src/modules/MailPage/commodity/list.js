import React from 'react'
import { JcContent, JcFilter } from '../../components/styleComponents'
import { Tooltip, Divider, Popconfirm, Badge, Button, Row, Icon } from 'antd'
import { Link } from 'react-router-dom'
import StandardTable from '../../components/StandardTable'
import { auditStatusMap, shelevesStatusMap } from 'Global/bizdictionary'
import * as urls from 'Global/urls'
// import * as urls from 'Global/routepath'
import * as action from './reduck'
import { connect } from 'react-redux'
import moment from 'moment'
import noimage from 'Assets/images_mall/no-image.png'
import '../style.less'

class CommodityList extends React.Component {
  state = {
    selectedRows: [],
  }

  _columns = [
    // {
    //   title: '排序',
    //   dataIndex: 'sort',
    //   width: 70,
    //   fixed: 'left',
    // },
    {
      title: '商品ID',
      dataIndex: 'spuId',
      width: 100
      // fixed: 'left',
    },
    {
      title: '商品名称',
      dataIndex: 'imageUrl',
      width: 200,
      render: (value, record) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                background: `url(${value || noimage}) center no-repeat / cover`,
                width: '50px', height: '50px', marginRight: 10
              }}
            />
            <span style={{ textAlign: 'left', flex: '1' }}>
              {
                record.goodsTitle && record.goodsTitle.length >= 5
                  ? (
                    <Tooltip title={record.goodsTitle}>
                      <span>{record.goodsTitle.substring(0, 5) + '...'}</span>
                    </Tooltip>
                  )
                  : record.goodsTitle
              }
            </span>
          </div>
        )
      }
    },
    {
      title: '商品类别',
      dataIndex: 'categoryName',
      width: 100
    },
    {
      title: '价格(元)',
      dataIndex: 'price',
      width: 100,
      render: value => {
        return value && value.toFixed(2)
      }
    },
    {
      title: '库存',
      dataIndex: 'stock',
      width: 90
    },
    {
      title: '操作时间',
      dataIndex: 'operationTime',
      width: 160,
      render: value => {
        return moment(value).format('YY.MM.DD hh:mm')
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      // fixed: 'right',
      width: 80,
      render: status => <span> {shelevesStatusMap[status]}</span>
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      // fixed: 'right',
      width: 120,
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
              {record.auditMessage && (
                <Tooltip title={<p className='tip-title'>{record.auditMessage}</p>}>
                  <Icon type='question-circle-o' style={{ color: 'rgba(0, 0, 0, 0.45)', marginLeft: 4 }} />
                </Tooltip>
              )}
            </span>
          )
        } else {
          return <span> {auditStatusMap[auditStatus]}</span>
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 180,
      render: (auditStatus, record) => {
        return (
          <div>
            <Link to={`${urls.COMMODITY_DETAIL}/${record.goodsId}`}>查看</Link>
            <Divider type='vertical' />
            {record.auditStatus === '3' && (
              <Popconfirm
                title={`确定要${record.status === '1' ? '下架' : '上架'}吗？`}
                onConfirm={() =>
                  this.props.dispatch(
                    action.updateStatus({ goodsId: record.goodsId, status: record.status === '1' ? '2' : '1' })
                  )
                }
                okText='确定'
                cancelText='取消'
              >
                <a disabled={record.auditStatus !== '3'}>{record.status === '1' ? '下架' : '上架'}</a>
              </Popconfirm>
            )}
            {(record.auditStatus !== '1' && record.auditStatus !== '4') || (
              <a onClick={() => this.props.dispatch(action.sendAudit({ goodsIdList: [record.goodsId] }))}>提审</a>
            )}
            {record.auditStatus !== '2' || (
              <a onClick={() => this.props.dispatch(action.reverseAudit({ goodsIdList: [record.goodsId] }))}>撤销</a>
            )}
            {
              record.auditStatus !== '2' && (
                <span>
                  <Divider type='vertical' />
                  <Popconfirm
                    title='删除后不可恢复，确定吗？'
                    onConfirm={() => this.props.dispatch(action.deleteCommodity({ goodsIdList: [record.goodsId] }))}
                    okText='确认'
                    cancelText='取消'
                  >
                    <a disabled={record.auditStatus === '2'}>
                      删除
                    </a>
                  </Popconfirm>
                </span>
              )
            }
          </div>
        )
      }
    }
  ]

  componentDidMount() {
    const { pre } = this.props.router
    const { dispatch } = this.props
    dispatch(action.treeData())
    if (pre && pre.indexOf(urls.COMMODITY_DETAIL) >= 0) {
      dispatch(action.getListFromStore())
    } else {
      this.formRef.props.form.resetFields()
      dispatch(action.list({ pageSize: 10, pageNo: 1 }))
    }
  }

  handleSelectRows = selectedRows => {
    this.setState({ selectedRows })
  }

  // 批量提交审核
  handleBatchVerify = e => {
    e.preventDefault()
    const goodsIdList = this.state.selectedRows.map(e => e.goodsId)
    this.props.dispatch(action.sendAudit({ goodsIdList })).then(res => {
      res.code === 0 && this.handleSelectRows([])
    })
  }

  // 查询汇总
  handleSearch({ current = 1, pageSize = 10 }) {
    const { dispatch } = this.props
    const values = this.formRef.props.form.getFieldsValue()
    dispatch(action.list({ ...values, pageSize, pageNo: current }))
  }

  render() {
    const { filterData, page, list, match, treeData } = this.props
    const { selectedRows } = this.state

    const pagination = {
      showQuickJumper: true,
      current: page.current,
      total: page.total,
      onChange: current => this.handleSearch({ current }),
      pageSize: page.pageSize,
      showTotal: total => <span>共{total}条</span>
    }

    const fields = [
      {
        fieldName: 'spuId',
        label: '商品id',
        componentType: 'Input',
        initialValue: filterData.spuId || undefined
      },
      {
        fieldName: 'goodsTitle',
        label: '商品名称',
        componentType: 'Input',
        initialValue: filterData.goodsTitle || undefined
      },
      {
        fieldName: 'status',
        label: '商品状态',
        componentType: 'Select',
        dictionary: shelevesStatusMap,
        initialValue: filterData.status || undefined
      },
      {
        label: '审核状态',
        fieldName: 'auditStatus',
        componentType: 'Select',
        dictionary: auditStatusMap,
        initialValue: filterData.auditStatus || undefined
      },
      {
        label: '商品类目',
        fieldName: 'categoryFrontId',
        componentType: 'TreeSelect',
        treeData: treeData,
        // onSelect: categoryId => this.setState({ categoryId }),
        initialValue: filterData.categoryId || undefined
      }
    ]

    const buttons = [
      {
        desc: '查询',
        type: 'action',
        btnType: 'primary',
        onClick: v => this.handleSearch({ current: 1 })
      }
    ]

    return (
      <JcContent>
        <JcFilter wrappedComponentRef={inst => (this.formRef = inst)} fields={fields} buttons={buttons} />
        <Row style={{ marginBottom: 12 }}>
          <Button type='primary' onClick={() => match.history.push(urls.COMMODITY_DETAIL)}>
            新增
          </Button>
          <Button style={{ marginLeft: 8 }} disabled={selectedRows.length === 0} onClick={this.handleBatchVerify}>
            批量提审
          </Button>
        </Row>

        <StandardTable
          selectedRows={selectedRows}
          data={{ list, pagination }}
          rowKey='goodsId'
          columns={this._columns}
          onSelectRow={this.handleSelectRows}
        />
      </JcContent>
    )
  }
}

const mapStateToProps = ({ commodity, router }) => {
  return {
    router,
    treeData: commodity.treeData,
    page: commodity.page,
    list: commodity.list,
    filterData: commodity.filterData
  }
}
export default connect(mapStateToProps)(CommodityList)
