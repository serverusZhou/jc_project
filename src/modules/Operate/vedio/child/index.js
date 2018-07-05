import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table, Icon, Input, message, Divider, Popconfirm, Form, Button, Modal, Select } from 'antd'

import { genPlanColumn, genPagination } from 'Utils/helper'
import Filter from 'Components/Filter'
import { showModalWrapper } from 'Components/modal/ModalWrapper'
import { showModalForm } from 'Components/modal/ModalForm'
import AliUpload from 'Components/upload/aliUploadV2'

import { getAliToken } from 'Global/action'
import * as urls from 'Global/urls'
import {
  vedioCateList,
  deleteVedioCate,
  editVedioCate,
  // setRecommended,
  // cancelRecommended,
  enabledVedioCate,
  addResource,
  getTagsList
} from '../reduck'
import { ChannelAuditStatus } from '../../dict'
import { auditConfirm, auditDetails } from '../../reduck'
import { isEmpty } from 'Utils/lang'
import styles from '../style.less'
import { showepisodeListModal } from '../../component/episodeListModal'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 }
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
      cateId: this.props.match.params.cateId,
      vedioSource: {}
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getAliToken())
    dispatch(vedioCateList({ parentCateId: this.state.cateId, currentPage: 1, pageSize: 10 }))
  }

  _handleDelete = (cateId) => {
    const { dispatch, filter, list, page } = this.props
    const length = list.length
    if (length > 1) {
      dispatch(deleteVedioCate({ cateId }, filter))
    } else if (length === 1) {
      dispatch(deleteVedioCate({ cateId }, { ...filter, currentPage: page.pageNo > 1 ? Number(page.currentPage) - 1 : 1 }))
    }
  }

  _handleConfirm = (item) => {
    const { dispatch, filter } = this.props
    dispatch(auditConfirm({ serviceId: item.cateId, status: 1, type: 5, snapShot: JSON.stringify(item) }, () => dispatch(vedioCateList(filter))))
  }

  _handleEnable = (cateId, isEnabled) => {
    const { dispatch, filter } = this.props
    dispatch(enabledVedioCate({ cateId, isEnabled }, filter))
  }

  _handleRecommend = (cateId, isRecommend) => {
    // const { dispatch, filter } = this.props
    // isRecommend ? dispatch(setRecommended({ cateId }, filter)) : dispatch(cancelRecommended({ cateId }, filter))
  }

  _handleSuggestion = (cateId) => {
    const { dispatch } = this.props
    dispatch(auditDetails({ type: 5, serviceId: cateId })).then(res => {
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

  _sourceModalConfirm = (props) => {
    props.form.validateFields((err, values) => {
      if (!err) {
        const { filter, dispatch } = this.props
        const { vedioSource } = this.state
        dispatch(addResource({
          cateId: props.data.cateId,
          episodeName: vedioSource.episodeCnName,
          episodeImgUrl: vedioSource.cover169Url || vedioSource.cover34Url || vedioSource.cover23Url,
          sort: values.sort,
          episodeId: vedioSource.episodeId,
          tagIdList: values.tagIdList
        }, filter, props.onCancel))
      }
    })
  }

  AddContent = props => {
    const { getFieldDecorator, setFieldsValue } = props.form
    const { onCancel, tags } = props
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
                onSelect: (data) => {
                  this.setState({ vedioSource: data })
                  setFieldsValue({ episodeCnName: data.episodeCnName })
                },
                noShowChild: true
              }, {
                title: '选择',
                width: 800
              })}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='标签'
        >
          {getFieldDecorator('tagIdList', {
            rules: [{
              required: false,
            }],
          })(
            <Select
              mode='multiple'
              placeholder='请选择标签'
            >
              {
                tags && tags.map(item => (
                  <Option value={item.cateId} key={item.cateId}>{item.cateName}</Option>
                ))
              }
            </Select>
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
    const AddContent = Form.create()(this.AddContent)
    const { dispatch } = this.props
    dispatch(getTagsList({ parentCateId: this.state.cateId })).then(res => {
      showModalWrapper((
        <AddContent data={record} tags={res} />
      ), {
        title: '添加',
      })
    })
  }

  _columns = [
    genPlanColumn('cateName', '子分类名称'),
    genPlanColumn('logoUrl', 'logo', {
      render: (text) => {
        return text ? (<img alt='加载失败' style={{ width: 80, height: 80 }} src={text} />) : null
      }
    }),
    genPlanColumn('sort', '排序'),
    genPlanColumn('auditStatusName', '状态'),
    genPlanColumn('childCount', '资源数量', {
      render: (text, record) => {
        return text ? (<Link to={urls.OPERATE_VEDIO_RESOURCE + '/' + record.cateId}>{text}</Link>) : null
      }
    }),
    genPlanColumn('isRecommended', '推荐', {
      render: text => {
        return text ? '是' : '否'
      }
    }),
    genPlanColumn('createTime', '创建时间'),
    genPlanColumn('modifyTime', '更新时间'),
    genPlanColumn('operate', '操作', {
      render: (text, record) => {
        const editAndDelete = (
          <span>
            <a onClick={() => this._handleEdit(record)}>编辑</a>
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
                {/* <Popconfirm
                  title={`确定要${record.isRecommended ? '取消推荐' : '推荐'}吗？`}
                  onConfirm={() => this._handleRecommend(record.cateId, !record.isRecommended)}
                >
                  <a>{record.isRecommended ? '取消推荐' : '推荐'}</a>
                </Popconfirm>
                <Divider type='vertical' /> */}
                <a onClick={() => this._handleAddResource(record)}>添加资源</a>
              </span>
            )
          case '4':
            return (
              <span>
                {editAndDelete}
                <Divider type='vertical' />
                <Popconfirm
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
        cateName: searchData.cateName && searchData.cateName.trim()
      })
    this.props.dispatch(vedioCateList(finalFilter))
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
        dispatch(editVedioCate(requestBean, () => {
          dispatch(vedioCateList(filter))
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
          label='子分类名称'
        >
          {getFieldDecorator('cateName', {
            rules: [{
              required: true,
              message: '请输入子分类名称!'
            }],
            initialValue: data && data.cateName ? data.cateName : undefined,
          })(
            <Input maxLength='50' placeholder='请输入子分类名称' />
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
            initialValue: logoImages,
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
    this.setState({
      logoImages: [{ uid: 1, url: data.logoUrl }]
    }, () => {
      showModalWrapper((
        <ModalContent
          aliToken={aliToken}
          data={data}
        />
      ), {
        title: '修改子分类',
        closable: false
      })
    })
  }

  _genFilterFields = (filter) => {
    // const {  } = this.props
    const fields = [
      {
        key: 'cateName',
        label: '子分类名称',
        initialValue: filter['cateName'],
        type: 'Input',
      },
      {
        key: 'auditStatus',
        label: '子分类状态',
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

    list: state.operate.vedio.vedioCateList,
    filter: state.operate.vedio.vedioCateFilter,
    page: state.operate.vedio.vedioCatePage,
    aliToken: state.common.aliToken,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(ChannelChild)
