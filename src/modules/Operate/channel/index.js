import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table, Button, Icon, Input, message, Divider, Popconfirm, Form, Modal } from 'antd'

import { genPlanColumn, genPagination } from 'Utils/helper'
import Filter from 'Components/Filter'
import { showModalWrapper } from 'Components/modal/ModalWrapper'
import { showModalForm } from 'Components/modal/ModalForm'
import AliUpload from 'Components/upload/aliUploadV2'

import { getAliToken } from 'Global/action'
import {
  channelList,
  deleteChannel,
  addChannel,
  editChannel,
  addChildChannel,
  enableChannel,
} from './reduck'
import { ChannelAuditStatus } from '../dict'
import styles from './style.less'
import { auditConfirm, auditDetails } from '../reduck'
import { isEmpty } from 'Utils/lang'
import * as urls from 'Global/urls'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

const uploadButton = (
  <div>
    <Icon type='plus' />
    <div className='ant-upload-text'>上传照片</div>
  </div>
)

class Channel extends Component {

  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      logoImages: []
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getAliToken())
    dispatch(channelList({ pageSize: 10, currentPage: 1 }))
  }

  _handleDelete = (cateId) => {
    const { dispatch, filter, list, page } = this.props
    const length = list.length
    if (length > 1) {
      dispatch(deleteChannel({ cateId }, filter))
    } else if (length === 1) {
      dispatch(deleteChannel({ cateId }, { ...filter, currentPage: page.pageNo > 1 ? Number(page.currentPage) - 1 : 1 }))
    }
  }

  _handleConfirm = (item) => {
    const { dispatch, filter } = this.props
    dispatch(auditConfirm({ serviceId: item.cateId, status: 1, type: 3, snapShot: JSON.stringify(item) }, () => dispatch(channelList(filter))))
  }

  _handleEnable = (cateId, isEnabled) => {
    const { dispatch, filter } = this.props
    dispatch(enableChannel({ cateId, isEnabled }, filter))
  }

  _handleSuggestion = (cateId) => {
    const { dispatch } = this.props
    dispatch(auditDetails({ type: 3, serviceId: cateId })).then(res => {
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

  _columns = [
    genPlanColumn('cateName', '频道名称'),
    genPlanColumn('logoUrl', 'logo', {
      render: (text) => {
        return text ? (<img alt='加载失败' style={{ width: 80, height: 80 }} src={text} />) : null
      }
    }),
    genPlanColumn('sort', '排序'),
    genPlanColumn('auditStatusName', '状态'),
    genPlanColumn('childCount', '子频道', {
      render: (text, record) => {
        return text ? (<Link to={`${urls.OPERATE_CHANNEL_LIST}/${record.cateId}`}>{text}</Link>) : null
      }
    }),
    genPlanColumn('createTime', '创建时间'),
    genPlanColumn('modifyTime', '更新时间'),
    genPlanColumn('operate', '操作', {
      render: (text, record) => {
        const editAndDelete = (
          <span>
            <a onClick={() => this._handleEdit(false, record)}>编辑</a>
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
          case '3':
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
                <a onClick={() => this._handleAdd(true, record.cateId)}>添加子频道</a>
              </span>
            )
          case '4':
            return (
              <span>
                {editAndDelete}
                <Divider type='vertical' />
                <Popconfirm
                  placement='topRight'
                  title='确定要启用吗？'
                  onConfirm={() => this._handleEnable(record.cateId, true)}
                >
                  <a>启用</a>
                </Popconfirm>
              </span>
            )
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
        currentPage: 1,
        cateName: searchData.cateName && searchData.cateName.trim()
      })
    this.props.dispatch(channelList(finalFilter))
  }

  _handleChange = (pagination, filters, sorter) => {
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(channelList(finalFilter))
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
      return false
    }
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isLt10M) {
      message.error('上传的图片不能大于10M!')
      return false
    }
    return true
  }

  // 上传图片预览弹层取消
  _previewCancel = () => this.setState({ previewVisible: false })

  // 上传详情图change事件
  _handleCoverChange = ({ fileList }) => {
    this.setState({ logoImages: fileList })
  }

  _handleCoverRemove = (file) => {
    this.setState({ logoImages: [] })
  }

  _modalConfirm = (data, addChild, props) => {
    const { dispatch, filter } = this.props
    props.form.validateFields((err, values) => {
      if (!err) {
        let requestFn = addChannel
        const { logoImages } = this.state
        const requestBean = {
          cateName: values.cateName,
          sort: values.sort,
          logoUrl: logoImages && !isEmpty(logoImages) ? logoImages[0].url : '',
        }
        if (addChild) {
          requestFn = addChildChannel
          delete requestBean.cateName
          requestBean.channelName = values.cateName
          requestBean.cateId = data
        } else if (data) {
          requestFn = editChannel
          requestBean.cateId = data.cateId
        }
        dispatch(requestFn(requestBean, () => {
          dispatch(channelList(filter))
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
    const { data, aliToken, onCancel, addChild } = props
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
            // fileList: logoImages,
            initialValue: props.data ? logoImages : undefined,
            valuePropName: 'fileList',
            getValueFromEvent: this._normFile
          })(
            <AliUpload
              listType='picture-card'
              onPreview={this._handlePreview}
              beforeUpload={this._beforeUpload}
              onChange={this._handleCoverChange}
              onRemove={this._handleCoverRemove}
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
            onClick={() => this._modalConfirm(data, addChild, props)}
          >确定
          </Button>
        </FormItem>
      </Form>
    )
  }

  _handleEdit = (addChild, data) => {
    this.setState({
      logoImages: [{ uid: 0, url: data.logoUrl }]
    }, () => {
      this._handleAdd(addChild, data)
    })
  }

  _handleAdd = (addChild, data) => {
    const { aliToken } = this.props
    // const { logoImages } = this.state
    if (isEmpty(aliToken) || !aliToken) {
      message.error('图片上传功能加载失败，请刷新页面！')
      return
    }
    const ModalContent = Form.create()(this.ModalContent)
    if (data && !addChild) {
      this.setState({
        logoImages: [{ uid: 1, url: data.logoUrl }]
      }, () => {
        showModalWrapper((
          <ModalContent
            aliToken={aliToken}
            data={data}
            addChild={addChild}
          />
        ), {
          title: data ? '修改频道' : (addChild ? '添加子频道' : '添加频道'),
          closable: false
        })
      })
    } else {
      showModalWrapper((
        <ModalContent
          aliToken={aliToken}
          data={data}
          addChild={addChild}
        />
      ), {
        title: data ? '修改频道' : (addChild ? '添加子频道' : '添加频道'),
        closable: false
      })
    }
  }

  _genFilterFields = (filter) => {
    // const {  } = this.props
    const fields = [
      {
        key: 'cateName',
        label: '频道名称',
        initialValue: filter['cateName'],
        type: 'Input',
      },
      {
        key: 'auditStatus',
        label: '频道状态',
        initialValue: filter['auditStatus'] || '',
        type: 'Select',
        content: ChannelAuditStatus
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
          extraBtns={[
            <Button key='add' type='primary' onClick={() => this._handleAdd()}>新增</Button>
          ]}
        />
        <Table
          pagination={pagination}
          columns={this._columns}
          onChange={this._handleChange}
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

    list: state.operate.channel.channelList,
    filter: state.operate.channel.channelFilter,
    page: state.operate.channel.channelPage,
    aliToken: state.common.aliToken,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Channel)
