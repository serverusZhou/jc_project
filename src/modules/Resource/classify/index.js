import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Table, Form, Row, Col, Select, Input, Popconfirm } from 'antd'
import {
  getClassList,
  addClass,
  deleteClass,
} from './reduck'
import styles from './styles.less'
import { showModalForm } from 'Components/modal/ModalForm'
import { isEmpty, trim } from 'Utils/lang'

const FormItem = Form.Item
const SelectOption = Select.Option
const levelNames = {
  '1': '一级',
  '2': '二级',
}

class ClassList extends Component {

  // 生命周期， 初始化表格数据
  componentDidMount() {
    this._getList()
  }

  _columns = [
    {
      key: 'cateName',
      title: '分类名称',
      dataIndex: 'cateName',
      width: 250,
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'level',
      title: '级别',
      dataIndex: 'level',
      render: (text) => (
        <span>{text && text !== 'null' && levelNames[text]}</span>
      )
    },
    {
      key: 'parentName',
      title: '所属分类',
      dataIndex: 'parentName',
      render: (text) => {
        console.log(text)
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 200,
      render: (text, record) => {
        return (
          <div className={styles['table-ope']}>
            {
              record.level === 1 &&
              <a href='javascript:;' onClick={(e) => { this._handleClassAdd(false, record) }}>添加子分类</a>
            }
            <a href='javascript:;' onClick={(e) => { this._handleClassAdd(true, record) }}>编辑</a>
            <Popconfirm
              title={`确定要删除吗?`}
              onConfirm={(e) => this._handleClassDelete(e, record.cateId)}
              okText='确定'
              cancelText='取消'
            >
              <a href='javascript:void(0);'>删除</a>
            </Popconfirm>
          </div>
        )
      }
    }
  ]

  // 获取列表数据的公用方法
  _getList = () => {
    const { dispatch } = this.props
    dispatch(getClassList())
  }

  // 添加level
  _getLevelList = (list, level, parentCates) => {
    if (isEmpty(list)) {
      return
    }
    list.forEach((item) => {
      if (level === 1) {
        parentCates = []
      }
      item['level'] = level
      item['parentName'] = parentCates.join('<')
      if (!isEmpty(item['childList'])) {
        item['children'] = item['childList']
        parentCates.push(item.cateName)
        this._getLevelList(item['childList'], level + 1, parentCates)
      }
    })
    return list
  }

  // 添加子分类
  _handleClassAdd = (isEdit, record) => {
    const { list } = this.props
    const filterList = isEmpty(list) ? [] : list.filter(item => {
      return item.cateId === '1'
    })
    const parentCates = (!isEmpty(filterList) && record.level !== 0) ? filterList[0]['childList'] : []
    const titles = {
      '0': '添加一级分类',
      '1': isEdit ? '编辑一级分类' : '添加二级分类',
      '2': isEdit ? '编辑二级分类' : '',
    }
    
    const data = isEdit ? record : {
      cateParentId: record.cateId,
    }
    showModalForm({
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
      },
      title: titles[record.level],
      cancelText: '取消',
      fields: (record.level === 0 || (isEdit && record.level === 1)) ? [
        {
          id: 'cateName',
          props: {
            label: '分类名称：'
          },
          options: {
            initialValue: data && data.cateName ? data.cateName : undefined,
            rules: [{
              required: true,
              message: '请输入分类名称!'
            }]
          },
          element: (
            <Input
              maxLength='50'
              placeholder='请输入分类名称'
            />
          )
        }
      ] : [
        {
          id: 'cateParentId',
          props: {
            label: '上级分类：'
          },
          options: {
            initialValue: data && data.cateParentId ? data.cateParentId : undefined,
            rules: [{
              required: true,
              message: '请选择上级分类!'
            }]
          },
          element: (
            <Select
              allowClear={true}
              placeholder='请选择上级分类'
              getCalendarContainer={() => document.getElementsByClassName('ant-modal-wrap ')[0]}
            >
              {
                parentCates && parentCates.map((cate) => {
                  return (
                    <SelectOption
                      key={cate.cateId}
                      value={cate.cateId}
                    >{cate.cateName}
                    </SelectOption>
                  )
                })
                }
            </Select>
          )
        },
        {
          id: 'cateName',
          props: {
            label: '分类名称：'
          },
          options: {
            initialValue: data && data.cateName ? data.cateName : undefined,
            rules: [{
              required: true,
              message: '请输入分类名称!'
            }]
          },
          element: (
            <Input
              maxLength='50'
              placeholder='请输入分类名称'
            />
          )
        }
      ],
      onOk: values => {
        const { dispatch } = this.props
        dispatch(addClass({
          cateParentId: values['cateParentId'] ? values['cateParentId'] : '1',
          cateName: trim(values['cateName']),
          cateId: record.cateId ? record.cateId : '',
        }, isEdit)).then(res => {
          if (res.status === 'success') {
            this._getList()
          }
        })
      }
    })
  }

  // 删除
  _handleClassDelete = (e, cateId) => {
    const { dispatch } = this.props
    dispatch(deleteClass({ cateId }))
  }

  render() {
    const { list, showListSpin } = this.props
    const filterList = list.filter(item => {
      return item.cateId === '1'
    })
    const levelList = isEmpty(filterList) ? [] : this._getLevelList(list[0]['childList'], 1, [])
    return (
      <div>
        <Form
          className={styles['parameter-wrap']}
        >
          <Row>
            <Col span={6}>
              <FormItem className={styles['operate-btn']}>
                <Button
                  type='primary'
                  onClick={() => { this._handleClassAdd(false, { level: 0 }) }}
                >
                  添加一级分类
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div className={styles['table-wrapper']}>
          <Table
            className={styles['c-table-center']}
            columns={this._columns}
            rowKey='cateId'
            dataSource={levelList}
            bordered={false}
            loading={showListSpin}
            size='small'
            pagination={false}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.resource.classify.classList,
    auths: state.common.auths,
    showListSpin: state.common.showListSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ClassList))
