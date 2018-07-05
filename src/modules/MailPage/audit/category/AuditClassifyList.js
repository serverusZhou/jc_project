import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Tabs, Table, message, Tooltip, Badge } from 'antd'
import JcContent from '../../../components/styleComponents/JcContent/index'
import { PAG_CONFIG, PAGE_SIZE } from 'Global/globalConfig'
import * as action from './reduck'
import Audit from './Audit'
import AuditedDetail from './AuditedDetail'
import * as globalReduck from 'Global/globalReduck'
import { auditStatus as auditCategoryStatus, BusinessTypes } from 'Global/bizdictionary'
import moment from 'moment'

const TabPane = Tabs.TabPane

class AuditCategoryList extends Component {

  constructor (props) {
    super(props)
    this.state = {
      tableType: '1', // 切换table类型，1为未审核类型，2为已审核类型
      category: {}, // 单个category属性
      showAuditModal: false,  //  是否显示审核模态框
      showAuditedModal: false //  是否显示已审核模态框
    }
  }
  // 待审核表格栏
  _columns = [
    {
      title: '序号',
      key: 'no',
      render: (text, record, index) => {
        const { pageSize, currentPage } = this.props
        return <span>{pageSize * currentPage + (index + 1) - pageSize}</span>
      }
    },
    {
      title: '类目名称',
      key: 'categoryName',
      dataIndex: 'categoryName',
      render: (text, record, index) => {
        return (
          <Tooltip
            placement='bottom'
            title={text}
          >
            <span style={{ width: 100 }}>{text}</span>
          </Tooltip>
        )
      }
    },
    {
      title: '业务类型',
      key: 'type',
      dataIndex: 'businessType',
      render: (text, record, index) => {
        return <span>{BusinessTypes[String(text)]}</span>
      }
    },
    {
      title: '上级分类',
      key: 'parentName',
      dataIndex: 'parentName',
      render: (text, recode, index) => {
        if (recode.parentName) {
          return (
            <Tooltip
              placement='bottom'
              title={text}
            >
              <span style={{ width: 100 }}>{text}</span>
            </Tooltip>
          )
        } else {
          return ''
        }
      }
    },
    {
      title: '排序',
      key: 'sort',
      dataIndex: 'sort',
    },
  ]
  // 未审核表格
  _toBeAuditedColumns = [
    {
      title: '审核状态',
      key: 'status',
      dataIndex: 'status',
      render: text => {
        if (text === 1) {
          return <Badge status='warning' text={auditCategoryStatus[text]} />
        } else if (text === 2) {
          return <Badge status='warning' text={auditCategoryStatus[text]} />
        } else if (text === 3) {
          return <Badge status='success' text={auditCategoryStatus[text]} />
        } else if (text === 4) {
          return <Badge status='error' text={auditCategoryStatus[text]} />
        }
      }
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record, index) => {
        return <a onClick={() => this._toAudit(record)}>审核</a>
      }
    }
  ]
  // 已经审核表格栏
  _auditedColumns = [
    {
      title: '审核负责人',
      key: 'auditedName',
      dataIndex: 'updateUser',
    },
    {
      title: '审核时间',
      key: 'auditTime',
      render: (value) => {
        return moment(value.updateTime).format('YYYY-MM-DD HH:mm')
      }
    },
    {
      title: '审核状态',
      key: 'status',
      dataIndex: 'status',
      render: text => {
        if (text === 1) {
          return <Badge status='warning' text={auditCategoryStatus[text]} />
        } else if (text === 2) {
          return <Badge status='warning' text={auditCategoryStatus[text]} />
        } else if (text === 3) {
          return <Badge status='success' text={auditCategoryStatus[text]} />
        } else if (text === 4) {
          return <Badge status='error' text={auditCategoryStatus[text]} />
        }
      }
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record, index) => {
        return <a onClick={() => this._toAuditedDetail(record)}>查看</a>
      }
    }
  ]

  // 切换列表类型
  _switchTableType = (key) => {
    this.setState({ tableType: key }, () => {
      this._getTableList(key, 1)
    })
  }

  // 获取请求列表的参数
  _getArgs = (statusFlag = this.state.tableType, currentPage = this.props.currentPage, pageSize = this.props.pageSize) => {
    return {
      statusFlag,
      currentPage,
      pageSize
    }
  }

  // 获取列表数据
  _getTableList = async (statusFlag = this.state.tableType, currentPage, pageSize) => {
    let response = await this.props.dispatch(action.getCategoryList(this._getArgs(statusFlag, currentPage, pageSize)))
    if (response && response.code === 0) {
      const paging = {
        currentPage: response.data.pageNo,
        pageSize: response.data.pageSize,
        total: response.data.records
      }
      this.props.dispatch(globalReduck.globalTableListAction(response.data.data))
      this.props.dispatch(globalReduck.globalPagingAction(paging))
    } else {
      message.error(response ? response.errmsg : '接口请求失败')
    }
  }

  _pageChange = async pagination => {
    this._getTableList(this.state.tableType, pagination.current, pagination.pageSize)
  }

  // 打开审核模框
  _toAudit = (category) => {
    this.setState({
      category: category
    }, () => {
      this._modalAction('auditModal', true)
    })
  }

  // 关闭审核模框
  _closeAudit = (isRload = false) => {
    this._modalAction('auditModal', false)
    this.setState({
      category: {}
    })
    isRload && this._getTableList(...this._getArgs())
  }

  // 打开审核详情模框
  _toAuditedDetail = async (category) => {
    const response = await this.props.dispatch(action.categoryDetail({ categoryId: category.categoryId }))
    this.setState({
      category: response.data
    }, () => {
      this._modalAction('auditedModal', true)
    })
  }

  // 对模态框的显示，隐藏操作
  _modalAction = (type = 'auditModal', isShow = true) => {
    let modalState = {}
    switch (type) {
      case 'auditModal':
        modalState = { showAuditModal: isShow }
        break
      case 'auditedModal':
        modalState = { showAuditedModal: isShow }
        break
      default:
        modalState = { showAuditModal: isShow }
    }
    this.setState(modalState)
  }

  componentDidMount = () => {
    this._getTableList()
  }

  // 组件销毁后， 清除global list数据和分页数据
  componentWillUnmount() {
    const globalPagingActionData = {
      currentPage: 1,
      pageSize: PAGE_SIZE,
      total: 0
    }
    this.props.dispatch(globalReduck.globalTableListAction([]))
    this.props.dispatch(globalReduck.globalPagingAction(globalPagingActionData))
  }

  render() {
    return (
      <JcContent>
        <Tabs defaultActiveKey={this.state.tableType} type='line' onChange={this._switchTableType}>
          <TabPane tab='待审' key='1'>
            <Table
              columns={[...this._columns, ...this._toBeAuditedColumns]}
              rowKey='categoryId'
              key='list'
              dataSource={this.props.list}
              bordered={true}
              loading={this.props.isLoading}
              onChange={this._pageChange}
              pagination={{
                pageSize: this.props.pageSize,
                total: this.props.total,
                current: this.props.currentPage,
                ...PAG_CONFIG
              }}
            />
            <Audit
              isShowModal = {this.state.showAuditModal}
              categoryInfo = {this.state.category}
              close = {(isReload) => this._closeAudit(isReload)}
            />
          </TabPane>
          <TabPane tab='已审' key='2'>
            <Table
              columns={[...this._columns, ...this._auditedColumns]}
              rowKey='categoryId'
              key='list'
              dataSource={this.props.list}
              bordered={true}
              loading={this.props.isLoading}
              onChange={this._pageChange}
              pagination={{
                pageSize: this.props.pageSize,
                total: this.props.total,
                current: this.props.currentPage,
                ...PAG_CONFIG
              }}
            />
            <AuditedDetail
              isShowModal = {this.state.showAuditedModal}
              categoryInfo = {this.state.category}
              close = {() => this._modalAction('auditedModal', false)}
            />
          </TabPane>
        </Tabs>
      </JcContent>
    )
  }
}

const mapDispatchToProps = dispatch => ({ dispatch })
const mapStateToProps = state => {
  return {
    list: state.globalReduck.list,
    isLoading: state.globalReduck.isLoading,
    currentPage: state.globalReduck.currentPage,
    pageSize: state.globalReduck.pageSize,
    total: state.globalReduck.total,
    auditedDetail: state.auditCategory.detail,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AuditCategoryList))
