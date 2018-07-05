import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table, Input, Row, Button, Popconfirm, Form } from 'antd'
import { genPlanColumn, genPagination } from 'Utils/helper'
import { trim } from 'Utils/lang'
import { RESOURCE_AUTHS_DETAIL, RESOURCE_AUTHS } from 'Global/urls'
import * as actions from './reduck'
import style from './styles.less'
import AddAuths from './AddAuths'
import EditAuths from './EditAuths'

const Search = Input.Search
const FormItem = Form.Item

class Auths extends Component {

  componentWillUnmount() {
    const { dispatch } = this.props
    if (!location.pathname.startsWith(RESOURCE_AUTHS)) {
      dispatch(actions.resetQueryPar())
    }
  }
  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch } = this.props
    this._getList()
    dispatch(actions.getRoleList())
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(actions.getList(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.pageNo, pageSize = this.props.page.pageSize) => {
    const { dispatch, form } = this.props
    const arg = form.getFieldsValue()
    dispatch(actions.setQueryPar(arg))
    return {
      ...arg,
      searchKey: trim(arg.searchKey),
      currentPage: current,
      pageSize: pageSize,
    }
  }

  _handleSearchChange = () => {
    this._getList(1)
  }

  _handleChangeStatus = (adminId, isFrozen) => {
    const { dispatch, page } = this.props
    if (isFrozen) {
      dispatch(actions.unfreeze({ adminId: adminId, isFrozen: false })).then((res) => {
        if (res.status === 'success') {
          dispatch(actions.getList({ currentPage: page.pageNo, pageSize: page.pageSize }))
        }
      })
    } else {
      dispatch(actions.freeze({ adminId: adminId, isFrozen: true })).then((res) => {
        if (res.status === 'success') {
          dispatch(actions.getList({ currentPage: page.pageNo, pageSize: page.pageSize }))
        }
      })
    }
  }

  _handleAddProps = () => {
    return {
      showAddModal: this.props.showAddModal,
      dispatch: this.props.dispatch,
      roleList: this.props.roleList,
      page: this.props.page
    }
  }

  _showAddRole= () => {
    const { dispatch } = this.props
    dispatch(actions.isShowModal(0, true))
  }

  _handleEditProps = () => {
    return {
      showEditModal: this.props.showEditModal,
      dispatch: this.props.dispatch,
      detail: this.props.detail,
      roleList: this.props.roleList,
      page: this.props.page
    }
  }

  _showEditRole = (id) => {
    const { dispatch } = this.props
    dispatch(actions.isShowModal(1, true))
    dispatch(actions.detail({ 'adminId': id }))
  }

  _onPaginationChange = (page) => {
    if (this.props.page.pageSize === page.pageSize) {
      this._getList(page.current)
    } else {
      this._getList(1, page.pageSize)
    }
  }

  render() {
    const { list, showListSpin, page, initQueryPar } = this.props
    const { getFieldDecorator } = this.props.form
    const columns = [
      genPlanColumn('adminName', '管理员'),
      genPlanColumn('telephone', '手机号码'),
      genPlanColumn('roleName', '角色'),
      {
        key: 'isFrozen',
        title: '状态',
        dataIndex: 'isFrozen',
        width: '15%',
        render: (text, record) => {
          return (
            <span>{record.isFrozen ? '已冻结' : '正常'}</span>
          )
        }
      },
      {
        key: 'operate',
        title: '操作',
        dataIndex: 'operate',
        render: (text, record, index) => {
          return (
            <div>{record.roleId === '0' ? '' : <div className={style['operabox']}>
              <Link to={`${RESOURCE_AUTHS_DETAIL}/${record.adminId}`}>查看</Link>
              {record.isFrozen ? '' : <a href='javascript:void(0);' onClick={() => this._showEditRole(record.adminId)}>编辑</a>}
              <Popconfirm
                title={'确定' + `${record.isFrozen ? '解冻' : '冻结'}` + `${record.adminName}` + '的管理员身份？' + `${record.isFrozen ? '' : '冻结后他将不能使用该管理后台'}`}
                onConfirm={() => this._handleChangeStatus(record.adminId, record.isFrozen)}
              >
                {record.isFrozen ? <a size='small'>解冻</a> : <a size='small'>冻结</a>}
              </Popconfirm>
            </div>}</div>
          )
        }
      }]

    return (
      <div>
        <div style={{ 'margin': '0 0 10px 0' }}>
          <Row>
            <Button
              icon='plus'
              type='primary'
              onClick={this._showAddRole}
            >新增管理员
            </Button>
            <Form>
              <FormItem>
                {getFieldDecorator('searchKey', {
                  initialValue: initQueryPar.searchKey ? initQueryPar.searchKey : undefined,
                })(
                  <Search
                    placeholder='输入管理员姓名/手机号码进行搜索'
                    style={{ width: 300, float: 'right' }}
                    onSearch={this._handleSearchChange}
                    enterButton
                  />
                )}
              </FormItem>
            </Form>
            
          </Row>
        </div>
        <AddAuths {...this._handleAddProps()} />
        <EditAuths {...this._handleEditProps()} />
        <Table
          columns={columns}
          loading={showListSpin}
          bordered={true}
          dataSource={list}
          onChange={this._onPaginationChange}
          rowKey='adminId'
          pagination={genPagination(page)}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    list: state.resource.auths.list,
    roleList: state.resource.auths.roleList,
    detail: state.resource.auths.detail,
    showAddModal: state.resource.auths.showAddModal,
    showEditModal: state.resource.auths.showEditModal,
    showListSpin: state.common.showListSpin,
    page: state.resource.auths.pagination,
    initQueryPar: state.resource.auths.initQueryPar,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Auths))
