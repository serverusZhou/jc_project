import React, { Component } from 'react'
import Filter from 'Components/Filter/index'
import { genPlanColumn, genPagination } from 'Utils/helper'
import { connect } from 'react-redux'
import { showModalWrapper } from 'Components/modal/ModalWrapper'
import AddWrapper from './addWrapper'

import { adPositionStatusEnum } from '../../dict'
import styles from '../advertise.less'
import * as actions from '../reduck'
import * as commonActions from '../../reduck'

import { Button, Table, Popconfirm, Form, Popover } from 'antd'

class Classify extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showDialog: '',
      positionEnum: []
    }
  }

  componentWillMount() {
    const { dispatch, filter } = this.props
    // if (isEmpty(list) || !(preRouter && preRouter.startsWith(urls.SUPPLY_GOODS_FORMULA))) {
    dispatch(actions.getAdClassifyList({ currentPage: 1, pageSize: 10, ...filter }))
    dispatch(actions.getAllAdPositionList())
    // } else {
    //   dispatch(getFormulaList(filter))
    // }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.allPositionList !== nextProps.allPositionList) {
      this.setState({
        positionEnum: this._handlerFormatArray(this.props.allPositionList)
      })
    }
  }

  _handleSearch(data) {
    const { filter } = this.props
    const arg = {
      ...filter,
      name: data.name.trim(),
      auditStatus: (data.auditStatus + '' === '') ? null : data.auditStatus,
      currentPage: 1,
      pageSize: 10
    }
    const { dispatch } = this.props
    dispatch(actions.getAdClassifyList(arg))
  }
  _auditDetails(item) {
    const { dispatch } = this.props
    const arg = {
      serviceId: item.positionId,
      type: 6,
      // 保存快照信息
      snapShot: JSON.stringify(item)
    }
    dispatch(commonActions.auditDetails(arg))
  }
  _handleSubmit = (arg, props) => {
    const { dispatch, filter } = this.props
    const { data, onCancel } = props
    if (data && data.positionId) {
      const { positionId } = data
      dispatch(actions.EditAdClassify({ ...arg, positionId })).then((req) => {
        if (req.status === 'success') {
          dispatch(actions.getAdClassifyList({ currentPage: 1, pageSize: 10, ...filter }))
        }
      })
      onCancel && onCancel()
    } else {
      dispatch(actions.AddAdClassify(arg)).then((req) => {
        if (req.status === 'success') {
          dispatch(actions.getAdClassifyList({ currentPage: 1, pageSize: 10, ...filter }))
        }
      })
      onCancel && onCancel()
    }
  }

  _WrapperContent = props => {
    return (
      <AddWrapper
        data={props.data}
        handlerAdd={(e) => this._handleSubmit(e, props)}
      />
    )
  }

  _handleAdd(data) {
    const Wrapper = this._WrapperContent
    showModalWrapper((
      <Wrapper
        data={data}
      />
    ), {
      title: '添加',
      width: 800
    })
  }

  _handleChange(pages) {
    const { dispatch, filter, pagination } = this.props
    const { pageSize } = pagination
    const finalFilter = { ...filter, currentPage: pages.pageSize !== pageSize ? 1 : pages.current, pageSize: pages.pageSize }
    dispatch(actions.getAdClassifyList(finalFilter))
  }

  _handlerAdClassify(o, item, isEnabled) {
    const { dispatch, filter } = this.props
    const arg = {
      positionId: item.positionId,
      isEnabled
    }
    dispatch(actions.handlerAdClassify(arg)).then((req) => {
      if (req.status === 'success') {
        dispatch(actions.getAdClassifyList({ currentPage: 1, pageSize: 10, ...filter }))
      }
    })
  }
  _edit(data) {
    this._handleAdd(data)
  }
  _handlerAudit(item) {
    const { dispatch, filter } = this.props
    const arg = {
      serviceId: item.positionId,
      status: 1,
      type: 6,
      // 保存快照信息
      snapShot: JSON.stringify(item)
    }
    dispatch(commonActions.auditConfirm(arg)).then((req) => {
      if (req.status === 'success') {
        dispatch(actions.getAdClassifyList({ currentPage: 1, pageSize: 10, ...filter }))
      }
    })
  }

  _delete(e, data) {
    const { dispatch, filter } = this.props
    const { positionId } = data
    dispatch(actions.deleteAdClassify({ positionId })).then((req) => {
      if (req.status === 'success') {
        dispatch(actions.getAdClassifyList({ currentPage: 1, pageSize: 10, ...filter }))
      }
    })
  }

  _genFilterFields = () => {
    const { filter } = this.props
    const fields = [
      {
        key: 'name',
        label: '广告位名称',
        initialValue: filter && filter.name || '',
        type: 'Input',
      }, {
        key: 'auditStatus',
        label: '状态',
        initialValue: filter && filter.auditStatus || null,
        type: 'Select',
        content: adPositionStatusEnum
      }
    ]
    return fields
  }

  _handlerFormatArray = () => {
    const dataArray = this.props.allPositionList
    const result = dataArray && dataArray.map((item) => {
      return { value: item.positionId, ...item }
    })
    return result
  }

  _columns = [
    genPlanColumn('name', '广告位名称'),
    genPlanColumn('createTime', '添加时间'),
    genPlanColumn('modifyTime', '更新时间'),
    genPlanColumn('auditStatusName', '状态'),
    genPlanColumn('operatorUser', '操作人'),
    {
      key: 'operate',
      title: '操作',
      dataIndex: 'operate',
      render: (text, record, index) => {
        if (record.positionId !== '1' && record.positionId !== '2' && record.positionId !== '3') {
          switch (record.auditStatus) {
            case 0: {
              return (
                <div className={styles['table-ope']}>
                  <a
                    href='javascript:;'
                    onClick={() => this._edit(record)}
                  >修改
                  </a>
                  <Popconfirm
                    title='确认要删除吗?'
                    onConfirm={(e) => this._delete(e, record)}
                    okText='确认'
                    cancelText='取消'
                  >
                    <a href='#'>删除</a>
                  </Popconfirm>
                  <a
                    href='javascript:;'
                    onClick={() => this._handlerAudit(record)}
                  >提交审核
                  </a>
                </div>
              )
            }
            case 1: {
              return null
            }
            case 2: {
              return (
                <div className={styles['table-ope']}>
                  <a
                    href='javascript:;'
                    onClick={() => this._edit(record, index)}
                  >修改
                  </a>
                  <Popconfirm
                    title='确认要删除吗?'
                    onConfirm={(e) => this._delete(e, record)}
                    okText='确认'
                    cancelText='取消'
                  >
                    <a href='#'>删除</a>
                  </Popconfirm>
                  <Popover
                    title='原因'
                    content={this.props.auditDetails && this.props.auditDetails.suggestion || ''}
                    trigger='click'
                    placement='topRight'
                  >
                    <a
                      href='javascript:;'
                      onClick={() => this._auditDetails(record)}
                    >查看原因
                    </a>
                  </Popover>
                </div>
              )
            }
            case 3: {
              // 轮播位广告没有修改按钮
              return (
                <div className={styles['table-ope']}>
                  {
                    record.positionId !== '4' &&
                    <a
                      href='javascript:;'
                      onClick={() => this._edit(record, index)}
                    >
                      修改
                    </a>
                  }
                  <Popconfirm
                    title='确认要禁用吗?'
                    onConfirm={(e) => this._handlerAdClassify(e, record, false)}
                    okText='确认'
                    cancelText='取消'
                  >
                    <a href='#'>禁用</a>
                  </Popconfirm>
                </div>
              )
            }
            case 4: {
               // 轮播位广告没有修改按钮
              return (
                <div className={styles['table-ope']}>
                  {
                    record.positionId !== '4' &&
                    <a
                      href='javascript:;'
                      onClick={() => { this._edit(record, index) }}
                    >
                    修改
                    </a>
                  }
                  <Popconfirm
                    title='确认要启用吗?'
                    onConfirm={(e) => this._handlerAdClassify(e, record, true)}
                    okText='确认'
                    cancelText='取消'
                  >
                    <a href='#'>启用</a>
                  </Popconfirm>
                </div>
              )
            }
            default: {
              return null
            }
          }
        }
      }
    }
  ]

  render() {
    const { showListSpin, list, pagination } = this.props
    const pages = genPagination({ ...pagination, current: pagination && pagination.pageNo })
    const fields = this._genFilterFields()
    const extraBtns = [
      <div key='importAdd' style={{ display: 'inline-block', marginLeft: '6px' }}>
        <Button type='primary' onClick={() => this._handleAdd()}>新增</Button>
      </div>
    ]

    return (
      <div>
        <Filter
          fields={fields}
          onSearch={(e) => this._handleSearch(e)}
          extraBtns={extraBtns}
        />
        <Table
          pagination={pages}
          columns={this._columns}
          onChange={(e) => this._handleChange(e)}
          rowKey='id'
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
    auditDetails: state.operate.operateCommon.auditDetails,

    list: state.operate && state.operate.advertise && state.operate.advertise.adsClassifyList || [],
    filter: state.operate.advertise.adsClassifyFilter || {},
    pagination: state.operate.advertise.adsClassifyPagination,
    preRouter: state.router.pre,
    allPositionList: state.operate.advertise.allPositionList || []
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Classify))
