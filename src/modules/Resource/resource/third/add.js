import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Button, Form, Row, Col, Input, Select, DatePicker, Icon, Modal, Popover, message, Card } from 'antd'
import {
  addMedia,
  getMediaDetail,
  resetMediaDetail,
  getCategoryList,
} from './reduck'
import { getAliToken } from 'Global/action'
import styles from './styles.less'
import apis from '../../apis'
import * as urls from 'Global/urls'
import { isEmpty, trim } from 'Utils/lang'
import { fetchResource as fetchData } from 'Utils/fetch'
import ModalSelectInput from 'Components/modal/ModalSelectInput'
import OrderUpload from 'Components/upload/aliUpload'
import VedioAdd from './addVedio'

const SelectOption = Select.Option
const FormItem = Form.Item
const TextArea = Input.TextArea
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}
const uploadButton = (type) => {
  const tip = {
    'cover23Url': '图片比例- 2:3',
    'cover34Url': '图片比例- 3:4',
    'cover169Url': '图片比例- 16:9',
  }
  return (
    <div>
      <Icon type='plus' />
      <div className='ant-upload-text' style={{ marginTop: '-15px' }}>{tip[type]}</div>
    </div>
  )
}

class MediaAdd extends Component {

  constructor(props) {
    super(props)
    this.state = {
      hasInit: false,
      info: {},
      cates1: [],
      cates2: [],
      cates3: [],
      mediaList: [],
      highlightList: [],
      subCateIdList: [],
      previewVisible: false,
      previewImage: '',
      cover23Url: [],
      cover34Url: [],
      cover169Url: [],
      showMediaModal: false,
      media: {},
      mediaType: '',
      delMediaIds: [],
      delHighlightIds: [],
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetMediaDetail())
  }

  componentWillMount() {
    const { dispatch, match } = this.props
    this._getCates({ cateParentId: 1 })
    this._getCates({ cateParentId: 2 })
    this._getCates({ cateParentId: 3 })
    dispatch(getAliToken())
    if (match.params && match.params.episodeId) {
      dispatch(getMediaDetail({ episodeId: match.params.episodeId }))
    }
  }

  componentWillReceiveProps(nextProps) {
    const { match } = this.props
    const { info } = nextProps
    const { hasInit } = this.state
    if (match.params && match.params.episodeId) {
      if (!hasInit && !isEmpty(info)) {
        this._getSubCateIdList(info.parentCateId)
        this.setState({
          hasInit: true,
          info,
          subCateIdList: info.subCateIdList,
          highlightList: info.highlightList,
          mediaList: info.mediaList,
          cover23Url: info.cover23Url ? [{ url: info.cover23Url, uid: 'cover23Url' }] : [],
          cover34Url: info.cover34Url ? [{ url: info.cover34Url, uid: 'cover34Url' }] : [],
          cover169Url: info.cover169Url ? [{ url: info.cover169Url, uid: 'cover169Url' }] : [],
        })
      }
    }
  }
  // 提交处理
  _handleSubmit = (e, auditFlag) => {
    e.preventDefault()
    const { mediaList, highlightList, cover23Url, cover34Url, cover169Url } = this.state
    const { dispatch, form, history, match } = this.props
    const isEdit = !isEmpty(match.params) && match.params.episodeId !== ''
    let hasError = false
    form.validateFields((err, values) => {
      if (!err) {
        // 剧集必填
        if (mediaList.length === 0 && highlightList.length === 0) {
          message.error('请添加剧集！')
          hasError = true
        }
        // 海报必填
        if (cover23Url.length === 0 || cover34Url.length === 0 || cover169Url.length === 0) {
          message.error('请上传海报！')
          hasError = true
        }
        // 版权截止时间
        if (new Date().valueOf() > new Date(values.copyrightEnd).valueOf()) {
          message.error('版权结束时间早于当前时间！')
          hasError = true
        }

        if (hasError) {
          return
        }
        dispatch(addMedia({
          ...this._getUserArg(values, auditFlag)
        }, isEdit)).then((res) => {
          if (res.status === 'success') {
            dispatch(resetMediaDetail())
            history.push(urls.RESOURCE_MEDIA_THIRD)
          }
        })
      }
    })
  }

  // 获取表单提交数据
  _getUserArg = (values, auditFlag) => {
    const { mediaList, highlightList, cover23Url, cover34Url, cover169Url, delMediaIds, delHighlightIds } = this.state
    const { match } = this.props
    return {
      episodeId: isEmpty(match.params) ? '' : match.params.episodeId,
      auditFlag,
      mediaList,
      highlightList,
      cover23Url: isEmpty(cover23Url) ? [].join(',') : cover23Url.map(image => image.url).join(','),
      cover34Url: isEmpty(cover34Url) ? [].join(',') : cover34Url.map(image => image.url).join(','),
      cover169Url: isEmpty(cover169Url) ? [].join(',') : cover169Url.map(image => image.url).join(','),
      parentCateId: values.parentCateId,
      subCateIdList: values.subCateIdList,
      episodeCnName: trim(values.episodeCnName),
      episodeUsName: trim(values.episodeUsName),
      directorIdList: isEmpty(values.directorIdList) ? [] : values.directorIdList.map(actor => actor.actorId),
      writerIdList: isEmpty(values.writerIdList) ? [] : values.writerIdList.map(actor => actor.actorId),
      actorIdList: isEmpty(values.actorIdList) ? [] : values.actorIdList.map(actor => actor.actorId),
      recordNumber: trim(values.recordNumber),
      firstShowTime: values.firstShowTime ? moment(values.firstShowTime).format('YYYY-MM-DD HH:mm:ss') : '',
      firstShowPlat: trim(values.firstShowPlat),
      duration: values.duration,
      language: values.language,
      area: values.area,
      years: values.years,
      info: trim(values.info),
      keyword: trim(values.keyword),
      copyrightBegin: moment(values.copyrightBegin).format('YYYY-MM-DD HH:mm:ss'),
      copyrightEnd: moment(values.copyrightEnd).format('YYYY-MM-DD HH:mm:ss'),
      startTime: values.startTime,
      endTime: values.endTime,
      count: values.count,
      producedDate: values.producedDate ? moment(values.producedDate).format('YYYY-MM-DD HH:mm:ss') : '',
      contentType: values.contentType,
      delMediaIds,
      delHighlightIds,
    }
  }

  // 提取演员、编剧、导演弹层列
  _actorsColumns = [
    {
      key: 'name',
      title: '演员姓名',
      dataIndex: 'name',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'foreignName',
      title: '外文名',
      dataIndex: 'foreignName',
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'aliasName',
      title: '别名',
      dataIndex: 'aliasName',
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'country',
      title: '国籍',
      dataIndex: 'country',
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
  ]

  // 获取导演、编剧、主演
  _getActorParams = (type) => {
    const title = {
      directorIdList: '选择导演',
      writerIdList: '选择编剧',
      actorIdList: '选择演员'
    }

    const types = {
      actorIdList: '1',
      directorIdList: '2',
      writerIdList: '3',

    }
    const { form } = this.props
    return {
      modalParam: {
        title: title[type]
      },
      rowKey: 'actorId',
      selectType: 'checkbox',
      listFieldName: 'data',
      fetch: fetchData,
      url: apis.actor.selectList,
      instantSelected: false,
      showSelectedTagFlag: true,
      selectedTagFieldName: 'name',
      selectedList: form.getFieldValue(type),
      columns: this._actorsColumns,
      extraParams: {
        typeList: [types[type]]
      },
      filter: [{
        id: 'name',
        element: (
          <Input
            placeholder='请输入姓名'
          />
        )
      }]
    }
  }

  // 确认后选中效果
  _handleActorSelect = (selectedRows, type) => {
    const { form } = this.props
    if (!isEmpty(selectedRows)) {
      this.setState({ [type]: selectedRows })
      form.setFieldsValue({ [type]: selectedRows })
    }
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

  // 上传图片预览弹层
  _handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  // 上传海报change事件
  _handleCoverChange = ({ fileList }, type) => {
    const coverImages = fileList.map((file, index) => {
      file.sort = index
      return file
    })
    this.setState({ [type]: coverImages })
  }

  // 海报remove事件
  _handleCoverRemove = (file, type) => {
    const { cover23Url, cover34Url, cover169Url } = this.state
    const data = {
      cover23Url,
      cover34Url,
      cover169Url
    }
    const index = data[type].indexOf(file)
    data[type].splice(index, 1)
    this.setState({ [type]: data[type] })
  }

  // 出品时间
  _disabledProducedDate = (startValue) => {
    const { form } = this.props
    let endValue = form.getFieldValue('firstShowTime')
    if (!endValue || !startValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }

  // 首播时间
  _disabledFirstShowTime = (endValue) => {
    const { form } = this.props
    let startValue = form.getFieldValue('producedDate')
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }

  // 版权开始
  _disabledCopyRightStart = (startValue) => {
    const { form } = this.props
    let endValue = form.getFieldValue('copyrightEnd')
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }

  // 版权结束
  _disabledCopyRightEnd = (endValue) => {
    const { form } = this.props
    let startValue = form.getFieldValue('copyrightBegin')
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }

  /**
   * 后期产品字段模板,表单页面抽离一个单独的函数
   */
  _generateForm = () => {
    const { form, aliToken } = this.props
    const { cates2, cates3, previewVisible, previewImage, info, cover169Url, cover23Url, cover34Url } = this.state
    const { getFieldDecorator } = form
    const episodeAttr = isEmpty(info) ? {} : info.episodeAttr
    return (
      <div>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='所属年代'
          >
            {getFieldDecorator('years', {
              initialValue: isEmpty(episodeAttr) ? undefined : episodeAttr.years,
              rules: [{
                required: true,
                message: '请选择所属年代!'
              }]
            })(
              <Select
                allowClear={true}
                placeholder='请选择所属年代'
                getPopupContainer={() => document.getElementById('mediaArea')}
              >
                {
                  !isEmpty(cates2) && cates2.map((cate) => {
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
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='所属地区'
          >
            {getFieldDecorator('area', {
              initialValue: isEmpty(episodeAttr) ? undefined : episodeAttr.area,
              rules: [{
                required: true,
                message: '请选择所属地区!'
              }]
            })(
              <Select
                allowClear={true}
                placeholder='请选择所属地区'
                getPopupContainer={() => document.getElementById('mediaArea')}
              >
                {
                  !isEmpty(cates3) && cates3.map((cate) => {
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
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='资产类型'
          >
            {getFieldDecorator('contentType', {
              initialValue: isEmpty(episodeAttr) ? undefined : episodeAttr.contentType,
              rules: [{
                required: true,
                message: '请选择资产类型!'
              }]
            })(
              <Select
                allowClear={true}
                placeholder='请选择资产类型'
                getPopupContainer={() => document.getElementById('mediaArea')}
              >
                <SelectOption key='News' value='News'>新闻</SelectOption>
                <SelectOption key='Movie' value='Movie'>电影</SelectOption>
                <SelectOption key='Column' value='Column'>栏目</SelectOption>
                <SelectOption key='Series' value='Series'>系列剧</SelectOption>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='中文名称'
          >
            {getFieldDecorator('episodeCnName', {
              initialValue: isEmpty(episodeAttr) ? undefined : episodeAttr.episodeCnName,
              rules: [{
                required: true,
                message: '请输入中文名称!'
              }]
            })(
              <Input
                placeholder='请输入中文名称'
                maxLength='50'
              />
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='英文名称'
          >
            {getFieldDecorator('episodeUsName', {
              initialValue: isEmpty(episodeAttr) ? undefined : episodeAttr.episodeUsName
            })(
              <Input
                placeholder='请输入英文名称'
                maxLength='50'
              />
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='导演'
          >
            {getFieldDecorator('directorIdList', {
              initialValue: isEmpty(info) ? [] : info.directorList,
              rules: [{
                required: true,
                message: '请选择导演!'
              }]
            })(
              <ModalSelectInput
                displayName='name'
                inputParams= {{
                  placeholder: '请选择导演'
                }}
                params = {() => { return this._getActorParams('directorIdList') }}
                onSelect = {(selectedRows) => { this._handleActorSelect(selectedRows, 'directorIdList') }}
              />
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='编剧'
          >
            {getFieldDecorator('writerIdList', {
              initialValue: isEmpty(info) ? [] : info.writerList,
              rules: [{
                required: true,
                message: '请选择编剧!'
              }]
            })(
              <ModalSelectInput
                displayName='name'
                inputParams= {{
                  placeholder: '请选择编剧'
                }}
                params = {() => { return this._getActorParams('writerIdList') }}
                onSelect = {(selectedRows) => { this._handleActorSelect(selectedRows, 'writerIdList') }}
              />
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='主演'
          >
            {getFieldDecorator('actorIdList', {
              initialValue: isEmpty(info) ? [] : info.actorList,
              rules: [{
                required: true,
                message: '请选择主演!'
              }]
            })(
              <ModalSelectInput
                displayName='name'
                inputParams= {{
                  placeholder: '请选择主演'
                }}
                params = {() => { return this._getActorParams('actorIdList') }}
                onSelect = {(selectedRows) => { this._handleActorSelect(selectedRows, 'actorIdList') }}
              />
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='许可证号'
          >
            {getFieldDecorator('recordNumber', {
              initialValue: isEmpty(episodeAttr) ? undefined : episodeAttr.recordNumber
            })(
              <Input
                placeholder='请输入许可证号'
                maxLength='50'
              />
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='出品时间'
          >
            {getFieldDecorator('producedDate', {
              initialValue: isEmpty(episodeAttr) ? undefined : (episodeAttr.producedDate && moment(episodeAttr.producedDate))
            })(
              <DatePicker
                disabledDate={this._disabledProducedDate}
                placeholder='请选择出品时间'
              />
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='首播时间'
          >
            {getFieldDecorator('firstShowTime', {
              initialValue: isEmpty(episodeAttr) ? undefined : (episodeAttr.firstShowTime && moment(episodeAttr.firstShowTime))
            })(
              <DatePicker
                disabledDate={this._disabledFirstShowTime}
                placeholder='请选择首播时间'
              />
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='首播平台'
          >
            {getFieldDecorator('firstShowPlat', {
              initialValue: isEmpty(episodeAttr) ? undefined : episodeAttr.firstShowPlat
            })(
              <Input
                placeholder='请输入首播平台'
                maxLength='50'
              />
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='集数'
          >
            {getFieldDecorator('count', {
              initialValue: isEmpty(info) ? undefined : info.count,
              rules: [{
                required: true,
                message: '请输入集数!'
              }, {
                pattern: /^[0-9]*$/,
                message: '请输入整数！',
              }]
            })(
              <Input
                placeholder='请输入集数'
                maxLength='50'
              />
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='片头时间'
          >
            {getFieldDecorator('startTime', {
              initialValue: isEmpty(episodeAttr) ? undefined : episodeAttr.startTime,
              rules: [{
                required: true,
                message: '请输入片头时间!'
              }, {
                pattern: /^[0-9]*$/,
                message: '请输入整数！',
              }]
            })(
              <Input
                placeholder='请输入片头时间'
                maxLength='50'
                addonAfter='秒'
              />
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='片尾时间'
          >
            {getFieldDecorator('endTime', {
              initialValue: isEmpty(episodeAttr) ? undefined : episodeAttr.endTime,
              rules: [{
                required: true,
                message: '请输入片尾时间!'
              }, {
                pattern: /^[0-9]*$/,
                message: '请输入整数！',
              }]
            })(
              <Input
                placeholder='请输入片尾时间'
                maxLength='50'
                addonAfter='秒'
              />
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='时长'
          >
            {getFieldDecorator('duration', {
              initialValue: isEmpty(episodeAttr) ? undefined : episodeAttr.duration,
              rules: [{
                required: true,
                message: '请输入时长!'
              }, {
                pattern: /^[0-9]*$/,
                message: '请输入整数！',
              }]
            })(
              <Input
                placeholder='请输入时长'
                maxLength='50'
                addonAfter='分钟'
              />
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='语言'
          >
            {getFieldDecorator('language', {
              initialValue: isEmpty(episodeAttr) ? undefined : episodeAttr.language,
              rules: [{
                required: true,
                message: '请输入语言!'
              }]
            })(
              <Input
                placeholder='请输入语言'
                maxLength='50'
              />
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='关键字'
          >
            {getFieldDecorator('keyword', {
              initialValue: isEmpty(info) ? undefined : info.keyword,
              rules: [{
                required: true,
                message: '请输入关键字!'
              }]
            })(
              <Input
                placeholder='请输入关键字'
                maxLength='50'
              />
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='版权开始时间'
          >
            {getFieldDecorator('copyrightBegin', {
              initialValue: isEmpty(episodeAttr) ? undefined : (episodeAttr.copyrightBegin && moment(episodeAttr.copyrightBegin)),
              rules: [{
                required: true,
                message: '请选择版权开始时间!'
              }]
            })(
              <DatePicker
                disabledDate={this._disabledCopyRightStart}
                placeholder='请选择版权开始时间'
              />
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='版权结束时间'
          >
            {getFieldDecorator('copyrightEnd', {
              initialValue: isEmpty(episodeAttr) ? undefined : (episodeAttr.copyrightEnd && moment(episodeAttr.copyrightEnd)),
              rules: [{
                required: true,
                message: '请选择版权结束时间!'
              }]
            })(
              <DatePicker
                disabledDate={this._disabledCopyRightEnd}
                placeholder='请选择版权结束时间'
              />
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='介绍'
          >
            {getFieldDecorator('info', {
              initialValue: isEmpty(episodeAttr) ? undefined : episodeAttr.info,
              rules: [{
                required: true,
                message: '请输入介绍!'
              }]
            })(
              <TextArea
                placeholder='请输入介绍'
                maxLength='500'
              />
            )}
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label={<span className='ant-form-item-required'>剧集</span>}
          >
            <div>
              {this._generatePopByMediaType('1')}
              {this._generatePopByMediaType('2')}
              {
                !info.episodeId &&
                <a href='javascript:;' onClick={() => { this._addMedia() }}>添加</a>
              }
            </div>
          </FormItem>
        </Col>
        <Col span={24} >
          <FormItem
            {...formItemLayout}
            label='海报'
          >
            {getFieldDecorator('cover34Url', {
              initialValue: !isEmpty(info) ? info.cover34Url : undefined,
              rules: [{
                required: true,
                message: '请上传海报!'
              }]
            })(
              <div>
                <div>
                  <OrderUpload
                    listType='picture-card'
                    onPreview={this._handlePreview}
                    beforeUpload={this._beforeUpload}
                    onChange={(data) => { this._handleCoverChange(data, 'cover23Url') }}
                    onRemove={(data) => { this._handleCoverRemove(data, 'cover23Url') }}
                    aliToken={aliToken}
                    rootPath='media'
                    fileList={cover23Url}
                    accept='image/jpg, image/jpeg, image/png'
                  >
                    {cover23Url.length >= 1 ? null : uploadButton('cover23Url')}
                  </OrderUpload>
                </div>
                <div>
                  <OrderUpload
                    listType='picture-card'
                    onPreview={this._handlePreview}
                    beforeUpload={this._beforeUpload}
                    onChange={(data) => { this._handleCoverChange(data, 'cover34Url') }}
                    onRemove={(data) => { this._handleCoverRemove(data, 'cover34Url') }}
                    aliToken={aliToken}
                    rootPath='media'
                    fileList={cover34Url}
                    accept='image/jpg, image/jpeg, image/png'
                  >
                    {cover34Url.length >= 1 ? null : uploadButton('cover34Url')}
                  </OrderUpload>
                </div>
                <div>
                  <OrderUpload
                    listType='picture-card'
                    onPreview={this._handlePreview}
                    beforeUpload={this._beforeUpload}
                    onChange={(data) => { this._handleCoverChange(data, 'cover169Url') }}
                    onRemove={(data) => { this._handleCoverRemove(data, 'cover169Url') }}
                    aliToken={aliToken}
                    rootPath='media'
                    fileList={cover169Url}
                    accept='image/jpg, image/jpeg, image/png'
                  >
                    {cover169Url.length >= 1 ? null : uploadButton('cover169Url')}
                  </OrderUpload>
                </div>
              </div>
            )}
          </FormItem>
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
        </Col>
      </div>
    )
  }

  _getVideoByAssert = (media, type) => {
    const video = isEmpty(media.videoList) ? {} : media.videoList.find(video => {
      if (video.assetBitrate) {
        return video.assetBitrate.toString() === type
      } else {
        return false
      }
    })
    if (isEmpty(video)) {
      return ''
    } else {
      return video.url
    }
  }

  _generatePopByMediaType = (type) => {
    const { mediaList, highlightList } = this.state
    const keyObj = {
      1: 'media',
      2: 'highlight'
    }
    const data = {
      1: mediaList,
      2: highlightList
    }
    const title = {
      1: '剧集',
      2: '花絮'
    }
    return (
      <div className={styles['media-list']}>
        {
          !isEmpty(data[type]) && data[type].map((media, index) => {
            return (
              <Popover
                key={`${keyObj[type]}${index}`}
                placement='topRight'
                content={<div className={styles['pop']}>
                  <div>
                    <label>240:</label><span>{this._getVideoByAssert(media, '1')}</span>
                  </div>
                  <div>
                    <label>480:</label><span>{this._getVideoByAssert(media, '2')}</span>
                  </div>
                  <div>
                    <label>720:</label><span>{this._getVideoByAssert(media, '3')}</span>
                  </div>
                  <div>
                    <label>1080:</label><span>{this._getVideoByAssert(media, '4')}</span>
                  </div>
                  <div>
                    {
                      (!media.episodeId && !media.highlightId) &&
                      <a href='javascript:;' onClick={() => { this._addMedia(index, type) }}>编辑</a>
                    }
                    {
                      !(media.episodeId && type === '1' && mediaList.length === 1) &&
                      <a href='javascript:;' onClick={() => { this._deleteMedia(index, type) }}>删除</a>
                    }
                  </div>
                </div>}
                title={`${title[type]}`}
              >
                <span className={styles['media-sort']}>
                  {
                    type === '1' ? media.sort : media.title
                  }
                </span>
              </Popover>
            )
          })
        }
      </div>
    )
  }

  _setMediaList = (data) => {
    this.setState(data)
  }
  // 生成介质模板单选框
  _getCates= (data) => {
    const { dispatch } = this.props
    dispatch(getCategoryList(data)).then(res => {
      if (res.status === 'success') {
        this.setState({
          ['cates' + data.cateParentId]: res.result
        })
      }
    })
  }

  // 添加剧集
  _addMedia = (index, mediaType = '1') => {
    const { mediaList, highlightList } = this.state
    const sourceList = {
      1: mediaList,
      2: highlightList
    }
    const list = sourceList[mediaType]
    let data = {}
    if (index >= 0) {
      data = list[index]
      data['mediaType'] = mediaType
    }
    this.setState({
      mediaType,
      showMediaModal: true,
      media: data,
      mediaIndex: index,
    })
  }

  // 删除剧集
  _deleteMedia = (index, type) => {
    const { mediaList, highlightList, delMediaIds, delHighlightIds } = this.state
    if (type === '1') {
      const delMedia = mediaList.splice(index, 1)
      delMediaIds.push(delMedia[0].episodeId)
      this.setState({ mediaList, delMediaIds })
    } else {
      const delHighlight = highlightList.splice(index, 1)
      delHighlightIds.push(delHighlight[0].highlightId)
      this.setState({ highlightList, delHighlightIds })
    }
  }

  // 一级分类change
  _handleCatgChange = (value) => {
    const { form } = this.props
    form.setFieldsValue({ subCateIdList: [] })
    this.setState({
      templateCatgId: value,
    })
    this._getSubCateIdList(value)
  }

  // 获取子分类
  _getSubCateIdList = (cateParentId) => {
    const { dispatch } = this.props
    dispatch(getCategoryList({ cateParentId })).then(res => {
      if (res.status === 'success') {
        this.setState({
          subCateIdList: res.result
        })
      }
    })
  }

  // 触发校验所属分类是否选中
  _handleSubCateFocus = () => {
    const { form } = this.props
    const parentCateId = form.getFieldValue('parentCateId')
    if (!parentCateId) {
      message.error('请先选择所属分类！')
    }
  }

  render() {
    const { showButtonSpin, form } = this.props
    const { showMediaModal, media, mediaType, mediaIndex, cates1, subCateIdList, info, mediaList, highlightList, delMediaIds, delHighlightIds } = this.state
    const { getFieldDecorator } = form
    const subCateList = isEmpty(info) ? [] : info.subCateList
    const cateIds = (isEmpty(info) || isEmpty(subCateIdList) || isEmpty(subCateList)) ? [] : subCateList.map(cate => {
      return cate.cateId
    })
    const { match } = this.props
    return (
      <Card title={match.params.episodeId ? '编辑介质' : '创建介质'} bordered={false}>
        <Form
          id='mediaArea'
        >
          <Row>
            <Col span={14}>
              <Row>
                <Col span={24} >
                  <FormItem
                    {...formItemLayout}
                    label='所属分类:'
                  >
                    {getFieldDecorator('parentCateId', {
                      initialValue: isEmpty(info) ? undefined : info.parentCateId,
                      rules: [{
                        required: true,
                        message: '请选择所属分类!'
                      }]
                    })(
                      <Select
                        onChange={this._handleCatgChange}
                        placeholder='请选择所属分类'
                      >
                        {
                          !isEmpty(cates1) && cates1.map(cate => {
                            return (
                              <SelectOption key={cate.cateId} value={cate.cateId}>
                                {cate.cateName}
                              </SelectOption>
                            )
                          })
                        }
                      </Select>
                     )}
                  </FormItem>
                </Col>
                <Col span={24} >
                  <FormItem
                    {...formItemLayout}
                    label='选择子分类'
                  >
                    {getFieldDecorator('subCateIdList', {
                      initialValue: cateIds,
                      rules: [{
                        required: true,
                        message: '请选择子类!'
                      }]
                    })(
                      <Select
                        mode='multiple'
                        placeholder='请选择子分类'
                        onFocus={this._handleSubCateFocus}
                      >
                        {
                          !isEmpty(subCateIdList) && subCateIdList.map((cate, index) => {
                            return (
                              <SelectOption key={index} value={cate.cateId}>
                                {cate.cateName}
                              </SelectOption>
                            )
                          })
                        }
                      </Select>
              )}
                  </FormItem>
                </Col>
                {this._generateForm()}
              </Row>
              <Row
                className={styles['submit-box']}
              >
                <FormItem>
                  <Button
                    type='primary'
                    title='保存'
                    loading={showButtonSpin}
                    disabled={showButtonSpin}
                    htmlType='submit'
                    onClick={(e) => { this._handleSubmit(e, 'N') }}
                  >
                    保存
                  </Button>
                  <Button
                    type='primary'
                    title='保存并提审'
                    loading={showButtonSpin}
                    disabled={showButtonSpin}
                    htmlType='submit'
                    onClick={(e) => { this._handleSubmit(e, 'Y') }}
                  >
                    保存并提审
                  </Button>
                </FormItem>
              </Row>
            </Col>
          </Row>

        </Form>
        <VedioAdd
          showMediaModal={showMediaModal}
          media={media}
          setMediaList = {this._setMediaList}
          mediaType= {mediaType}
          mediaList = {mediaList}
          highlightList = {highlightList}
          getVideoByAssert = {this._getVideoByAssert}
          mediaIndex={mediaIndex}
          delMediaIds={delMediaIds}
          delHighlightIds={delHighlightIds}
        />
      </Card>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showButtonSpin: state.common.showButtonSpin,
    info: state.resource.third.mediaInfo,
    aliToken: state.common.aliToken,
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(MediaAdd))
