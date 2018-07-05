import React, { Component } from 'react'
import {
  Form,
  Input,
  Select,
  Button,
  Radio,
  Row,
  Col,
  Icon,
  Modal,
  message,
  // Table
} from 'antd'
import { showModalSelectForm } from 'Components/modal/ModalSelectForm'
// import Filter from 'Components/Filter/index'
import { genPlanColumn } from 'Utils/helper'
import fetchData, { fetchTvMall } from 'Utils/fetch'
import { isEmpty } from 'Utils/lang'
import { typeEnum } from '../dict'
import apis from '../apis'
// import * as urls from 'Global/urls'
// import { Link } from 'react-router-dom'
// import { connect } from 'react-redux'
import { picUrlType } from '../dict'
import { showepisodeListModal } from '../component/episodeListModal'
import AliUpload from 'Components/upload/aliUploadV2'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
const TextArea = Input.TextArea
const specFormItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}
const uploadButton = (
  <div>
    <Icon type='plus' />
    <div className='ant-upload-text'>上传运营图</div>
  </div>
)

class BoundContent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      sourceData: {},
      operaterPic: [],
      previewImage: '',
      previewVisible: false,
      originPic: [],
    }
  }

  componentWillMount() {
    const { itemData } = this.props
    fetchData(apis.operaterpic.detail, { sourceId: itemData.layoutBindId }).then(res => {
      if (res.code === 0) {
        if (res.data.operaterPic) {
          this.setState({
            operaterPic: [{ uid: 0, url: res.data.operaterPic }],
            originPic: [{ uid: 0, url: res.data.operaterPic }],
          })
        }
      }
    })
  }
  
  _genFilterFields = () => {
    const fields = [
      {
        key: 'advName',
        label: '视频名称',
        initialValue: '',
        type: 'Input',
      }
    ]
    return fields
  }

  _columns = [
    genPlanColumn('cateName', '名称'),
    genPlanColumn('logoUrl', 'logo', {
      render: (text) => {
        return text ? (<img alt='加载失败' style={{ width: 80, height: 80 }} src={text} />) : null
      }
    }),
    genPlanColumn('createTime', '创建时间'),
  ]

  _AdvertiseColumns = [
    genPlanColumn('adId', '广告Id'),
    genPlanColumn('positionName', '广告位'),
    genPlanColumn('adImg1Url', '图片16:9', {
      render: (text) => {
        return text ? (<img alt='加载失败' style={{ width: 80, height: 80 }} src={text} />) : null
      }
    }),
    genPlanColumn('adImg2Url', '图片4:3', {
      render: (text) => {
        return text ? (<img alt='加载失败' style={{ width: 80, height: 80 }} src={text} />) : null
      }
    }),
    genPlanColumn('showStartTime', '展示开始时间'),
    genPlanColumn('showEndTime', '展示结束时间'),
  ]
  _goodsColumns = [
    genPlanColumn('goodsTitle', '商品名称'),
    genPlanColumn('imageUrl', '商品图片', {
      render: (text) => {
        return text ? (<img alt='加载失败' style={{ width: 80, height: 80 }} src={text} />) : null
      }
    }),
    genPlanColumn('operationTimeStr', '操作时间'),
  ]

  _showURLsModal = () => {
    const { form } = this.props
    const type = form.getFieldValue('type')
    if (type + '' === '6') {
      showModalSelectForm({
        modalParam: {
          title: '选择',
          width: '920px'
        },
        listFieldName: 'data',
        rowKey: 'cateId',
        selectType: 'radio',
        instantSelected: true,
        fetch: fetchData,
        url: apis.vedio.vedioCateList,
        extraParams: { auditStatus: '3', parentCateId: '' },
        columns: this._columns,
        // selectedList: itemData.bindId ? [{ cateId: itemData.bindId }] : [],
        onSelect: (selectedRows) => {
          // console.log(selectedRows)
          this.setState({
            sourceData: selectedRows[0],
            operaterPic: [],
            originPic: []
          })
          this.props.form.setFieldsValue({
            bindId: selectedRows[0].cateName
          })
        },
      })
    } else if (type + '' === '4') {
      showModalSelectForm({
        modalParam: {
          title: '选择',
          width: '920px'
        },
        listFieldName: 'data',
        rowKey: 'goodsId',
        selectType: 'radio',
        instantSelected: true,
        fetch: fetchTvMall,
        url: apis.goods.goodsList,
        extraParams: { auditStatus: '3', status: '1', pageNo: 1, pageSize: 5 },
        columns: this._goodsColumns,
        currentPageFieldName: 'pageNo',
        // selectedList: itemData.bindId ? [{ cateId: itemData.bindId }] : [],
        onSelect: (selectedRows) => {
          // console.log(selectedRows)
          this.setState({
            sourceData: selectedRows[0],
            operaterPic: [],
            originPic: []
          })
          this.props.form.setFieldsValue({
            bindId: selectedRows[0].goodsTitle
          })
        },
      })
    } else if (type + '' === '2') {
      showModalSelectForm({
        modalParam: {
          title: '选择',
          width: '920px'
        },
        listFieldName: 'data',
        rowKey: 'adId',
        selectType: 'radio',
        instantSelected: true,
        fetch: fetchData,
        url: apis.advertise.list,
        extraParams: { currentPage: 1, pageSize: 5, type: 1 },
        columns: this._AdvertiseColumns,
        currentPageFieldName: 'currentPage',
        // selectedList: itemData.bindId ? [{ cateId: itemData.bindId }] : [],
        onSelect: (selectedRows) => {
          // console.log(selectedRows)
          this.setState({
            sourceData: selectedRows[0],
            operaterPic: [],
            originPic: []
          })
          this.props.form.setFieldsValue({
            bindId: selectedRows[0].adId
          })
        },
      })
    } else {
      showepisodeListModal({
        onSelect: (data) => {
          this.setState({ sourceData: data, operaterPic: [], originPic: [] })
          this.props.form.setFieldsValue({
            bindId: data.episodeCnName || data.title
          })
        },
        noShowChild: true
      }, {
        title: '选择',
        width: '980px'
      })
    }
  }

  _handlerSelect(value) {
    const { form } = this.props
    form.setFieldsValue({ picUrlType: value })
  }

  _handleSubmit() {
    // const { handlerAdd } = this.props
    // e.preventDefault()
    const { sourceData, operaterPic, originPic } = this.state
    const { itemData, form } = this.props
    if (!isEmpty(originPic) && isEmpty(operaterPic)) {
      message.error('运营图不能为空！')
      return
    }
    if (!isEmpty(itemData) && isEmpty(sourceData)) {
      const reqBean = {
        layoutId: itemData.layoutId,
        sort: itemData.sort,
        type: itemData.type,
        picUrlType: form.getFieldValue('picUrlType'),
        name: itemData.name,
        description: form.getFieldValue('description'),
        operaterPic: isEmpty(operaterPic) ? undefined : operaterPic[0].url,
        layoutBindId: itemData.layoutBindId,
      }
      if (itemData.content) {
        try {
          const content = JSON.parse(itemData.content)
          reqBean.goId = content.goData.id
          reqBean.goType = content.type
          reqBean.goAppData = content.goData.appdata
        } catch (error) {
        }
      }
      if (itemData.type + '' === '4') {
        reqBean.goType = '7'
        reqBean.bindId = itemData.bindId
      } else if (itemData.type + '' === '6') {
        reqBean.goType = '5'
        reqBean.goChannelId = itemData.bindId
        reqBean.bindId = itemData.bindId
        reqBean.picUrl = itemData.picUrl
      } else if (itemData.type + '' === '2') {
        reqBean.goType = '5'
        reqBean.name = ''
        reqBean.goChannelId = itemData.bindId
        reqBean.bindId = itemData.bindId
        reqBean.cover169Url = itemData.adImg1Url
        reqBean.cover34Url = itemData.adImg2Url
      } else {
        // reqBean.goType = '2'
        reqBean.goId = itemData.bindId
        reqBean.bindId = itemData.bindId
        reqBean.cover169Url = itemData.cover169Url
        reqBean.cover34Url = itemData.cover34Url
        reqBean.cover23Url = itemData.cover23Url
      }
      this.props.bindContent(reqBean, this.props.onCancel)
      return
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const reqBean = {
          layoutId: this.props.layoutId,
          sort: this.props.sort,
          type: values.type,
          picUrlType: values.picUrlType,
          name: values.bindId,
          operaterPic: isEmpty(operaterPic) ? undefined : operaterPic[0].url,
          layoutBindId: itemData.layoutBindId,
        }
        if (values.type + '' === '4') {
          reqBean.goType = '7'
          reqBean.bindId = this.state.sourceData.goodsId
          reqBean.picUrl = this.state.sourceData.imageUrl
        } else if (values.type + '' === '6') {
          reqBean.goType = '5'
          reqBean.goChannelId = this.state.sourceData.cateId
          reqBean.picUrl = this.state.sourceData.logoUrl
          reqBean.bindId = this.state.sourceData.cateId
        } else if (values.type + '' === '2') {
          reqBean.goType = '2'
          reqBean.name = ''
          reqBean.goId = this.state.sourceData.episodeId
          reqBean.cover169Url = sourceData.adImg1Url
          reqBean.cover34Url = sourceData.adImg2Url
          reqBean.picUrl = sourceData.adImg1Url || sourceData.adImg2Url
          reqBean.bindId = this.state.sourceData.adId
        } else {
          reqBean.goType = '2'
          if (this.state.sourceData.source === 'yk') {
            reqBean.goType = '10'
            const originId = this.state.sourceData.originId
            if (originId && originId.split('_')[1]) {
              reqBean.goAppData = 'ykott://tv/detail?url=tv/v3/show/detail?id=' + originId.split('_')[1] + '&fullscreen=true&fullback=true&from=com.jctv.tvhome'
            }
          }
          reqBean.goId = this.state.sourceData.episodeId || this.state.sourceData.highlightId
          reqBean.cover169Url = sourceData.cover169Url
          reqBean.cover34Url = sourceData.cover34Url
          reqBean.cover23Url = sourceData.cover23Url
          reqBean.picUrl = sourceData.cover169Url || sourceData.cover34Url || sourceData.cover23Url
          reqBean.bindId = this.state.sourceData.episodeId
        }
        this.props.bindContent(reqBean, this.props.onCancel)
      }
    })
  }

  _handleTypeChange = value => {
    this.setState({ sourceData: {}})
    this.props.form.setFieldsValue({
      bindId: ''
    })
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

  // 上传详情图change事件
  _handleCoverChange = ({ fileList }) => {
    this.setState({ operaterPic: fileList })
  }

  _normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  _previewCancel = () => this.setState({ previewVisible: false })

  render() {
    const { form, itemData, dataSourceType, aliToken } = this.props
    const { operaterPic, previewImage, previewVisible } = this.state
    const { getFieldDecorator } = form
    return (
      <Form onSubmit={() => this._handleSubmit()}>
        <Row>
          <Col span={22}>
            <FormItem
              {...specFormItemLayout}
              label='分类'
            >
              {getFieldDecorator('type', {
                initialValue: itemData.type ? itemData.type + '' : '',
                rules: [{
                  required: true,
                  message: '请选择分类',
                }]
              })(
                <Select
                  placeholder={'请选择分类'}
                  onChange={this._handleTypeChange}
                >
                  {typeEnum && typeEnum.map(item => (
                    <Option
                      key={item.value}
                      value={item.value}
                      title={item.name}
                    >
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <FormItem
              {...specFormItemLayout}
              label='资源名称'
            >
              {getFieldDecorator('bindId', {
                initialValue: itemData.name,
                rules: [{
                  required: true,
                  message: '资源名称',
                }]
              })(
                <Input
                  rows={9}
                  onClick={() => this._showURLsModal()}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <FormItem
              {...specFormItemLayout}
              label='尺     寸:'
            >
              {getFieldDecorator('picUrlType', {
                initialValue: itemData.picUrlType || '1',
                rules: [{
                  required: true,
                  message: '请选择尺寸',
                }]
              })(
                <RadioGroup
                  size='large'
                  name='sizeRadio'
                  onChange={(e) => this._handlerSelect(e.target.value)}
                >
                  {
                    picUrlType && picUrlType.map((o) => <Radio key={o.value} value={o.value} >{o.name}</Radio>)
                  }
                </RadioGroup>
              )
              }
            </FormItem>
          </Col>
        </Row>
        {
          // 只有影视推荐 首行布局才出现简介
          dataSourceType === 10002 &&
          <Row>
            <Col span={22}>
              <FormItem
                {...specFormItemLayout}
                label='简介'
              >
                {getFieldDecorator('description', {
                  initialValue: itemData.description,
                  rules: [{
                    required: true,
                    message: '请输入简介',
                  }]
                })(
                  <TextArea
                    placeholder='请输入简介'
                    maxLength='20'
                    autosize={{ minRows: 2, maxRows: 6 }}
                  />
              )}
              </FormItem>
            </Col>
          </Row>
        }
        {
          // 影视分类不需要运营图
          dataSourceType !== 10003 && <Row>
            <Col span={22}>
              <FormItem
                {...specFormItemLayout}
                label='运营图'
              >
                {getFieldDecorator('operaterPic', {
                  valuePropName: 'fileList',
                  getValueFromEvent: this._normFile,
                  initialValue: operaterPic,
                })(
                  <AliUpload
                    listType='picture-card'
                    onPreview={this._handlePreview}
                    beforeUpload={this._beforeUpload}
                    onChange={this._handleCoverChange}
                    aliToken={aliToken}
                    rootPath='tvOperate'
                    accept='image/*'
                    max={1}
                  >
                    {uploadButton}
                  </AliUpload>
                )}
              </FormItem>
            </Col>
          </Row>
        }
        <Row>
          <Col span={24}>
            <div style={{ 'float': 'right' }}>
              <Button
                title='点击取消'
                onClick={this.props.onCancel}
              >取消
              </Button>
              <Button
                type='primary'
                style={{ marginLeft: 30 }}
                onClick={() => this._handleSubmit()}
              >
                保存
              </Button>
            </div>
          </Col>
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
        </Row>
      </Form>
    )
  }
}

export default Form.create()(BoundContent)
