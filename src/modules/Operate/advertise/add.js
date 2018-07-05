import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { Form, Input, Button, Select, Row, Col, DatePicker, Icon, message, Radio, InputNumber } from 'antd'
import styles from './advertise.less'
import * as actions from './reduck'
import { moduleEnum, statusEnum, mediaTypeEnum } from '../dict'
import { getAliToken } from 'Global/action'
import OrderUpload from 'Components/upload/aliUpload'
import { showepisodeListModal } from '../component/episodeListModal'
import { showApplyListModal } from './episodeListModal'
import moment from 'moment'
import { Link } from 'react-router-dom'
import * as urls from 'Global/urls'
import { isEmpty } from 'Utils/lang'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const { RangePicker } = DatePicker

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}

const specFormItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}

const uploadButton = (
  <div>
    <p>16 : 9 尺寸</p>
    <Icon style={{ fontSize: '38px' }} type='plus' />
  </div>
)
const uploadButton1 = (
  <div>
    <p>4 ：3 尺寸</p>
    <Icon style={{ fontSize: '38px' }} type='plus' />
  </div>
)

class AdvAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ad169Url: [],  // 16:9
      ad43Url: [],  // 4:3,
      episodecnName: '',
      applyName: ''
    }
  }

  componentWillMount() {
    const { match, dispatch } = this.props
    const { params } = match
    dispatch(actions.getAllAdPositionList())
    dispatch(getAliToken())
    if (params && params.adId) {
      dispatch(actions.getAdDetails({ adId: params.adId }))
    } else {
      dispatch(createAction(actions.GET_ADVERTISE_DETAILS)({}))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.info !== nextProps.info) {
      const { info } = nextProps
      if (!isEmpty(info)) {
        this.setState({
          ad169Url: info.adImg1Url ? [{ url: info.adImg1Url }] : [],
          ad43Url: info.adImg2Url ? [{ url: info.adImg2Url }] : [],
          episodecnName: info.type !== 3 ? info.episodeName : '',
          episodeId: info.type !== 3 ? info.episodeId : '',
          applyName: info.type === 3 ? info.episodeName : '',
          applyId: info.type === 3 ? info.episodeId : '',
          showTime: [moment(info && info.showStartTime), moment(info && info.showEndTime)]
        })
      }
    }
  }

  // 提交处理
  _handleSubmit = (e) => {
    e.preventDefault()
    const { form, match, dispatch, filter } = this.props
    const { params } = match
    const { adId } = params
    const {
      ad169Url,
      ad43Url,
      episodeId,
      applyId,
      applyName,
      episodecnName
    } = this.state
    form.validateFields((err, values) => {
      if (!err) {
        const arg = {
          positionId: values.positionId,
          sort: values.sort,
          imgShowTime: values.imgShowTime,
          showStartTime: values.showTime && values.showTime[0].format('YYYY-MM-DD HH:mm:ss'),
          showEndTime: values.showTime && values.showTime[1].format('YYYY-MM-DD HH:mm:ss'),
          adImg1Url: (values.type === '1' || values.type === '3') ? ad169Url && ad169Url[ad169Url && ad169Url.length - 1] && ad169Url[ad169Url && ad169Url.length - 1].url || '' : '',
          adImg2Url: (values.type === '1' || values.type === '3') ? ad43Url && ad43Url[ad43Url && ad43Url.length - 1] && ad43Url[ad43Url && ad43Url.length - 1].url || '' : '',
          episodeId: values.type !== '3' ? episodeId : applyId,
          episodeName: values.type !== '3' ? episodecnName : applyName,
          type: values.type
        }
        if (adId) {
          dispatch(actions.EditAd({ adId: adId, ...arg })).then((req) => {
            if (req.status === 'success') {
              dispatch(actions.getAdList({ currentPage: 1, pageSize: 10, ...filter }))
            }
          })
        } else {
          dispatch(actions.AddAd(arg)).then((req) => {
            if (req.status === 'success') {
              dispatch(actions.getAdList({ currentPage: 1, pageSize: 10, ...filter }))
            }
          })
        }
      }
    })
  }
  // 提交审核
  // _handlerOperate = (e) => {
  //   e.preventDefault()
  //   const { form, dispatch } = this.props
  //   form.validateFields((err, values) => {
  //     if (!err) {
  //       const { info } = this.props
  //       const arg = {
  //         serviceId: info.adId,
  //         status: 1,
  //         type: 1,
  //         // 保存快照信息
  //         snapShot: JSON.stringify(info)
  //       }
  //       dispatch(commonActions.auditConfirm(arg)).then((req) => {
  //         if (req.status === 'success') {
  //           dispatch(actions.getAdList({ currentPage: 1, pageSize: 10, ...filter }))
  //         }
  //       })
  //     }
  //   })
  // }

  // 上传详情图 16:9 / 4:3
  _handleCoverChange = ({ fileList }, imgType) => {
    const coverImages = fileList.map((file, index) => {
      if (file.response) {
        file.imageType = '1'
        file.sort = index
        file.url = file.response.url
      }
      return file
    })
    this.setState({ [imgType]: coverImages })
  }

  // 上传前校验
  _beforeUpload = (file) => {
    const isFormat = ['image/jpg', 'image/jpeg', 'image/png'].includes(file.type)
    if (!isFormat) {
      message.error('图片格式不对!')
    }
    const isLt50M = file.size / 1024 / 1024 < 50
    if (!isLt50M) {
      message.error('上传的图片不能大于50M!')
    }
    return isFormat && isLt50M
  }

  _genFilterFields = () => {
    const fields = [
      {
        key: 'module',
        label: '一级分类',
        initialValue: '',
        type: 'Select',
        content: moduleEnum,
      }, {
        key: 'status',
        label: '二级分类',
        initialValue: '',
        type: 'Select',
        content: statusEnum
      }, {
        key: 'showBeginTime',
        label: '三级分类',
        initialValue: '',
        type: 'Select',
        content: moduleEnum,
      }, {
        key: 'advName',
        label: '视频名称',
        initialValue: '',
        type: 'Input',
      }
    ]
    return fields
  }

// 选中视频资源存贮到本地以供新建广告
  _handleSelectValue = (item) => {
    const { form } = this.props
    if (item) {
      this.setState({
        episodeId: item.episodeId || item.highlightId,
        episodecnName: item.episodeCnName || item.title
      })
      form.setFieldsValue({ episode: item.episodeCnName || item.title })
    }
  }

  _handleApplySelectValue = (item) => {
    const { form } = this.props
    if (item) {
      this.setState({
        applyId: item.appId,
        applyName: item.appName
      })
      form.setFieldsValue({ apply: item.appName })
    }
  }
// 上传类型，确定是否需要上传视频资源
  _handlerSelect(e) {
    e.preventDefault()
    const { form } = this.props
    form.setFieldsValue({ episode: undefined, apply: undefined, imgShowTime: '2' })
    this.setState({ episodeId: '', episodecnName: '', applyId: '', applyName: '' })
  }
  // 筛选条件中 —— 定义所属广告位初始值
  _beSelectPositionList = (data) => {
    const { match } = this.props
    const { params } = match
    let value = []
    if (params && params.adId) {
      value = data
    } else {
      let beSelectPositionList = data && data.reduce((beSelectItem, item) => {
        if (item.auditStatus === 3) {
          beSelectItem.push(item)
        }
        return beSelectItem
      }, [])
      value = beSelectPositionList
    }
    return value
  }

  // 时间范围
  _disabledDate = (current) => {
    let date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
    let currDate = moment(current).format('YYYY-MM-DD HH:mm:ss')
    return current && new Date(currDate).valueOf() < new Date(date).valueOf()
  }

  render() {
    const { form, info, aliToken, allPositionList } = this.props
    const beSelectPositionList = this._beSelectPositionList(allPositionList)
    // const { params } = match
    // const { adId } = params
    const {
      ad169Url,
      ad43Url,
      episodecnName,
      showTime,
      applyName
    } = this.state
    const { getFieldDecorator } = form
    return (
      <div className={styles.goods_center}>
        <Form
          onSubmit={this._handleSubmit}
        >
          <Row>
            <Col span={22}>
              <FormItem
                {...specFormItemLayout}
                label={'所属广告位'}
              >
                <div
                  id='positionId'
                  style={{ position: 'relative', marginBottom: '5px' }}
                >
                  {getFieldDecorator('positionId', {
                    initialValue: info && info.positionId || null,
                    rules: [{
                      required: true,
                      message: '请选择所属广告位',
                    }]
                  })(
                    <Select
                      allowClear
                      showSearch={false}
                      placeholder='请选择所属广告位'
                      filterOption={false}
                      required={true}
                    >
                      {beSelectPositionList && beSelectPositionList.map(item => (
                        <Option
                          key={item.positionId}
                          value={item.positionId}
                          title={item.name}
                        >
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={22}>
              <FormItem
                {...specFormItemLayout}
                label='排序序号：'
              >
                {getFieldDecorator('sort', {
                  initialValue: info && info.sort || null,
                  rules: [{
                    required: true,
                    message: '请输入序号',
                  }, {
                    pattern: /^[1-9]\d*$/,
                    message: '只能输入1-9999的整数',
                  }]
                })(
                  <Input
                    maxLength='4'
                    placeholder='请输入序号'
                  />
                )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={22}>
              <FormItem
                {...specFormItemLayout}
                label='类型：'
              >
                {getFieldDecorator('type', {
                  initialValue: (info && info.type) ? (info.type + '') : '1',
                  // rules: [{
                  //   required: true,
                  //   message: '请选择类型',
                  // }]
                })(
                  <RadioGroup
                    size='large'
                    name='type'
                    onChange={(e) => this._handlerSelect(e)}
                  >
                    {
                      mediaTypeEnum && mediaTypeEnum.map((o) => <Radio key={o.value} value={o.value} disable={o.isAlive} >{o.name}</Radio>)
                    }
                  </RadioGroup>
                )
                }
              </FormItem>
            </Col>
          </Row>
          {(form.getFieldValue('type') === '1' || form.getFieldValue('type') === '3') && <Row>
            <Col span={22}>
              <FormItem
                {...formItemLayout}
                label='广告图：'
              >
                {getFieldDecorator('mediaTypeImg', {
                  initialValue: ad169Url && ad169Url[0] && ad169Url[0].url || (ad43Url && ad43Url[0] && ad43Url[0].url) || '',
                  rules: [{
                    required: true,
                    message: '请选择广告图',
                  }]
                })(
                  <div>
                    <OrderUpload
                      listType='picture-card'
                      className={styles['avatar-uploader1']}
                      beforeUpload={this._beforeUpload}
                      onChange={(e) => this._handleCoverChange(e, 'ad169Url')}
                      aliToken={aliToken}
                      showUploadList={false}
                      rootPath='operate'
                      fileList={ad169Url}
                      accept='image/jpg, image/jpeg, image/png'
                    >
                      {ad169Url && ad169Url.length > 0 ? <img src={ad169Url[ad169Url.length - 1].url} className={styles.UploadImg1} /> : uploadButton}
                    </OrderUpload>
                    <OrderUpload
                      listType='picture-card'
                      className={styles['avatar-uploader']}
                      beforeUpload={this._beforeUpload}
                      onChange={(e) => this._handleCoverChange(e, 'ad43Url')}
                      showUploadList={false}
                      aliToken={aliToken}
                      rootPath='operate'
                      fileList={ad43Url}
                      accept='image/jpg, image/jpeg, image/png'
                    >
                      {ad43Url && ad43Url.length > 0 ? <img src={ad43Url[ad43Url.length - 1].url} className={styles.UploadImg2} /> : uploadButton1}
                    </OrderUpload>
                    <p className={styles['good-tips']}>
                      支持jpg、jpeg、png等格式
                    </p>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>}
          {
            form.getFieldValue('type') === '3' ? (
              <Row>
                <Col span={22}>
                  <FormItem
                    {...specFormItemLayout}
                    label='应用：'
                  >
                    {getFieldDecorator('apply', {
                      initialValue: applyName || '',
                      rules: [{
                        required: true,
                        message: '请选择应用',
                      }]
                    })(
                      <Input
                        maxLength='50'
                        placeholder='请选择应用'
                        onClick={() => showApplyListModal({
                          onSelect: this._handleApplySelectValue,
                        }, {
                          title: '选择',
                          width: 800
                        })}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col span={22}>
                  <FormItem
                    {...specFormItemLayout}
                    label='视频资源：'
                  >
                    {getFieldDecorator('episode', {
                      initialValue: episodecnName || '',
                      rules: [{
                        required: form.getFieldValue('type') === '2' && true || false,
                        message: '请选择视频资源',
                      }]
                    })(
                      <Input
                        maxLength='50'
                        placeholder='请选择资源'
                        onClick={() => showepisodeListModal({
                          onSelect: this._handleSelectValue,
                          // 图片选父剧集视频选子剧集
                          noShowChild: form.getFieldValue('type') !== '2',   // 是否只选择子剧集
                          isSelfSource: form.getFieldValue('type') === '2',  // 是否只选择自有源
                        }, {
                          title: '选择',
                          width: 800
                        })}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            )
          }
          <Row>
            <Col span={22}>
              <FormItem
                {...specFormItemLayout}
                label='展示时间：'
              >
                {getFieldDecorator('showTime', {
                  initialValue: showTime || [],
                  rules: [{
                    required: true,
                    message: '请选择展示时间',
                  }]
                })(
                  <RangePicker
                    disabledDate={this._disabledDate}
                    showTime={{ format: 'HH:mm:ss' }}
                    format='YYYY-MM-DD HH:mm:ss'
                    placeholder={['请选择开始时间', '请选择结束时间']}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={22}>
              <FormItem
                {...specFormItemLayout}
                label='播放时长：'
              >
                {getFieldDecorator('imgShowTime', {
                  initialValue: (!isEmpty(info) && info.imgShowTime) ? info.imgShowTime : '2',  // 默认时间为2秒
                  rules: [{
                    required: true,
                    message: '请输入播放时长！',
                  }, {
                    pattern: /(^[0-9]{1,9}$)/,
                    message: '请输入9为整数！',
                  }]
                })(
                  <InputNumber
                    style={{ width: '200px' }}
                    placeholder='请输入播放时长'
                    maxLength='9'
                    min={1}
                  />
              )}
              </FormItem>
            </Col>
          </Row>
          <FormItem className={styles['operate-btn']}>
            <Link to={`${urls.OPERATE_ADVERTISE_MANAGE}`}>
              <Button
                title='点击取消'
              >
                取消
              </Button>
            </Link>
            <Button
              type='primary'
              title='点击保存'
              htmlType='submit'
            >
              保存
            </Button>
            {false &&
            <Button
              title='点击提交审核'
              onClick={this._handlerOperate}
            >提交审核</Button>}
          </FormItem>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loadingBtn: state.common.loadingBtn,
    aliToken: state.common.aliToken,
    info: state.operate && state.operate.advertise && state.operate.advertise.adDetails,
    allPositionList: state.operate.advertise.allPositionList || []
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AdvAdd))
