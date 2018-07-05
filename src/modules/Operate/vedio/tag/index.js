import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Divider, Popconfirm, Button, Form, Input } from 'antd'
import { genPlanColumn, genPagination } from 'Utils/helper'
import { vedioTagsList, deleteTag, addTag, editTag } from '../reduck'
import { showModalWrapper } from 'Components/modal/ModalWrapper'
import styles from '../style.less'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 }
}

class Tag extends Component {

  constructor(props) {
    super(props)
    this.state = {
      parentCateId: this.props.match.params.cateId
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    const { parentCateId } = this.state
    dispatch(vedioTagsList({ pageSize: 10, currentPage: 1, parentCateId }))
  }

  _columns = [
    genPlanColumn('cateName', '标签名称'),
    genPlanColumn('sort', '排序'),
    genPlanColumn('createTime', '添加时间'),
    genPlanColumn('modifyTime', '更新时间'),
    genPlanColumn('operate', '操作', {
      render: (text, record) => {
        return (
          <span>
            <a onClick={() => this._handleAdd('edit', record)}>修改</a>
            <Divider type='vertical' />
            <Popconfirm
              placement='topRight'
              title='确定要删除该条数据吗？'
              onConfirm={() => this._handleDelete(record.cateId)}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }
    }),
  ]

  _handleChange = (pagination, filters, sorter) => {
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(vedioTagsList(finalFilter))
  }

  _handleDelete = (cateId) => {
    const { dispatch, filter, list, page } = this.props
    const length = list.length
    if (length > 1) {
      dispatch(deleteTag({ cateId }, filter))
    } else if (length === 1) {
      dispatch(deleteTag({ cateId }, { ...filter, currentPage: page.pageNo > 1 ? Number(page.currentPage) - 1 : 1 }))
    }
  }

  AddContent = props => {
    const { getFieldDecorator } = props.form
    const { onCancel, type, record } = props
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label='标签名称'
        >
          {getFieldDecorator('cateName', {
            rules: [{
              required: true,
              message: '请输入标签名称!'
            }],
            initialValue: type === 'add' ? '' : record.cateName
          })(
            <Input placeholder='请输入标签名称' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='排序'
        >
          {getFieldDecorator('sort', {
            rules: [{
              required: true,
              message: '请输入排序!'
            }, {
              pattern: /^[1-9]\d*$/,
              message: '只能输入1-9999的整数',
            }],
            initialValue: type === 'add' ? '' : record.sort
          })(
            <Input maxLength='4' placeholder='请输入排序' />
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
            onClick={() => this._sourceModalConfirm(props)}
          >确定
          </Button>
        </FormItem>
      </Form>
    )
  }

  _sourceModalConfirm = (props) => {
    props.form.validateFields((err, values) => {
      if (!err) {
        const { filter, dispatch } = this.props
        const { parentCateId } = this.state
        props.type === 'add' && dispatch(addTag({
          parentCateId,
          cateName: values.cateName,
          sort: values.sort,
        }, filter, props.onCancel))
        props.type === 'edit' && dispatch(editTag({
          cateId: props.record.cateId,
          cateName: values.cateName,
          sort: values.sort,
        }, filter, props.onCancel))
      }
    })
  }

  _handleAdd = (type, record) => {
    const AddContent = Form.create()(this.AddContent)
    showModalWrapper((
      <AddContent record={record} type={type} />
    ), {
      title: type === 'add' ? '新增标签' : '修改标签',
    })
  }

  render() {
    const { showListSpin, list, page } = this.props
    const pagination = genPagination(page)
    return (
      <div>
        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
          <Button
            type='primary'
            onClick={() => this._handleAdd('add')}
          >新增
          </Button>
        </div>
        <Table
          pagination={pagination}
          columns={this._columns}
          onChange={this._handleChange}
          rowKey='cateId'
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
    list: state.operate.vedio.tagList,
    filter: state.operate.vedio.tagFilter,
    page: state.operate.vedio.tagPage,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Tag)
