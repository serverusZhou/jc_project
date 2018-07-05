import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Divider, Input } from 'antd'
import { Link } from 'react-router-dom'

import { genPlanColumn, genPagination, genSelectColumn } from 'Utils/helper'
import Filter from 'Components/Filter'
import { showModalForm } from 'Components/modal/ModalForm'

import { userList, enableUser } from './reduck'
import * as urls from 'Global/urls'
import { LoginMode, IsOrNot, RegisterMode } from '../dict'

class User extends Component {

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(userList({ pageSize: 10, currentPage: 1 }))
  }

  // 启用
  _handleEnable = (record) => {
    const { dispatch } = this.props
    dispatch(enableUser({
      userId: record.userId,
      forbidReason: '',
      isForbidden: 0,
    })).then(res => {
      if (res.status === 'success') {
        this._handleSearch()
      }
    })
  }

  // 禁用
  _handleDisabled = (record) => {
    const { dispatch } = this.props
    showModalForm({
      title: '添加禁用原因',
      fields: [
        {
          id: 'forbidReason',
          props: {
            label: '禁用原因:',
          },
          options: {
            rules: [{
              required: true,
              message: '请输入原因！',
            }],
          },
          element: (
            <Input placeholder='请输入禁用原因' maxLength='50' />
          )
        }
      ],
      onOk: values => {
        dispatch(enableUser({
          userId: record.userId,
          forbidReason: values.forbidReason,
          isForbidden: 1,
        })).then(res => {
          if (res.status === 'success') {
            this._handleSearch()
          }
        })
      }
    })
  }

  _handleCheckReason = (record) => {
    showModalForm({
      title: '查看禁用原因',
      okVisible: false,
      fields: [
        {
          id: 'forbidReason',
          props: {
            label: '禁用原因:',
          },
          element: (
            <span className='ant-form-text'>{record.forbidReason}</span>
          )
        }
      ]
    })
  }

  _columns = [
    genPlanColumn('userId', '用户ID'),
    genPlanColumn('nickName', '昵称'),
    genPlanColumn('userPhone', '手机号'),
    genPlanColumn('registerChannel', 'TV注册', {
      render: (text) => {
        return (<span>{text === 'JC_TV' ? '是' : '否'}</span>)
      }
    }),
    genSelectColumn('loginWay', '登录方式', LoginMode),
    genPlanColumn('loginTime', '最近登录时间'),
    genPlanColumn('macAddrCount', 'MAC地址', {
      render: (text, record) => {
        return parseInt(text) ? (<Link to={urls.OPERATE_USER_MAC + '/' + record.userId}>{text}</Link>) : ''
      }
    }),
    genPlanColumn('isMember', '是否是会员', {
      render: (text) => (
         text + '' === '1' ? '是' : '否'
      )
    }),
    genPlanColumn('collectionCount', '收藏数量', {
      render: (text, record) => {
        return parseInt(text) ? (<Link to={urls.OPERATE_USER_COLLECT + '/' + record.userId}>{text}</Link>) : ''
      }
    }),
    genPlanColumn('lifeCount', '账户信息', {
      render: (text, record) => {
        return parseInt(text) ? (<Link to={urls.OPERATE_USER_ACCOUNT + '/' + record.userId}>{text}</Link>) : ''
      }
    }),
    genPlanColumn('isForbidden', '是否禁用', {
      render: (text) => (
         text + '' === '1' ? '是' : '否'
      )
    }),
    genPlanColumn('operate', '操作', {
      render: (text, record) => {
        return (
          <div>
            <a onClick={() => { record.isForbidden + '' === '1' ? this._handleEnable(record) : this._handleDisabled(record) }}>
              {record.isForbidden + '' === '1' ? '启用' : '禁用'}
            </a>
            {record.isForbidden + '' === '1' && (
              <span>
                <Divider type='vertical' />
                <a onClick={() => this._handleCheckReason(record)}>查看原因</a>
              </span>
            )}
          </div>
        )
      }
    }),
  ]

  _handleSearch = searchData => {
    const { filter, dispatch } = this.props
    const finalFilter = Object.assign(
      {},
      filter,
      searchData,
      {
        currentPage: 1,
        userId: searchData.userId && searchData.userId.trim(),
        nickName: searchData.nickName && searchData.nickName.trim(),
        mobile: searchData.mobile && searchData.mobile.trim()
      })
    dispatch(userList(finalFilter))
  }

  _handleChange = (pagination, filters, sorter) => {
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(userList(finalFilter))
  }

  _handleAdd = () => {

  }

  _genFilterFields = (filter) => {
    // const {  } = this.props
    const fields = [
      {
        key: 'userId',
        label: '用户ID',
        initialValue: filter['userId'],
        type: 'Input',
      },
      {
        key: 'nickName',
        label: '昵称',
        initialValue: filter['nickName'],
        type: 'Input',
      },
      {
        key: 'mobile',
        label: '手机号',
        initialValue: filter['mobile'],
        type: 'Input',
      },
      {
        key: 'loginWay',
        label: '登录方式',
        initialValue: filter['loginWay'] || '',
        type: 'Select',
        content: LoginMode
      },
      {
        key: 'registerChannel',
        label: '金诚TV注册',
        initialValue: filter['registerChannel'] || '',
        type: 'Select',
        content: RegisterMode
      },
      {
        key: 'isMember',
        label: '是否是会员',
        initialValue: filter['isMember'] || '',
        type: 'Select',
        content: IsOrNot
      },
    ]

    return fields
  }

  render() {
    const { showListSpin, list, filter, page } = this.props
    const fields = this._genFilterFields(filter)
    const pagination = genPagination(page)

    return (
      <div>
        <Filter
          fields={fields}
          onSearch={this._handleSearch}
        />
        <Table
          pagination={pagination}
          columns={this._columns}
          onChange={this._handleChange}
          rowKey='userId'
          dataSource={list}
          loading={showListSpin}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,

    list: state.operate.user.userList,
    filter: state.operate.user.userFilter,
    page: state.operate.user.userPage,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(User)
