import React, { Component } from 'react'
import {
  Button,
  Divider,
  Pagination,
  Spin,
  Select
} from 'antd'
import Filter from 'Components/Filter/index'
import { isEmpty } from 'Utils/lang'
import { showModalWrapper } from 'Components/modal/ModalWrapper'
import apis from '../apis'
import styles from './style.less'
import { message } from 'antd/lib/index'
import fetchData from 'Utils/fetch'
import { genPagination } from 'Utils/helper'

const Option = Select.Option
class EpisodeList extends Component {
  static defaultProps = {
    showHighlight: true
  }

  constructor(props) {
    super(props)
    this.state = {
      cateDataSource: [],
      selectedFilterValue: [],
      selectedValue: {},
      showModal: false,
      dataSource: [],
      page: {},
      filter: {},
      loading: false
    }
  }

  componentWillMount() {
    fetchData(apis.common.applyCateList, {}).then(res => {
      if (res.code === 0) {
        this.setState({
          cateDataSource: res.data
        })
      } else {
        message.error(res.errmsg)
        return false
      }
    })
    this._handleSearch(1, 5)
  }

  _onChangeCate = (selectedFilterValue) => {
    this.setState({ selectedFilterValue })
  }

  _genFilterFields = () => {
    // const { selectedFilterValue } = this.state
    const { cateDataSource } = this.state
    const fields = [
      {
        key: 'cateId',
        label: '分类',
        initialValue: '',
        element: (
          <Select placeholder='请选择分类' style={{ width: '300px' }}>
            <Option value=''>全部</Option>
            {
              cateDataSource && cateDataSource.map(item => (
                <Option key={item.cateId} value={item.cateId}>{item.cateName}</Option>
              ))
            }
          </Select>
        ),
      }, {
        key: 'appName',
        label: '应用名称',
        initialValue: '',
        type: 'Input',
      },
    ]
    return fields
  }
  // 确认操作
  _handleSelect = (e) => {
    const { selectedValue } = this.state
    const { onSelect } = this.props
    if (selectedValue.length === 0) {
      message.error('请至少选中一个！')
      return
    }
    if (onSelect instanceof Promise) {
      onSelect(selectedValue).then(() => {
        this._handleCancel()
      })
    } else {
      onSelect(selectedValue)
      this._handleCancel()
    }
  }
// 获取视频资源
  _setValue = (item) => {
    this.setState({
      selectedValue: item
    })
  }
  // 选取无子元素资源
  _handlerSelect = (item) => {
    this._setValue(item)
  }

  _episodeListHTML = (item, index) => {
    return (
      <div key={index}>
        <span style={{ marginLeft: 10 }}>
          <Button style={{ border: 'none' }} onClick={() => this._handlerSelect(item)}>{item.appName}</Button>
        </span>
        <Divider type='horizontal' style={{ margin: '10px 0' }} />
      </div>
    )
  }

  _showModal = () => {
    this.setState({ showModal: true })
  }

  _handleCancel = () => {
    this.props.onCancel()
  }

  _getEpisodeList = (reqBean) => {
    this.setState({
      loading: true
    })
    fetchData(apis.common.applyList, { ...reqBean, auditStatus: 3 }).then(res => {
      if (res.code === 0) {
        this.setState({
          dataSource: res.data ? res.data.data : [],
          page: res.data,
          filter: reqBean
        })
      } else {
        message.error(res.errmsg)
      }
      this.setState({
        loading: false
      })
    })
  }

  _handleSearch = (currentPage = 1, pageSize = 5, values = {}) => {
    this._getEpisodeList({
      auditStatus: 3,
      ...values,
      currentPage,
      pageSize,
      appName: values.appName && values.appName.trim()
    })
  }

  _handlePageChange = (current, pageSize) => {
    const { filter, page } = this.state
    delete filter.currentPage
    delete filter.pageSize
    this._handleSearch(page.pageSize !== pageSize ? 1 : current, pageSize, filter)
  }

  render() {
    const { dataSource, page, loading } = this.state
    const fields = this._genFilterFields()
    const pagination = genPagination({ total: 0, current: 1, ...page, records: page.records })
    return (
      <Spin spinning={loading}>
        <Filter
          fields={fields}
          onSearch={(values) => this._handleSearch(1, 5, values)}
        />
        {dataSource && dataSource.map((o, index) => this._episodeListHTML(o, index))}
        <div style={{ textAlign: 'right', borderTop: '1px solid #f5f4f4', paddingTop: '12px', paddingBottom: '12px' }}>
          {!isEmpty(page) && (
            <Pagination
              onChange={this._handlePageChange}
              onShowSizeChange={this._handlePageChange}
              {...pagination}
            />
          )}
        </div>
        <div className={styles['jc-modal-form']}>
          <div className={styles['jc-modal-form-footer']}>
            <Button onClick={this.props.onCancel}>取消</Button>
            <Button type='primary' onClick={this._handleSelect}>确定</Button>
          </div>
        </div>
      </Spin>
    )
  }
}

const showApplyListModal = (params = {}, modalParam = {}) => {
  showModalWrapper(
    <EpisodeList {...params} />,
    {
      style: { minWidth: '700px' },
      ...modalParam
    }
  )
}

export { showApplyListModal }
