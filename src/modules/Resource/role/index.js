import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table, Row, Button, Popconfirm } from 'antd'
import { genPlanColumn, genPagination } from 'Utils/helper'
import { RESOURCE_ROLE_DETAIL, RESOURCE_ROLE } from 'Global/urls'
import * as actions from './reduck'
import style from './styles.less'
import AddRole from './addRole'
import EditRole from './editRole'
import menuTreeList from 'Global/menuTreeList'

class Role extends Component {

  componentWillUnmount() {
    const { dispatch } = this.props
    if (!location.pathname.startsWith(RESOURCE_ROLE)) {
      dispatch(actions.resetQueryPar())
    }
  }
  // 生命周期， 初始化表格数据
  componentDidMount() {
    this._getList()
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(actions.getList(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.pageNo, pageSize = this.props.page.pageSize) => {
    return {
      currentPage: current,
      pageSize: pageSize,
    }
  }

  _handleAddProps = () => {
    return {
      showAddModal: this.props.showAddModal,
      dispatch: this.props.dispatch,
      menuList: menuTreeList
    }
  }
  _showAddRole= () => {
    const { dispatch } = this.props
    dispatch(actions.isShowModal(0, true))
    console.log(menuTreeList)
  }

  _handleEditProps = () => {
    return {
      showEditModal: this.props.showEditModal,
      dispatch: this.props.dispatch,
      menuList: menuTreeList,
      detail: this.props.detail,
      defaultMenus: this.props.defaultMenus
    }
  }
  _showEditRole = (roleId) => {
    const { dispatch } = this.props
    dispatch(actions.isShowModal(1, true))
    dispatch(actions.detail({ roleId }))
  }

  _handleDelete = (roleId) => {
    this.props.dispatch(actions.deleteRole({ roleId }))
  }

  // 分页
  _onPaginationChange = (pagination) => {
    const { dispatch, page } = this.props
    const { current, pageSize } = pagination
    dispatch(actions.getList({ currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }))
  }

  render() {
    const { list, showListSpin, page } = this.props
    const columns = [
      genPlanColumn('roleName', '角色名称'),
      genPlanColumn('roleDesc', '描述'),
      {
        key: 'operate',
        title: '操作',
        dataIndex: 'operate',
        render: (text, record, index) => {
          return (
            <div className={style['operabox']}>
              <Link to={`${RESOURCE_ROLE_DETAIL}/${record.roleId}`}>查看</Link>
              <a
                href='javascript:void(0);'
                onClick={() => this._showEditRole(record.roleId)}
              >
                <span>编辑</span>
              </a>
              <Popconfirm
                title={record ? '删除该角色！确认后，该角色将被删除。' : '无法删除！该角色已有管理员存在，无法删除'}
                onConfirm={() => this._handleDelete(record.roleId)}
              >
                <a size='small'>删除</a>
              </Popconfirm>
            </div>
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
            >新增角色
            </Button>
          </Row>
        </div>
        <AddRole {...this._handleAddProps()} />
        <EditRole {...this._handleEditProps()} />
        <Table
          columns={columns}
          loading={showListSpin}
          bordered={true}
          dataSource={list}
          onChange={this._onPaginationChange}
          rowKey='roleId'
          pagination={genPagination(page)}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    list: state.resource.role.list,
    detail: state.resource.role.detail,
    defaultMenus: state.resource.role.defaultMenus,
    showAddModal: state.resource.role.showAddModal,
    showEditModal: state.resource.role.showEditModal,
    showListSpin: state.common.showListSpin,
    page: state.resource.role.pagination
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Role)
