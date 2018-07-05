import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Filter from 'Components/Filter/index'
import { genPlanColumn, genPagination } from 'Utils/helper'
import { connect } from 'react-redux'
import * as urls from 'Global/urls'

import { statusEnum } from '../dict'
import styles from './advertise.less'
import noImage from 'Assets/images_mall/no-image.png'
import * as actions from './reduck'
import * as commonActions from '../reduck'

import { Button, Table, Popover, Popconfirm } from 'antd'

class Advertise extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showDialog: ''
    }
  }

  componentWillMount() {
    const { dispatch, filter } = this.props
    // if (isEmpty(list) || !(preRouter && preRouter.startsWith(urls.SUPPLY_GOODS_FORMULA))) {
    dispatch(actions.getAdList({ currentPage: 1, pageSize: 10, ...filter }))
    dispatch(actions.getAllAdPositionList())
    // } else {
    //   dispatch(getFormulaList(filter))
    // }
  }

  // 搜索
  _handleSearch(data) {
    const { dispatch } = this.props
    const arg = {
      positionId: data.moduleName,
      auditStatus: (data.auditStatus + '' === '') ? null : data.auditStatus,
      showStartTime: data.showTime && data.showTime[0] && data.showTime[0].format('YYYY-MM-DD HH:mm:ss'),
      showEndTime: data.showTime && data.showTime[1] && data.showTime[1].format('YYYY-MM-DD HH:mm:ss'),
      currentPage: 1,
      pageSize: 10
    }
    dispatch(actions.getAdList(arg))
  }
// 分页
  _handleChange(pages) {
    const { dispatch, filter, pagination } = this.props
    const { pageSize } = pagination
    const finalFilter = { ...filter, currentPage: pages.pageSize !== pageSize ? 1 : pages.current, pageSize: pages.pageSize }
    dispatch(actions.getAdList(finalFilter))
  }

  _delete(e, item) {
    const { dispatch, filter } = this.props
    dispatch(actions.deleteAd({ adId: item.adId })).then((req) => {
      if (req.status === 'success') {
        dispatch(actions.getAdList({ currentPage: 1, pageSize: 10, ...filter }))
      }
    })
  }

  _enableAd(item, isEnabled) {
    const { dispatch, filter } = this.props
    const arg = {
      adId: item.adId,
      isEnabled
    }
    dispatch(actions.enableAd(arg)).then((req) => {
      if (req.status === 'success') {
        dispatch(actions.getAdList({ currentPage: 1, pageSize: 10, ...filter }))
      }
    })
  }

  _audit(item) {
    const { dispatch, filter } = this.props
    dispatch(actions.getAdDetails({ adId: item.adId })).then(res => {
      if (res.status === 'success') {
        item.episodeImgUrl = res.adDetail.episodeImgUrl
        const arg = {
          serviceId: item.adId,
          status: 1,
          type: 1,
          // 保存快照信息
          snapShot: JSON.stringify(item)
        }
        dispatch(commonActions.auditConfirm(arg)).then((req) => {
          if (req.status === 'success') {
            dispatch(actions.getAdList({ currentPage: 1, pageSize: 10, ...filter }))
          }
        })
      }
    })
  }
  _auditDetails(item) {
    const { dispatch } = this.props
    const arg = {
      serviceId: item.adId,
      type: 1,
      // 保存快照信息
      snapShot: JSON.stringify(item)
    }
    dispatch(commonActions.auditDetails(arg))
  }
// 搜索列表
  _genFilterFields = () => {
    const { filter, allPositionList } = this.props
    const positionList = allPositionList && allPositionList.map(o => {
      return { key: o.positionId, value: o.positionId, ...o }
    })
    const fields = [
      {
        key: 'moduleName',
        label: '所属广告位',
        initialValue: filter.moduleName || '',
        type: 'Select',
        content: positionList
      }, {
        key: 'auditStatus',
        label: '状态',
        initialValue: filter.auditStatus || null,
        type: 'Select',
        content: statusEnum
      }, {
        key: 'showTime',
        label: '展示时间',
        initialValue: filter.showTime || '',
        type: 'RangePicker',
      }
    ]
    return fields
  }

  _columns = [
    genPlanColumn('positionName', '所属广告位'),
    {
      key: 'adImg1Url',
      title: '广告图',
      dataIndex: 'adImg1Url',
      render: (text, record) => {
        return (
          <img src={record.adImg1Url || noImage} style={{ width: '80px', height: '80px' }} className={styles.scaleImg} />
        )
      }
    },
    genPlanColumn('sort', '排序'),
    genPlanColumn('showStartTime', '展示开始时间'),
    genPlanColumn('showEndTime', '展示结束时间'),
    genPlanColumn('auditStatusName', '状态'),
    genPlanColumn('modifyTime', '更新时间'),
    genPlanColumn('operatorUser', '操作人'),
    {
      key: 'operate',
      title: '操作',
      dataIndex: 'operate',
      render: (text, record, index) => {
        switch (record.auditStatus) {
          case 0: {
            return (
              <div className={styles['table-ope']}>
                <Link to={`${urls.OPERATE_ADVERTISE_MANAGE}/${record.adId}`}>
                  <a
                    href='javascript:;'
                    // onClick={(e) => { this._edit(e, record, index) }}
                  >修改
                  </a>
                </Link>
                <Popconfirm
                  title='确认要删除吗?'
                  onConfirm={(e) => { this._delete(e, record) }}
                  okText='确认'
                  cancelText='取消'
                >
                  <a href='#'>删除</a>
                </Popconfirm>
                <a
                  href='javascript:;'
                  onClick={() => { this._audit(record, index) }}
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
                <Link to={`${urls.OPERATE_ADVERTISE_MANAGE}/${record.adId}`}>
                  <a
                    href='javascript:;'
                    // onClick={(e) => { this._edit(e, record, index) }}
                  >修改
                  </a>
                </Link>
                <Popconfirm
                  title='确认要删除吗?'
                  onConfirm={(e) => { this._delete(e, record) }}
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
            return (
              <div className={styles['table-ope']}>
                <a
                  href='javascript:;'
                  onClick={() => { this._enableAd(record, false) }}
                >下架</a>
              </div>
            )
          }
          case 4: {
            return (
              <div className={styles['table-ope']}>
                <Link to={`${urls.OPERATE_ADVERTISE_MANAGE}/${record.adId}`}>
                  <a
                    href='javascript:;'
                    // onClick={(e) => { this._edit(e, record, index) }}
                  >修改
                  </a>
                </Link>
                <Popconfirm
                  title='确认要删除吗?'
                  onConfirm={(e) => { this._delete(e, record) }}
                  okText='确认'
                  cancelText='取消'
                >
                  <a href='#'>删除</a>
                </Popconfirm>
              </div>
            )
          }
          case 5: {
            return (
              <div className={styles['table-ope']}>
                <Link to={`${urls.OPERATE_ADVERTISE_MANAGE}/${record.adId}`}>
                  <a
                    href='javascript:;'
                    // onClick={(e) => { this._edit(e, record, index) }}
                  >
                    修改
                  </a>
                </Link>
                <Popconfirm
                  title='确认要删除吗?'
                  onConfirm={(e) => { this._delete(e, record) }}
                  okText='确认'
                  cancelText='取消'
                >
                  <a href='#'>删除</a>
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
  ]

  render() {
    const { showListSpin, list, pagination } = this.props
    const pages = genPagination({ ...pagination, current: pagination && pagination.pageNo })
    const fields = this._genFilterFields()
    const extraBtns = [
      <div key='import' style={{ display: 'inline', marginLeft: '6px' }}>
        <Link to={urls.OPERATE_ADVERTISE_MANAGE_ADD}>
          <Button type='primary'>新增</Button>
        </Link>
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
          className={styles['scaleImgBg']}
          pagination={pages}
          columns={this._columns}
          onChange={(e) => this._handleChange(e)}
          rowKey='adId'
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

    list: state.operate.advertise.adsList || [],
    auditDetails: state.operate.operateCommon.auditDetails,
    filter: state.operate.advertise.adFilter || {},
    pagination: state.operate.advertise.adPagination,
    preRouter: state.router.pre,
    allPositionList: state.operate.advertise.allPositionList || []
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Advertise)
