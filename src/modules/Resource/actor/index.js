import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Table, Form, Row, Col, Select, Popconfirm, message, Input } from 'antd'
import {
  getActorList,
  setQueryPar,
  resetQueryPar,
  shelves,
} from './reduck'
import styles from './styles.less'
import { RESOURCE_ACTOR_ADD, RESOURCE_ACTOR_EDIT, RESOURCE_ACTOR_DETAIL, RESOURCE_ACTOR } from 'Global/urls'
import { genPagination } from 'Utils/helper'
import { trim } from 'Utils/lang'

const FormItem = Form.Item
const SelectOption = Select.Option
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const status = {
  '1': '已上架',
  '0': '已下架',
  '3': '上架中',
  '4': '下架中',
}

class ActorList extends Component {

  componentWillUnmount() {
    const { dispatch } = this.props
    if (!location.pathname.startsWith(RESOURCE_ACTOR)) {
      dispatch(resetQueryPar())
    }
  }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    this._getList()
  }

  _columns = [
    {
      key: 'key',
      title: '演员ID',
      dataIndex: 'key',
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.list
        return (
          <span>{(pageNo - 1) * pageSize + index + 1}</span>
        )
      }
    },
    {
      key: 'name',
      title: '演员姓名',
      dataIndex: 'name',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'relatedAct',
      title: '关联作品',
      dataIndex: 'relatedAct',
      render: (text) => (
        <span>{text && text !== 'null' && `${text}部`}</span>
      )
    },
    {
      key: 'status',
      title: '当前状态',
      dataIndex: 'status',
      render: (text) => (
        <span>{text && text !== 'null' && status[text]}</span>
      )
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 250,
      render: (text, record) => {
        return (
          <div className={styles['table-ope']}>
            {
              <Link to={`${RESOURCE_ACTOR_DETAIL}/${record.actorId}`}>
                查看
              </Link>
            }
            {
              <Link to={`${RESOURCE_ACTOR_EDIT}/${record.actorId}`}>
                编辑
              </Link>
            }
            {
              (record.status === '1' || record.status === '0') &&
              (record.status === '1'
              ? <Popconfirm
                title='下架后，该演员的所有作品都将下架，无法进行观看/购买'
                onConfirm={() => { this._handleShelves(record.actorId, '0') }}
                okText='确认'
                cancelText='取消'
                >
                <a href='javascript:;'>下架所有作品</a>
              </Popconfirm>
              : <a href='javascript:;' onClick={() => { this._handleShelves(record.actorId, '1') }}>上架所有作品</a>
            )
            }
          </div>
        )
      }
    }
  ]

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(getActorList(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.list.pageNo, pageSize = this.props.list.pageSize) => {
    const { dispatch, form } = this.props
    const arg = form.getFieldsValue()
    dispatch(setQueryPar(arg))
    return {
      ...arg,
      name: trim(arg.name),
      currentPage: current,
      pageSize: pageSize,
    }
  }

  // 点击查询
  _handleQuery = () => {
    this._getList(1)
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    if (this.props.list.pageSize === page.pageSize) {
      this._getList(page.current)
    } else {
      this._getList(1, page.pageSize)
    }
  }
  
  // 上下架作品
  _handleShelves = (actorId, status) => {
    const { dispatch } = this.props
    const mes = {
      1: '上架成功',
      0: '下架成功'
    }
    dispatch(shelves({ status, actorId })).then(res => {
      if (res.status === 'success') {
        message.success(mes[status])
        this._getList()
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { list, showListSpin, initQueryPar } = this.props
    const pagination = genPagination(list)
    return (
      <div>
        <Form
          className={styles['parameter-wrap']}
        >
          <Row id='mediaArea'>
            <Col span={6}>
              <FormItem
                label='作品状态：'
                {...formItemLayout}
              >
                {getFieldDecorator('auditStatus', {
                  initialValue: initQueryPar.status ? initQueryPar.status : undefined,
                })(
                  <Select
                    allowClear={true}
                    placeholder='请选择作品状态'
                    getPopupContainer={() => document.getElementById('mediaArea')}
                  >
                    <SelectOption
                      key={0}
                      value={0}
                    >
                      已下架
                    </SelectOption>
                    <SelectOption
                      key={1}
                      value={1}
                    >
                      已上架
                    </SelectOption>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label='演员名称：'
                {...formItemLayout}
              >
                {getFieldDecorator('name', {
                  initialValue: initQueryPar.name ? initQueryPar.name : undefined,
                })(
                  <Input
                    placeholder='请输入演员名称'
                    maxLength='50'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem className={styles['operate-btn']}>
                <Button
                  type='primary'
                  title='点击查询'
                  onClick={this._handleQuery}
                >
                  查询
                </Button>
                <Link to={`${RESOURCE_ACTOR_ADD}`}>
                  <Button
                    type='primary'
                  >
                    新增
                  </Button>
                </Link>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div className={styles['table-wrapper']}>
          <Table
            className={styles['c-table-center']}
            columns={this._columns}
            rowKey='actorId'
            dataSource={list.data}
            bordered={false}
            loading={showListSpin}
            size='small'
            onChange={this._handlePageChange}
            pagination={pagination}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.resource.actor.actorList,
    // page: state.resource.actor.page,
    initQueryPar: state.resource.actor.initQueryPar,
    auths: state.common.auths,
    showListSpin: state.common.showListSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ActorList))
