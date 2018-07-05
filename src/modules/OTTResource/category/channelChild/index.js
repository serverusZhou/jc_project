import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table, Icon, Input, message, Divider, Popconfirm, Form, Button, Modal } from 'antd'

import { genPlanColumn, genPagination } from 'Utils/helper'
import Filter from 'Components/Filter'
import { showModalWrapper } from 'Components/modal/ModalWrapper'
import { showModalForm } from 'Components/modal/ModalForm'
import AliUpload from 'Components/upload/aliUploadV2'

import { getAliToken } from 'Global/action'
import * as urls from 'Global/urls'
import {
  channelChildList,
  deleteChannelChild,
  editChannelChild,
  cancelEnableChannelChild,
  enableChannelChild,
  addChannelResource,
} from '../reduck'
import { ChildChannelStatus } from '../../dict'
import { auditConfirm, auditDetails } from '../../reduck'
import { isEmpty } from 'Utils/lang'
import styles from '../style.less'
import { showepisodeListModal } from '../../component/episodeListModal'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
}

const uploadButton = (
  <div>
    <Icon type='plus' />
    <div className='ant-upload-text'>上传照片</div>
  </div>
)

class ChannelChild extends Component {

  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      logoImages: [],
      operaterPic: [],
      vedioSource: {},
      cateId: this.props.match.params.cateId
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getAliToken())
    dispatch(channelChildList({ parentCateId: this.state.cateId, currentPage: 1, pageSize: 10 }))
  }

  _handleDelete = (cateId) => {
    const { dispatch, filter, list, page } = this.props
    const length = list.length
    if (length > 1) {
      dispatch(deleteChannelChild({ cateId }, filter))
    } else if (length === 1) {
      dispatch(deleteChannelChild({ cateId }, { ...filter, currentPage: page.pageNo > 1 ? Number(page.currentPage) - 1 : 1 }))
    }
  }

  _handleConfirm = (categroy) => {
    const { dispatch, filter } = this.props
    dispatch(auditConfirm({ serviceId: categroy.cateId, status: 1, type: 9, snapShot: JSON.stringify(categroy) }, () => dispatch(channelChildList(filter))))
  }

  _handleEnable = (cateId, isEnable) => {
    const { dispatch, filter } = this.props
    !isEnable
     ? dispatch(cancelEnableChannelChild({ cateId }, filter))
     : dispatch(enableChannelChild({ cateId }, filter))
  }
  _sourceModalConfirm = (props) => {
    props.form.validateFields((err, values) => {
      if (!err) {
        const { filter, dispatch } = this.props
        const { vedioSource } = this.state
        dispatch(addChannelResource({
          cateId: props.data.cateId,
          episodeName: vedioSource.episodeCnName,
          episodeImgUrl: vedioSource.cover169Url || vedioSource.cover34Url || vedioSource.cover23Url,
          sort: values.sort,
          episodeId: vedioSource.episodeId,
        }, filter, props.onCancel))
      }
    })
  }

  _handleSuggestion = (cateId) => {
    const { dispatch } = this.props
    dispatch(auditDetails({ type: 4, serviceId: cateId })).then(res => {
      res.status === 'success' && showModalForm({
        title: '查看原因',
        fields: [
          {
            id: 'forbidReason',
            props: {
              label: '禁用原因:',
            },
            element: (
              <span>{res.suggestion}</span>
            )
          }
        ]
      })
    })
  }

  AddContent = props => {
    const { getFieldDecorator, setFieldsValue } = props.form
    const { onCancel, aliToken } = props
    return (
      <Form>
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
          })(
            <Input maxLength='4' placeholder='请输入排序' />
          )}
        </FormItem>
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
              maxLength='4'
              placeholder='请选择资源'
              onClick={() => showepisodeListModal({
                showHighlight: false,
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
        <FormItem
          {...formItemLayout}
          label='轮播位图'
        >
          {getFieldDecorator('operaterPic', {
            valuePropName: 'fileList',
            getValueFromEvent: this._normFile,
          })(
            <AliUpload
              listType='picture-card'
              onPreview={this._handlePreview}
              beforeUpload={this._beforeUpload}
              onChange={this._handleOperateChange}
              aliToken={aliToken}
              rootPath='tvOperate'
              accept='image/*'
              max={1}
            >
              {uploadButton}
            </AliUpload>
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

  _handleAddResource = (record) => {
    const { aliToken } = this.props
    const AddContent = Form.create()(this.AddContent)
    showModalWrapper((
      <AddContent
        data={record}
        aliToken={aliToken}
      />
    ), {
      title: '添加'
    })
  }

  _columns = [
    genPlanColumn('cateName', '分类名称'),
    genPlanColumn('logoUrl', 'logo', {
      render: (text) => {
        return text ? (<img alt='加载失败' style={{ width: 80, height: 80 }} src={text} />) : null
      }
    }),
    genPlanColumn('sort', '排序'),
    genPlanColumn('auditStatusName', '状态'),
    genPlanColumn('childCount', '资源数量', {
      render: (text, record) => {
        return text ? (<Link to={`${urls.OTT_CATGORY}/resource/${record.cateId}`}>{text}</Link>) : null
      }
    }),
    // genPlanColumn('isRecommended', '推荐', {
    //   render: text => {
    //     return text ? '是' : '否'
    //   }
    // }),
    genPlanColumn('createTime', '创建时间'),
    genPlanColumn('modifyTime', '更新时间'),
    genPlanColumn('operate', '操作', {
      render: (text, record) => {
        const editAndDelete = (
          <span>
            <a onClick={() => this._handleEdit(record)}>编辑</a>
            <Divider type='vertical' />
            <Popconfirm
              title='确定要删除该条数据吗？'
              onConfirm={() => this._handleDelete(record.cateId)}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        )
        switch (record.auditStatus + '') {
          case '0':
            return (
              <span>
                {editAndDelete}
                <Divider type='vertical' />
                <Popconfirm
                  placement='topRight'
                  title='确定要提交审核吗？'
                  onConfirm={() => this._handleConfirm(record)}
                >
                  <a>提交审核</a>
                </Popconfirm>
              </span>
            )
          case '1':
            return null
          case '2':
            return (
              <span>
                {editAndDelete}
                <Divider type='vertical' />
                <a onClick={() => this._handleSuggestion(record.cateId)}>查看原因</a>
              </span>
            )
          case '4':
            if (!record.isEnabled) {
              return (
                <span>
                  {editAndDelete}
                  <Divider type='vertical' />
                  <a onClick={() => this._handleEnable(record.cateId, true)}>启用</a>
                </span>
              )
            } else {
              return (
                <span>
                  <Popconfirm
                    placement='topRight'
                    title='确定要禁用吗？'
                    onConfirm={() => this._handleEnable(record.cateId, false)}
                  >
                    <a>禁用</a>
                  </Popconfirm>
                  <Divider type='vertical' />
                  <a onClick={() => this._handleAddResource(record)}>添加资源</a>
                </span>
              )
            }
          case '3':
            if (!record.isEnabled) {
              return (
                <span>
                  {editAndDelete}
                  <Divider type='vertical' />
                  <a onClick={() => this._handleEnable(record.cateId, true)}>启用</a>
                </span>
              )
            } else {
              return (
                <span>
                  <Popconfirm
                    placement='topRight'
                    title='确定要禁用吗？'
                    onConfirm={() => this._handleEnable(record.cateId, false)}
                  >
                    <a>禁用</a>
                  </Popconfirm>
                  <Divider type='vertical' />
                  <a onClick={() => this._handleAddResource(record)}>添加资源</a>
                </span>
              )
            }
          default:
            return null
        }
      }
    }),
  ]

  _handleSearch = searchData => {
    const { filter } = this.props
    const finalFilter = Object.assign(
      {},
      filter,
      searchData,
      {
        channelName: searchData.channelName && searchData.channelName.trim(),
        currentPage: 1
      })
    this.props.dispatch(channelChildList(finalFilter))
  }

  // 上传图片预览弹层
  _handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  // 上传前校验
  _beforeUpload = (file) => {
    const isFormat = ['image/jpg', 'image/jpeg', 'image/png'].includes(file.type)
    if (!isFormat) {
      message.error('图片格式不对!')
    }
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isLt10M) {
      message.error('上传的图片不能大于10M!')
    }
    return isFormat && isLt10M
  }

  // 上传图片预览弹层取消
  _previewCancel = () => this.setState({ previewVisible: false })

  // 上传详情图change事件
  _handleCoverChange = ({ fileList }) => {
    this.setState({ logoImages: fileList })
  }

  // 上传轮播图change事件
  _handleOperateChange = ({ fileList }) => {
    this.setState({ operaterPic: fileList })
  }

  _handleCoverRemove = (file) => {
    this.setState({ logoImages: [] })
  }

  _modalConfirm = (data, props) => {
    const { dispatch, filter } = this.props
    props.form.validateFields((err, values) => {
      if (!err) {
        const { logoImages } = this.state
        const requestBean = {
          cateId: data.cateId,
          cateName: values.cateName,
          sort: values.sort,
          logoUrl: logoImages && !isEmpty(logoImages) ? logoImages[0].url : '',
        }
        dispatch(editChannelChild(requestBean, () => {
          dispatch(channelChildList(filter))
          props.onCancel()
          this.setState({
            logoImages: []
          })
        }))
      }
    })
  }

  _normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  ModalContent = (props) => {
    const { data, aliToken, onCancel } = props
    const { logoImages } = this.state
    const { getFieldDecorator } = props.form
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label='频道名称'
        >
          {getFieldDecorator('cateName', {
            rules: [{
              required: true,
              message: '请输入频道名称!'
            }],
            initialValue: data && data.cateName ? data.cateName : undefined,
          })(
            <Input maxLength='50' placeholder='请输入频道名称' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='序号'
        >
          {getFieldDecorator('sort', {
            rules: [{
              required: true,
              message: '请输入序号!'
            }, {
              pattern: /^[1-9]\d*$/,
              message: '只能输入1-9999的整数',
            }],
            initialValue: data && data.sort ? data.sort : undefined,
          })(
            <Input maxLength='4' placeholder='请输入序号' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='logo'
        >
          {getFieldDecorator('logoUrl', {
            rules: [{
              required: true,
              message: '请选择logo!'
            }],
            valuePropName: 'fileList',
            getValueFromEvent: this._normFile,
            initialValue: logoImages
          })(
            <AliUpload
              listType='picture-card'
              onPreview={this._handlePreview}
              beforeUpload={this._beforeUpload}
              onChange={this._handleCoverChange}
              // onRemove={this._handleCoverRemove}
              aliToken={aliToken}
              rootPath='tvOperate'
              // fileList={logoImages}
              accept='image/*'
              max={1}
            >
              {uploadButton}
            </AliUpload>
          )}
        </FormItem>
        <FormItem className={styles['jc-modal-form-footer']}>
          <Button
            key='cancel'
            onClick={() => {
              onCancel()
              this.setState({
                logoImages: []
              })
            }}
          >取消
          </Button>
          <Button
            key='confirm'
            type='primary'
            onClick={() => this._modalConfirm(data, props)}
          >确定
          </Button>
        </FormItem>
      </Form>
    )
  }

  _handleEdit = (data) => {
    this.setState({
      logoImages: [{ uid: 0, url: data.logoUrl }]
    }, () => {
      this._handleAdd(data)
    })
  }

  _handleAdd = (data) => {
    const { aliToken } = this.props
    // const { logoImages } = this.state
    if (isEmpty(aliToken) || !aliToken) {
      message.error('图片上传功能加载失败，请刷新页面！')
      return
    }
    const ModalContent = Form.create()(this.ModalContent)
    showModalWrapper((
      <ModalContent
        aliToken={aliToken}
        data={data}
      />
    ), {
      title: '修改子频道',
      closable: false
    })
  }

  _genFilterFields = (filter) => {
    // const {  } = this.props
    const fields = [
      {
        key: 'channelName',
        label: '频道名称',
        initialValue: filter['channelName'],
        type: 'Input',
      },
      {
        key: 'channelStatus',
        label: '频道状态',
        initialValue: filter['channelStatus'] || '',
        type: 'Select',
        content: ChildChannelStatus
      }
    ]

    return fields
  }

  render() {
    const { previewVisible, previewImage } = this.state
    const { showListSpin, list, filter, page } = this.props
    const fields = this._genFilterFields(filter)
    const pagination = genPagination(page)

    return (
      <div>
        <Filter
          fields={fields}
          onSearch={this._handleSearch}
        />
        <Table
          pagination={pagination}
          columns={this._columns}
          rowKey='cateId'
          dataSource={list}
          loading={showListSpin}
        />
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this._previewCancel}
        >
          <img
            alt='example'
            style={{ width: '100%' }}
            src={previewImage}
          />
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,

    list: state.oTTResource.oTTCategory.channelChildList,
    filter: state.oTTResource.oTTCategory.channelChildFilter,
    page: state.oTTResource.oTTCategory.channelChildPage,
    aliToken: state.common.aliToken,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(ChannelChild)
