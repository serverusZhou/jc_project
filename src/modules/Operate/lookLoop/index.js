import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Button, Popconfirm, Form, Input } from 'antd'

import { genPlanColumn, genPagination } from 'Utils/helper'
import Filter from 'Components/Filter'
import { showModalWrapper } from 'Components/modal/ModalWrapper'

import { lookLoopList, deleteLookLoop, addLookLoop } from './reduck'
import styles from './style.less'
import { showepisodeListModal } from '../component/episodeListModal'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
}

class LookLoop extends Component {

  constructor(props) {
    super(props)
    this.state = {
      vedioSource: {},
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(lookLoopList({ pageSize: 10, currentPage: 1 }))
  }

  _handleDelete = (lookLoopId) => {
    const { dispatch, filter, list, page } = this.props
    const length = list.length
    if (length > 1) {
      dispatch(deleteLookLoop({ lookLoopId }, filter))
    } else if (length === 1) {
      dispatch(deleteLookLoop({ lookLoopId }, { ...filter, currentPage: page.pageNo > 1 ? Number(page.currentPage) - 1 : 1 }))
    }
  }

  _columns = [
    genPlanColumn('movieName', '名称'),
    genPlanColumn('cateName', '分类'),
    genPlanColumn('createTime', '添加时间'),
    genPlanColumn('operate', '操作', {
      render: (text, record) => (
        <Popconfirm
          title='确认要删除该条数据吗？'
          onConfirm={() => this._handleDelete(record.lookLoopId)}
        >
          <a>删除</a>
        </Popconfirm>
      )
    }),
  ]

  _handleSearch = searchData => {
    const { filter } = this.props

    const finalFilter = Object.assign(
      {},
      filter,
      searchData,
      {
        movieName: searchData.movieName && searchData.movieName.trim(),
        currentPage: 1
      })
    this.props.dispatch(lookLoopList(finalFilter))
  }

  _handleChange = (pagination, filters, sorter) => {
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(lookLoopList(finalFilter))
  }

  _genFilterFields = (filter) => {
    // const {  } = this.props
    const fields = [
      {
        key: 'movieName',
        label: '名称',
        initialValue: filter['movieName'],
        type: 'Input',
      },
    ]

    return fields
  }

  _modalConfirm = (props) => {
    const { filter, dispatch } = this.props
    const { vedioSource } = this.state
    const cateList = vedioSource.allCateList ? vedioSource.allCateList.map((item) => {
      return {
        cateTypeId: item.cateId,
        cateTypeName: item.cateName,
      }
    }) : []
    dispatch(addLookLoop({
      movieName: vedioSource.episodeCnName,
      cateList,
      episodeId: vedioSource.episodeId,
      coverimg: vedioSource.cover169Url || vedioSource.cover34Url || vedioSource.cover23Url,
    }, filter, props.onCancel))
  }

  AddContent = props => {
    const { getFieldDecorator, setFieldsValue } = props.form
    const { onCancel } = props
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label='资源名称'
        >
          {getFieldDecorator('episodeCnName', {
            rules: [{
              required: true,
              message: '请选择资源!'
            }],
          })(
            <Input
              maxLength='50'
              placeholder='请选择资源'
              onClick={() => showepisodeListModal({
                showHighlight: false,
                noShowChild: true,
                onSelect: (data) => {
                  this.setState({ vedioSource: data })
                  setFieldsValue({ episodeCnName: data.episodeCnName })
                }
              }, {
                title: '选择',
                width: 800
              })}
            />
          )}
        </FormItem>
        <FormItem className={styles['jc-modal-form-footer']}>
          <Button
            key='cancel'
            onClick={() => {
              onCancel()
            }}
          >取消
          </Button>
          <Button
            key='confirm'
            type='primary'
            onClick={() => this._modalConfirm(props)}
          >确定
          </Button>
        </FormItem>
      </Form>
    )
  }

  _handleAdd = () => {
    const AddContent = Form.create()(this.AddContent)
    showModalWrapper((
      <AddContent />
    ), {
      title: '添加'
    })
  }

  render() {
    const { showListSpin, list, page, filter } = this.props
    const fields = this._genFilterFields(filter)
    const pagination = genPagination(page)

    return (
      <div>
        <Filter
          fields={fields}
          onSearch={this._handleSearch}
          extraBtns={[
            <Button key='add' type='primary' onClick={() => this._handleAdd()}>新增</Button>
          ]}
        />
        <Table
          pagination={pagination}
          columns={this._columns}
          onChange={this._handleChange}
          rowKey='lookLoopId'
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

    list: state.operate.lookLoop.lookLoopList,
    filter: state.operate.lookLoop.lookLoopFilter,
    page: state.operate.lookLoop.lookLoopPage,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(LookLoop)
