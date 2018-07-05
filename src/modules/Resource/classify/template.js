import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Table, Form, Row, Col, Select, Input, Radio } from 'antd'
import { Link } from 'react-router-dom'
import {
  getTemplateList,
  addTemplate,
  deleteTemplate,
} from './reduck'
import {
  getCategoryList
} from '../resource/third/reduck.js'
import styles from './styles.less'
import { isEmpty } from 'Utils/lang'
import { showModalForm } from 'Components/modal/ModalForm'
import { RESOURCE_CLASSIFY_MANAGE } from 'Global/urls'

const FormItem = Form.Item
const SelectOption = Select.Option
const RadioGroup = Radio.Group
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class TemplateList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cates: []
    }
  }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getCategoryList({ parentId: 1 })).then(res => {
      if (res.status === 'success') {
        this.setState({
          cates: res.result
        }, () => {
          const cateId = isEmpty(res.result) ? '' : res.result[0]['cateId']
          this._getList({ cateId })
        })
      }
    })
  }

  _columns = [
    {
      key: 'filedName',
      title: '字段名称',
      dataIndex: 'filedName',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'filedType',
      title: '字段属性',
      dataIndex: 'filedType',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'filedValue',
      title: '属性内容',
      dataIndex: 'filedValue',
      render: (text) => (
        <span>{text && text !== 'null' && `${text}部`}</span>
      )
    },
    {
      key: 'sort',
      title: '排序',
      dataIndex: 'sort',
      render: (text) => (
        <span>{text && text !== 'null' && `${text}部`}</span>
      )
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 100,
      render: (text, record) => {
        return (
          <div className={styles['table-ope']}>
            <a href='javascript:;' onClick={() => { this._handleTemplateAdd(true, record) }}>编辑</a>
            <a href='javascript:;' onClick={() => { this._handleTemplateDelete(record.attrOtherId) }}>删除</a>
          </div>
        )
      }
    }
  ]

  // 获取列表数据的公用方法
  _getList = () => {
    const { dispatch } = this.props
    const arg = this._getParameter()
    dispatch(getTemplateList(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = () => {
    const { form } = this.props
    const arg = form.getFieldsValue()
    return {
      ...arg,
    }
  }

  // 分类变化
  _handleCateChange = () => {
    this._getList()
  }

  // 删除
  _handleTemplateDelete = (attrOtherId) => {
    const { dispatch } = this.props
    dispatch(deleteTemplate({ attrOtherId })).then(res => {
      if (res.status === 'success') {
        this._getList()
      }
    })
  }

  // 添加字段
  _handleTemplateAdd = (isEdit, data) => {
    showModalForm({
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
      },
      title: '添加字段',
      cancelText: '取消',
      fields: [
        {
          id: 'filedName',
          props: {
            label: '字段名称：'
          },
          options: {
            initialValue: data && data.filedName ? data.filedName : undefined,
            rules: [{
              required: true,
              message: '请输入字段名称!'
            }]
          },
          element: (
            <Input
              maxLength='50'
              placeholder='请输入字段名称'
            />
          )
        },
        {
          id: 'filedType',
          props: {
            label: '字段属性：'
          },
          options: {
            initialValue: data && data.filedType ? data.filedType : '1',
          },
          element: (
            <RadioGroup>
              <Radio key='1' value='1'>输入</Radio>
              <Radio key='2' value='2'>选项</Radio>
              <Radio key='3' value='3'>时间</Radio>
              <Radio key='4' value='4'>图片</Radio>
              <Radio key='5' value='5'>剧集</Radio>
            </RadioGroup>
          )
        }
      ],
      onOk: values => {
        const { form, dispatch } = this.props
        const cateId = form.getFieldValue('cateId')
        dispatch(addTemplate({
          cateId,
          filedName: values['filedName'],
          filedType: values['filedType'],
          sort: values['sort'],
        })).then(res => {
          if (res.status === 'success') {
            this._getList()
          }
        })
      }
    })
  }

  // 获取展示代码段
  _getListPage = () => {
    const { getFieldDecorator } = this.props.form
    const { list, showListSpin } = this.props
    const { cates } = this.state
    return (
      <div>
        <Form
          className={styles['parameter-wrap']}
        >
          <Row id='mediaArea'>
            <Col span={6}>
              <FormItem
                label='一级分类：'
                {...formItemLayout}
              >
                {getFieldDecorator('cateId', {
                  initialValue: cates[0]['cateId'],
                })(
                  <Select
                    placeholder='请选择作品状态'
                    onChange={this._handleCateChange}
                    getPopupContainer={() => document.getElementById('mediaArea')}
                  >
                    {
                      !isEmpty(cates) && cates.map(cate => {
                        return (
                          <SelectOption
                            key={cate.cateId}
                            value={cate.cateId}
                          >
                            {cate.cateName}
                          </SelectOption>
                        )
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem className={styles['operate-btn']}>
                <Button
                  type='primary'
                  style={{ marginLeft: '20px' }}
                  onClick={() => { this._handleTemplateAdd(false) }}
                >
                  添加字段
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div className={styles['table-wrapper']}>
          <Table
            className={styles['c-table-center']}
            columns={this._columns}
            rowKey='attrOtherId'
            dataSource={list}
            bordered={true}
            loading={showListSpin}
            size='small'
            pagination={false}
          />
        </div>
      </div>
    )
  }

  // 获取无数据代码段
  _getNoDataPage = () => {
    return (
      <div className={styles['no-data']}>
        <span>还未创建分类！</span>
        <p>请先创建一级分类，再进行字段模版创建</p>
        <Link to={RESOURCE_CLASSIFY_MANAGE}>
          <Button>去创建分类</Button>
        </Link>
      </div>
    )
  }
  render() {
    const { cates } = this.state
    return (
      <div>
        {
          isEmpty(cates) ? this._getNoDataPage() : this._getListPage()
        }
      </div>
     
    )
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.resource.classify.templateList,
    auths: state.common.auths,
    showListSpin: state.common.showListSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(TemplateList))
