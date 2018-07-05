import React, { Component } from 'react'
import {
  Form, Input, Table, Popconfirm, Radio, Button, Modal,
  Select, Divider, InputNumber, Tooltip, Icon, Alert, Badge } from 'antd'
import { connect } from 'react-redux'
import * as actions from '../reduck'
import { isEmpty } from 'Utils/lang'
import JcFilter from '../../../components/styleComponents/JcFilter/index'
import JcContent from '../../../components/styleComponents/JcContent/index'
import '../../style.less'

const RadioGroup = Radio.Group
const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
}
const classifyType = [
  {
    key: '0',
    value: '一级类目'
  },
  {
    key: '1',
    value: '二级类目'
  }
]
const status = [
  {
    key: 1,
    value: '未审核'
  },
  {
    key: 2,
    value: '审核中'
  },
  {
    key: 3,
    value: '已通过'
  },
  {
    key: 4,
    value: '未通过'
  },
]

class superMarket extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      type: '0', // 0为新增 其他为修改
      data: {},
      filterData: {},
      selectedRowKeys: []
    }
  }
  componentDidMount = () => {
    this._handleAction()
    this.props.dispatch(actions.getClassify({ businessType: '2' }))
  }
  // 请求列表参数
  _getParameter = (currentPage = 1, pageSize = 10) => {
    return { ...this.state.filterData, currentPage, pageSize, businessType: '2' }
  }
// 发起列表查询的 ACTION
  _handleAction = (page = 1) => {
    const { dispatch } = this.props
    const arg = this._getParameter(page)
    dispatch(actions.getClassifyList(arg))
  }
  // 点击查询按钮时，根据参数获取表格数据
  _handleSubmit = (values) => {
    this.setState({ filterData: values }, () => {
      this._handleAction()
    })
  }
  // 点击分页时获取表格数据
  _handlePagination = (page) => {
    this._handleAction(page)
  }
  // 删除
  _deleteClassify = (categoryId) => {
    const { dispatch, pagination } = this.props
    const value = this._getParameter(pagination.current)
    dispatch(actions.getClassifyDelete({ categoryId }, value))
  }
  // 提交审核
  _audit = (data) => {
    const { dispatch, pagination } = this.props
    const arg = { categoryIds: [].concat(data.categoryId) }
    const value = this._getParameter(pagination.current)
    dispatch(actions.submitAudit(arg, value))
  }
  // 撤销审核
  _revoke = (data) => {
    const { dispatch, pagination } = this.props
    const arg = { categoryId: data.categoryId }
    const value = this._getParameter(pagination.current)
    dispatch(actions.submitRevoke(arg, value))
  }
  // 批量审核
  _batchAudit = () => {
    const { dispatch, pagination } = this.props
    const value = this._getParameter(pagination.current)
    dispatch(actions.submitAudit({ categoryIds: this.state.selectedRowKeys }, value))
    this._cleanSelectedKeys()
  }
  // modal取消
  _handleCancel = () => {
    this._setVisible()
  }
  // modal确认
  _handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this._setVisible()
        const { type, data } = this.state
        const { dispatch, pagination } = this.props
        const { parentId, parentType, ...value } = values
        const arg = { businessType: '2', parentId: parentType === '0' ? '0' : parentId, ...value }
        if (type === '0') {
          const value = this._getParameter()
          dispatch(actions.getClassifyAdd(arg, value))
        } else {
          const value = this._getParameter(pagination.current)
          dispatch(actions.getClassifyModify({ ...arg, categoryId: data.categoryId }, value))
        }
      }
    })
  }
  // 控制modal显示隐藏
  _setVisible = () => {
    this.setState({ visible: !this.state.visible })
  }
  // 新增
  _AddClassifyModal = () => {
    this.setState({ data: {}, type: '0' }, () => {
      this._setVisible()
    })
  }
  // 修改
  _modifyClassify = (data) => {
    this.setState({ data, type: '1' }, () => {
      this._setVisible()
    })
  }

  _getDictValue = (dictionary, key) => {
    const filterDic = dictionary.filter(dictionary => dictionary.key === Number(key))
    if (filterDic.length > 0) {
      return filterDic[0].value
    }
    return ''
  }

  _parentType = (data) => {
    const type = !isEmpty(data.parentId) && data.parentId === '0' ? '0' : '1'
    return type
  }

  _onSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys
    })
  }

  _cleanSelectedKeys = () => {
    this.setState({
      selectedRowKeys: []
    })
  }

  _setParentId = (parentId) => {
    return parentId === '0' ? '' : parentId
  }

  _setStatus = (status) => {
    if (status === 1) {
      return 'warning'
    } else if (status === 2) {
      return 'processing'
    } else if (status === 3) {
      return 'success'
    } else {
      return 'error'
    }
  }
  _setSortValue = (rule, value, callback) => {
    if (isEmpty(value) || value === '') {
      callback()
    }
    if (value > 9999 || value < 1) {
      callback('请输入1~9999的数值')
    } else {
      callback()
    }
  }
// 组件 jsx 的编写
  render() {
    const { List, pagination, FirstCategory } = this.props
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { type, visible, data, selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this._onSelectChange,
    }
    const TooltipStyle = {
      width: 140,
      display: 'block',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    }
    const buttons = [
      {
        desc: '查询',
        type: 'action',
        btnType: 'primary',
        onClick: this._handleSubmit
      }
    ]
    const fields = [
      {
        label: '类目名称',
        fieldName: 'categoryName',
        componentType: 'Input'
      }
    ]
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => {
          return <span>{index + 1}</span>
        }
      },
      {
        title: '类目名称',
        dataIndex: 'categoryName',
        key: 'categoryName',
        render: (text, record) => {
          return (
            <Tooltip
              placement='bottom'
              title={text}
            >
              <span style={TooltipStyle}>{text}</span>
            </Tooltip>
          )
        }
      }, {
        title: '上级分类',
        dataIndex: 'parentName',
        key: 'parentName',
        render: (text, record) => {
          return (
            <span>
              {!isEmpty(record.parentName)
                ? (
                  <Tooltip
                    placement='bottom'
                    title={text}
                  >
                    <span style={TooltipStyle}>{text}</span>
                  </Tooltip>) : '无' }
            </span>
          )
        }
      }, {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          return (
            <span>
              <Badge status={this._setStatus(Number(record.status))} text={this._getDictValue(status, record.status)} />
              {Number(record.status) === 4 && (
                <Tooltip
                  placement='bottom'
                  title={isEmpty(record.unapprovedReason) ? '拒绝原因：暂无' : <p className='tip-title'>{record.unapprovedReason}</p>}
                >
                  <Icon
                    style={{ color: 'rgba(0, 0, 0, 0.45)', marginLeft: 4 }}
                    type='question-circle-o'
                  />
                </Tooltip>
              )}
            </span>
          )
        }
      }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          return (
            <span>
              {
                Number(record.status) === 1 && (
                  <span>
                    <Popconfirm
                      title='确认要提审嘛？'
                      okText='确认'
                      cancelText='取消'
                      onConfirm={() => this._audit(record)}
                    >
                      <a>
                        提审
                      </a>
                    </Popconfirm>
                    <Divider type='vertical' />
                  </span>
                )
              }
              {
                Number(record.status) === 2 && (
                  <span>
                    <Popconfirm
                      title='确认要撤销嘛？'
                      okText='确认'
                      cancelText='取消'
                      onConfirm={() => this._revoke(record)}
                    >
                      <a>
                        撤销
                      </a>
                    </Popconfirm>
                  </span>
                )
              }
              {
                Number(record.status) !== 2 && (
                  <span>
                    <a onClick={() => this._modifyClassify(record)}>编辑</a>
                    <Divider type='vertical' />
                    <Popconfirm
                      title='确认要删除嘛？'
                      okText='确认'
                      cancelText='取消'
                      onConfirm={() => this._deleteClassify(record.categoryId)}
                    >
                      <a>
                        删除
                      </a>
                    </Popconfirm>
                  </span>
                )
              }
            </span>
          )
        }
      }]
    return (
      <JcContent>
        <JcFilter
          fields={fields}
          buttons={buttons}
        />
        <div style={{ marginBottom: '20px' }}>
          <Button
            type={'primary'}
            onClick={this._AddClassifyModal}
          >
            新增
          </Button>
          <Button
            onClick={this._batchAudit}
            style={{ marginLeft: 8 }}
            disabled={selectedRowKeys.length === 0}
          >
            批量提审
          </Button>
        </div>
        <Alert
          message={
            <span>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项
              <a
                onClick={this._cleanSelectedKeys}
                style={{ marginLeft: 12 }}
              >
                清空
              </a>
            </span>
          }
        />
        <Table
          key='table'
          style={{ marginTop: 15 }}
          columns={columns}
          dataSource={List}
          bordered={false}
          rowKey={record => record.categoryId}
          rowSelection={rowSelection}
          pagination= {{ ...pagination, onChange: this._handlePagination }}
        />
        <Modal
          key='modal'
          title= {type === '0' ? '新增类目' : '编辑类目'}
          visible={visible}
          destroyOnClose={true}
          onCancel={this._handleCancel}
          footer={[
            <Button
              key='cancel'
              onClick={this._handleCancel}
            >
              取消
            </Button>,
            <Button
              key='confirm'
              type='primary'
              onClick={this._handleOk}
            >
              确定
            </Button>,
          ]}
        >
          <Form>
            <FormItem
              label='类目名称'
              {...formItemLayout}
            >
              {getFieldDecorator('categoryName', {
                initialValue: type === '0' ? '' : data.categoryName,
                rules: [{
                  required: true,
                  message: '类目名称不能为空',
                }, {
                  max: 10,
                  message: '类目名称最多十个字符'
                }]
              })(
                <Input autoComplete={'off'} />
              )}
            </FormItem>
            <FormItem
              label='类目级别'
              {...formItemLayout}
            >
              {getFieldDecorator('parentType', {
                initialValue: type === '0' ? '0' : this._parentType(data),
                rules: [{
                  required: true,
                  message: '类目名称不能为空',
                }]
              })(
                <RadioGroup disabled={type !== '0'}>
                  {classifyType.map(item => {
                    return (
                      <Radio
                        key={item.key}
                        value={item.key}
                      >
                        {item.value}
                      </Radio>
                    )
                  })}
                </RadioGroup>
              )}
            </FormItem>
            {
              getFieldValue('parentType') === '1' &&
              <FormItem
                label='上级类目'
                {...formItemLayout}
                extra={FirstCategory.length > 0 ? '' : '暂无一级类目，请先添加一级类目'}
              >
                {getFieldDecorator('parentId', {
                  initialValue: type === '0' ? '' : this._setParentId(data.parentId),
                  rules: [{
                    required: true,
                    message: '类目名称不能为空',
                  }]
                })(
                  <Select
                    disabled={FirstCategory.length === 0}
                    placeholder='请选择上级类目'
                  >
                    {FirstCategory.map(item => {
                      return (
                        <Option
                          key={item.categoryId}
                          value={item.categoryId}
                        >
                          {item.categoryName}
                        </Option>
                      )
                    })}
                  </Select>
                )}
              </FormItem>
            }
            {
              getFieldValue('parentType') === '0' &&
              <FormItem
                label='上级类目'
                {...formItemLayout}
              >
                {getFieldDecorator('parentNull')(
                  <span>无</span>
                )}
              </FormItem>
            }
            <FormItem
              label='类目排序'
              {...formItemLayout}
            >
              {getFieldDecorator('sort', {
                initialValue: type === '0' ? '' : data.sort,
                rules: [{
                  validator: this._setSortValue
                }]
              })(
                <InputNumber
                  min={1}
                  max={9999}
                  precision={0}
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      </JcContent>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    List: state.classify.List,
    FirstCategory: state.classify.FirstCategory,
    pagination: state.classify.pagination,
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch,
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(superMarket))
