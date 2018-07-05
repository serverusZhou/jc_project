import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, Form, Input, Button, Pagination, TreeSelect, Divider } from 'antd'
import Filter from 'Components/Filter/index'
import * as commonActions from '../reduck'
import { message } from 'antd/lib/index'
import { isEmpty } from 'Utils/lang'
import { genPagination } from 'Utils/helper'

const SHOW_PARENT = TreeSelect.SHOW_PARENT
class EpisodeModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedFilterValue: [],
      selectedValue: {},
      showModal: false
    }
  }

  componentWillMount() {
    const { dispatch, dataSource } = this.props
    dispatch(commonActions.getCateList())
    this._getEpisodeList()
    this.setState({ dataSourceLocal: dataSource })
  }

  // 获取视频资源
  _getEpisodeList = (arg) => {
    const { dispatch } = this.props
    dispatch(commonActions.getEpisodeList({ currentPage: 1, pageSize: 5, auditStatus: 3, isUse: 1, ...arg } || { currentPage: 1, pageSize: 5, auditStatus: 3, isUse: 1 }))
  }

  _onChangeCate = (selectedFilterValue) => {
    this.setState({ selectedFilterValue })
  }

  _genFilterFields = () => {
    const { selectedFilterValue } = this.state
    const { cateList } = this.props
    const treeData = cateList && cateList.map((o) => {
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
      onChange: this._onChangeCate,
      treeCheckable: true,
      searchPlaceholder: '请选择分类',
      showCheckedStrategy: SHOW_PARENT,
      style: {
        width: 300,
      },
    }
    const fields = [
      {
        key: 'cateIds',
        label: '分类',
        options: {
          initialValue: selectedFilterValue || []
        },
        element: (
          <TreeSelect
            {...tProps}
            dropdownMatchSelectWidth={false}
            // getPopupContainer={() => document.getElementById('belongIndustry')}
          />
        ),
        hasPopup: true
      }, {
        key: 'searchName',
        label: '视频名称',
        initialValue: this.props.filter.searchName || '',
        type: 'Input',
      }
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
    if (!item.childs || isEmpty(item.childs)) {
      this._setValue(item)
    } else {
      return false
    }
  }

  _episodeListHTML = (item, index) => {
    const { allCateList } = item
    const type = allCateList && allCateList.reduce((type, o) => {
      if (o.cateParentId === '1') {
        type.push(o.cateName)
      }
      return type
    }, [])
    return (
      <div key={index}>
        <div style={{ lineHeight: '2.6em' }}>
          {item.highlightList && !isEmpty(item.highlightList) || (item.childs && !isEmpty(item.childs)) ? <span>{item.episodeCnName}</span> : <Button style={{ border: 'none' }} onClick={() => this._handlerSelect(item)}>{item.episodeCnName}</Button>}
          <span style={{ marginLeft: '6px', fontSize: '9px' }}>{type && type.join('/')}</span>
          {(!item.highlightList || isEmpty(item.highlightList)) && (!item.childs || isEmpty(item.childs)) && <Divider type='horizontal' style={{ margin: '10px 0' }} />}
        </div>
        {/* 剧集 */}
        {item.childs && !isEmpty(item.childs) && <div>
          <span>
            {item.childs.map(
              (o, index) => <Button onClick={() => this._setValue(o)} key={index} style={{ marginRight: '6px', marginTop: '6px' }}>{index + 1}</Button>
            )}
          </span>
        </div>}
        {/* 花絮 */}
        {item.highlightList && !isEmpty(item.highlightList) && <div>
          {isEmpty(item.childs) && <Button onClick={() => this._setValue(item)} style={{ marginRight: '6px', marginTop: '6px' }}>{'正片'}</Button>}
          <span>
            {item.highlightList.map(
              (o, index) => <Button onClick={() => this._setValue(o)} key={index} style={{ marginRight: '6px', marginTop: '6px' }}>{'花絮' + index + 1}</Button>
            )}
          </span>
          <Divider type='horizontal' style={{ margin: '10px 0' }} />
        </div>}
      </div>
    )
  }

  _showModal = () => {
    this.setState({ showModal: true })
  }

  _handleCancel = () => {
    this.setState({
      showModal: false,
    })
  }

  // 获取视频资源翻页
  _handlerPageChange = (currentPage, pageSize) => {
    const { dispatch, filter, page } = this.props
    const arg = {
      ...filter,
      currentPage: (page.pageSize !== pageSize) ? 1 : currentPage,
      pageSize: pageSize || 5,
    }
    dispatch(commonActions.getEpisodeList({ ...arg }))
  }

  // 视频搜索
  _handleSearch(data) {
    const { filter } = this.props
    this._getEpisodeList({ ...filter, ...data, searchName: data.searchName.trim(), currentPage: 1 })
  }
  render() {
    const { selectedValue, list, page } = this.props
    const { showModal } = this.state
    const pages = genPagination({ ...page, current: page.currentPage, records: page.records || page.recoreds })

    const fields = this._genFilterFields()
    return (
      <div className={'episode'}>
        <Input
          rows={9}
          value={selectedValue}
          onClick={() => this._showModal()}
        />
        <Modal
          width={'800px'}
          title='请选择视频'
          visible={showModal}
          onOk={this._handleSelect}
          onCancel={this._handleCancel}
        >
          <Filter
            fields={fields}
            onSearch={(data) => this._handleSearch(data)}
          />
          {list && list.map((o, index) => this._episodeListHTML(o, index))}
          <div style={{ textAlign: 'right', borderTop: '1px solid  #f5f4f4', paddingTop: '12px', paddingBottom: '12px' }}>
            <Pagination
              onChange={(current, pageSize) => this._handlerPageChange(current, pageSize)}
              onShowSizeChange={(current, pageSize) => this._handlerPageChange(current, pageSize)}
              {...pages}
            />
          </div>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    cateList: state.operate.operateCommon.cateList,
    list: state.operate.operateCommon.episodeList,
    page: state.operate.operateCommon.episodePage || { current: 1, records: 0, pages: 0 },
    filter: state.operate.operateCommon.episodeFilter,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(EpisodeModal))
