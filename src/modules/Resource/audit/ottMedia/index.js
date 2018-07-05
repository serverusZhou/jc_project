import React, { Component } from 'react'
import { Table, Tabs } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { OTTRESOURCE_AUDIT_MEDIA_DETAIL } from 'Global/urls'
import { genPlanColumn, genSelectColumn } from 'Utils/helper'
import { AuditStatus, SearchAuditStatusKeyMap, OperateAuditType } from '../dict'
import fetchOtt from 'Utils/fetch'
import apis from '../../apis'

const TabPane = Tabs.TabPane

class Media extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      channel: {},
      list: [],
      showListSpin: false,
      type: 1,
    }
  }
  
  // 初始化表格数据
  componentWillMount() {
    this.getChannelInfo(1)
  }
  async getChannelInfo(key) {
    let type = location.search.replace(/\?/g, '')
    this.setState({
      showListSpin: true,
      type: parseInt(type)
    })
    let res = null
    let channel = {}
    let list = []
    if (key === 1) {
      res = await fetchOtt(apis.audit.ottMedia.unAuditedList, { type: type })
      channel = res.data || {}
      list = res.data ? [res.data] : []
    } else {
      //  审核类型：11=点播 12=资讯 13=推荐
      let auditType = 0
      const { OTTMediaPlay, OTTMediaNews, OTTMediaRecommend } = OperateAuditType
      switch (Number(type)) {
        case 1: auditType = OTTMediaPlay; break
        case 2: auditType = OTTMediaNews; break
        case 3: auditType = OTTMediaRecommend; break
      }
      res = await fetchOtt(apis.audit.ottMedia.auditedList, { 'auditStatus': '2', 'type': auditType })
      channel = res.data.data[0] || {}
      list = res.data.data ? res.data.data : []
    }
    this.setState({
      showListSpin: false
    })
    if (res.code === 0) {
      this.setState({
        channel,
        list,
      })
    } else {
      console.error(res.errmsg)
    }
  }
  // 切换选项卡
  _handleTab = ({ key }) => {
    this.getChannelInfo(parseInt(key))
  }

  // 组织搜索字段
  _genFilterFields = () => {
    const fields = [
      {
        key: 'auditStatus',
        label: '审核状态',
        initialValue: SearchAuditStatusKeyMap.WAIT.value,
        type: 'Select',
        content: SearchAuditStatus
      }
    ]
    return fields
  }
  // 生成表格展示字段
  _getColumns = (tab) => {
    const columns = [
      {
        key: 'title',
        title: '频道',
        align: 'center',
        dataIndex: 'title',
        render: (text, record) =>
          (
            <span>{['点播配置', '资讯配置', '推荐配置'][this.state.type - 1]}</span>
          )
      }
    ]
    const auditedColumns = [
      genSelectColumn('status', '审核状态', AuditStatus),
      {
        key: 'createTime',
        title: '审核时间',
        align: 'center',
        dataIndex: 'createTime',
        render: (text, record, index) =>
          (
            <span>
              {moment(record.createTime).format('YYYY-MM-DD HH:mm')}
            </span>
          )
      },
      genPlanColumn('userName', '责任人')
    ]
    const auditingColums = [
      {
        key: 'modifyTime',
        title: '提审时间',
        align: 'center',
        dataIndex: 'gmtModified',
        render: (text, record, index) =>
          (
            <span>
              {moment(record.modifyTime).format('YYYY-MM-DD HH:mm')}
            </span>
          )
      }
    ]
    const operationColumns = [
      {
        key: 'operation',
        title: '操作',
        align: 'center',
        render: (text, record, index) =>
          (<Link to={`${OTTRESOURCE_AUDIT_MEDIA_DETAIL}/${this.state.type},${this.state.channel.channelId}`}>
            查看
          </Link>)
      }
    ]
    // 审核日志详情
    const viewColumns = [
      {
        key: 'operation',
        title: '操作',
        align: 'center',
        render: (text, record, index) =>
          (<Link to={`${OTTRESOURCE_AUDIT_MEDIA_DETAIL}/${this.state.type},${this.state.channel.channelId},${record.auditId}`}>
            查看
          </Link>)
      }
    ]
    if (tab === SearchAuditStatusKeyMap.WAIT.value) {
      return columns.concat(auditingColums, operationColumns)
    } else {
      return columns.concat(auditedColumns, viewColumns)
    }
  }

  render() {
    return (
      <div>
        <Tabs onChange={(tab) => this._handleTab({ key: tab })} type='card'>
          <TabPane tab='待审核' key='1'>
            <Table
              bordered={true}
              columns={this._getColumns('1')}
              loading={this.state.showListSpin}
              dataSource={this.state.list}
              onChange={this._handleChange}
              rowKey='episodeId'
              locale={{ emptyText: '暂无数据' }}
              pagination={false}
            />
          </TabPane>
          <TabPane tab='已审核' key='2'>
            <Table
              bordered={true}
              columns={this._getColumns('2')}
              loading={this.state.showListSpin}
              dataSource={this.state.list}
              onChange={this._handleChange}
              rowKey='episodeId'
              locale={{ emptyText: '暂无数据' }}
              pagination={false}
            />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
export default connect()(Media)
