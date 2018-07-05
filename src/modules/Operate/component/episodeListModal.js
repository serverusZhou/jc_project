import React, { Component } from 'react'
import {
  Button,
  Divider,
  Pagination,
  TreeSelect,
  Spin
} from 'antd'
import Filter from 'Components/Filter/index'
import { isEmpty } from 'Utils/lang'
import { showModalWrapper } from 'Components/modal/ModalWrapper'
import apis from '../apis'
import styles from './ModalForm.less'
import { message } from 'antd/lib/index'
import fetchData, { fetchResource } from 'Utils/fetch'
import { genPagination } from 'Utils/helper'
import { EpisodeSource, MediaContentType } from '../dict'

const SHOW_PARENT = TreeSelect.SHOW_PARENT

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
    fetchResource(apis.common.cateList, {}).then(res => {
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
    const { isSelfSource } = this.props
    const { cateDataSource } = this.state
    const treeData = cateDataSource && cateDataSource.map((o) => {
      return {
        label: o.cateName,
        value: o.cateId,
        key: o.cateId,
        children: o.childList && o.childList.map((k) => {
          return {
            label: k.cateName,
            value: k.cateId,
            key: k.cateId,
            children: k.childList && k.childList.map((m) => {
              return {
                label: m.cateName,
                value: m.cateId,
                key: m.cateId,
              }
            }
            ) || []
          }
        }
        ) || []
      }
    })
    const tProps = {
      treeData,
      // onChange: this._onChangeCate,
      treeCheckable: true,
      searchPlaceholder: '请选择分类',
      style: {
        width: 300,
      },
      showCheckedStrategy: SHOW_PARENT
    }
    const fields = [
      {
        key: 'cateIds',
        label: '分类',
        element: (
          <TreeSelect
            {...tProps}
            dropdownMatchSelectWidth={false}
            // getPopupContainer={() => document.getElementById('belongIndustry')}
          />
        ),
      }, {
        key: 'searchName',
        label: '视频名称',
        initialValue: '',
        type: 'Input',
      },
    ]
    !isSelfSource && fields.push({
      key: 'source',
      label: '来源',
      initialValue: '',
      type: 'Select',
      content: EpisodeSource
    })
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
    if ((!item.childs || isEmpty(item.childs)) || this.props.noShowChild) {
      this._setValue(item)
    } else {
      return false
    }
  }

  _episodeListHTML = (item, index) => {
    const { showHighlight } = this.props
    // const { allCateList } = item
    // const type = allCateList ? allCateList.reduce((type, o) => {
    //   if (o.cateParentId === '1') {
    //     type.push(o.cateName)
    //   }
    //   return type
    // }, []) : []
    return (
      <div key={index}>
        <span style={{ marginLeft: 10 }}>
          {!this.props.noShowChild && ((item.highlightList && !isEmpty(item.highlightList)) || (item.childs && !isEmpty(item.childs))) ? <span style={{ marginLeft: 15 }}>{item.episodeCnName}</span> : <Button style={{ border: 'none' }} onClick={() => this._handlerSelect(item)}>{item.episodeCnName}</Button>}
          <span style={{ marginRight: '13px' }}>-</span><span>{MediaContentType[item.contentType]}</span>
        </span>
        {!this.props.noShowChild && (
          <div style={{ marginLeft: 20 }}>
            {/* 剧集 */}
            {item.childs && !isEmpty(item.childs) && <div>
              <span>
                {item.childs.map(
                  (o, index) => <Button onClick={() => this._setValue(o)} key={index} style={{ marginRight: '6px', marginTop: '6px' }}>{o.sort || (index + 1)}</Button>
                )}
              </span>
            </div>}
            {/* 花絮 */}
            {showHighlight && item.highlightList && !isEmpty(item.highlightList) && <div>
              {isEmpty(item.childs) && <Button onClick={() => this._setValue(item)} style={{ marginRight: '6px', marginTop: '6px' }}>{'正片'}</Button>}
              <span>
                {item.highlightList.map(
                  (o, index) => <Button onClick={() => this._setValue(o)} key={index} style={{ marginRight: '6px', marginTop: '6px' }}>{o.title}</Button>
                )}
              </span>
            </div>}
          </div>
        )}
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
    fetchData(apis.common.episodeList, { ...reqBean, isUse: 1, auditStatus: 3 }).then(res => {
      if (res.code === 0) {
        this.setState({
          dataSource: res.data ? res.data.msEpisodeVOList : [],
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
    const { isSelfSource } = this.props
    const param = {
      auditStatus: 3,
      isUse: 1,
      ...values,
      currentPage,
      pageSize,
      searchName: values.searchName && values.searchName.trim(),
    }
    if (isSelfSource) {
      param['source'] = 'self'
    }
    this._getEpisodeList(param)
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
    const pagination = genPagination({ total: 0, current: 1, ...page, records: page.recoreds })
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

const showepisodeListModal = (params = {}, modalParam = {}) => {
  showModalWrapper(
    <EpisodeList {...params} />,
    {
      style: { minWidth: '700px' },
      ...modalParam
    }
  )
}

export { showepisodeListModal }
