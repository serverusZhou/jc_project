import React from 'react'
import { Card, Form, Button, Row, Col, Input, TreeSelect, InputNumber, Select, Tooltip, Icon } from 'antd'
import { connect } from 'react-redux'
import { JcDisplayItem, UpLoadBtn, JcMediaDisplay, JcExpandItem } from '../../components/styleComponents'
import AliUpload from '../../components/upload/aliUpload'
import { getDataFromTree } from 'Utils/utils'
import { unitMap } from 'Global/bizdictionary'
import { fetchQiniuToken } from 'Global/globalReduck'
import * as action from './reduck'
import * as propertyAction from './propertyReduck'
import PropertyTable from './PropertyTable'
// import { imgPrefix } from 'Utils/config'

const { TreeNode } = TreeSelect
const { Option } = Select
const { TextArea } = Input

class CommodityDetail extends React.Component {
  state = {
    isAdd: undefined,
    mode: 'view',
    goodsId: ''
  }

  componentWillMount() {
    // 初始化编辑还是预览状态
    const { goodsId } = this.props.match.match.params
    this.setState({ isAdd: !goodsId, mode: !goodsId ? 'edit' : 'view', goodsId })
    this.props.dispatch(fetchQiniuToken())
    this.props.dispatch(action.treeData())
    if (!goodsId) {
      this.props.dispatch(action.resetDetail())
    } else {
      this.props.dispatch(action.getDetail({ goodsId }))
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    const { isAdd, goodsId } = this.state
    const { dispatch, form, propertyRows } = this.props
    const final = propertyRows.map((m, i) => {
      const ids = []
      if (m.property1) {
        ids.push(m.property1.id)
      }
      if (m.property2) {
        ids.push(m.property2.id)
      }
      if (m.property3) {
        ids.push(m.property3.id)
      }
      return {
        item: ids,
        price: m.price,
        addStock: m.stock,
        weight: m.weight,
        cost: m.cost,
        warningStock: m.warningStock,
        supplyCode: m.supplyCode
      }
    })
    if (final.length) {
      const checkPrice = final.every(m => {
        return m.price > 0
      })
      if (!checkPrice) {
        return message.warn('销售属性价格必须大于0！')
      }
    }
    form.validateFieldsAndScroll((err, values) => {
      if (err) return
      const formValues = {
        ...values,
        goodsImage: values.goodsImage.map(item => item.url),
        detail: values.detail.map(item => item.url),
        property: final
      }
      if (isAdd) {
        dispatch(action.addCommodity(formValues))
      } else {
        dispatch(action.updateCommodity({ ...formValues, goodsId }))
      }
    })
  }

  // 图片上传控制
  normFile = e => {
    if (Array.isArray(e)) {
      return e
    }
    let fileList = e && e.fileList
    fileList = fileList.map(file => {
      if (file.response && file.response.requestUrls) {
        // file.url = imgPrefix.concat(file.response.requestUrls[0].slice(48))
        file.url = file.response.requestUrls[0]
      }
      return file
    })
    return fileList
  }

  isMore0 = (rule, value, callback) => {
    if (value === null || value === undefined) {
      value = ''
    }
    if (value !== 0) {
      callback()
    } else {
      callback('输入值必须大于0')
    }
  }

  checkAddStock = (rule, value, callback) => {
    if (this.state.isAdd && value <= 0) {
      callback('初始库存必须大于0')
    } else {
      callback()
    }
  }

  handleModeChange = (e, mode) => {
    e.preventDefault()
    const { goodsId } = this.props.match.match.params
    this.setState({ mode })
    if (mode === 'edit') {
      this.props.dispatch(propertyAction.setAddStock0())
    } else {
      if (goodsId) {
        this.props.dispatch(action.getDetail({ goodsId }))
      } else {
        this.props.dispatch(action.resetDetail())
      }
    }
  }

  render() {
    const { mode, isAdd } = this.state
    const { form, detail, treeData, qiniuToken } = this.props
    const { getFieldDecorator } = form
    const commonUploadConfig = {
      listType: 'picture-card',
      // action: 'http://upload.qiniu.com',
      aliToken: qiniuToken,
      accept: 'image/jpg, image/jpeg, image/png',
      needOrder: true
    }

    const headExtra = () => {
      if (!isAdd && mode === 'view') {
        return (
          <div>
            <Button
              type='primary'
              disabled={detail.auditStatus === '2'}
              style={{ marginRight: 8 }}
              onClick={e => this.handleModeChange(e, 'edit')}
            >
              编辑
            </Button>
            <Button onClick={() => this.props.match.history.goBack()}>返回</Button>
          </div>
        )
      } else if (!isAdd && mode === 'edit') {
        return (
          <div>
            <Button style={{ marginRight: 8 }} type='primary' onClick={this.handleSubmit}>
              保存
            </Button>
            <Button onClick={e => this.handleModeChange(e, 'view')}>取消</Button>
          </div>
        )
      } else if (isAdd) {
        return (
          <div>
            <Button type='primary' onClick={this.handleSubmit}>
              保存
            </Button>
          </div>
        )
      }
    }

    const categoryTreeSelect = data => {
      if (!data || data.length === 0) {
        return
      }
      return data.map((item, index) => {
        if (item.children && item.children.length > 0) {
          return (
            <TreeNode
              disabled={true}
              title={item.categoryName}
              value={item.categoryId}
              key={`${item.categoryId}-${index}`}
            >
              {categoryTreeSelect(item.children)}
            </TreeNode>
          )
        } else {
          return <TreeNode title={item.categoryName} value={item.categoryId} key={item.categoryId} />
        }
      })
    }

    return (
      <Form>
        <Card title='基础信息' extra={headExtra()} style={{ marginBottom: 24 }}>
          <Row gutter={16} type='flex'>
            <Col span={8} style={{ marginBottom: 12 }}>
              <JcDisplayItem label='商品名称' mode={mode} text={detail.goodsTitle}>
                {getFieldDecorator('goodsTitle', {
                  initialValue: detail.goodsTitle || undefined,
                  rules: [{ required: true, message: '商品名称必填' }, { max: 40, message: '商品名称必须小于40个字符' }]
                })(<Input placeholder='请输入商品名称或标题' />)}
              </JcDisplayItem>
            </Col>
            <Col span={8} style={{ marginBottom: 12 }}>
              <JcDisplayItem label='商品副标' mode={mode} text={detail.goodsSubTitle}>
                {getFieldDecorator('goodsSubTitle', {
                  initialValue: detail.goodsSubTitle || undefined,
                  rules: [{ max: 200, message: '商品副标必须小于200个字符' }]
                })(<Input placeholder='请输入商品副标题' />)}
              </JcDisplayItem>
            </Col>
            <Col span={8} style={{ marginBottom: 12 }}>
              <JcDisplayItem label='所属类目' mode={mode} text={getDataFromTree(treeData, detail.categoryFrontId)}>
                {getFieldDecorator('categoryFrontId', {
                  initialValue: detail.categoryFrontId || undefined,
                  rules: [{ required: true, message: '所属类目必填' }]
                })(
                  <TreeSelect
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                    placeholder='请选择类目'
                    showSearch={false}
                    treeDefaultExpandAll={true}
                    getPopupContainer={target => target.parentNode}
                  >
                    {categoryTreeSelect(treeData)}
                  </TreeSelect>
                )}
              </JcDisplayItem>
            </Col>
            <Col span={8} style={{ marginBottom: 12 }}>
              <JcDisplayItem label='销售价格' mode={mode} text={`${detail.price ? detail.price.toFixed(2) : ''}`}>
                {getFieldDecorator('price', {
                  initialValue: detail.price || undefined,
                  rules: [{ required: true, message: '销售价格必填' }, { validator: this.isMore0 }]
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0.01}
                    step={0.01}
                    precision={2}
                    placeholder='请输入销售价格'
                  />
                )}
              </JcDisplayItem>
            </Col>
            <Col span={8} style={{ marginBottom: 12 }}>
              <JcDisplayItem
                label={
                  mode === 'view' ? (
                    '库存'
                  ) : (
                    <span>
                      库存
                      <Tooltip title='编辑时库存为增量数据'>
                        <Icon type='question-circle-o' style={{ marginLeft: 3, color: '#ddd' }} />
                      </Tooltip>
                    </span>
                  )
                }
                mode={mode}
                text={detail.stock}
              >
                {getFieldDecorator('addStock', {
                  initialValue: 0,
                  rules: [{ required: true, message: '库存必填' }, { validator: this.checkAddStock }]
                })(<InputNumber style={{ width: '100%' }} step={1} precision={0} placeholder='请输入库存增量数据' />)}
              </JcDisplayItem>
            </Col>
            <Col span={8} style={{ marginBottom: 12 }}>
              <JcDisplayItem label='单位' mode={mode} text={detail.unit}>
                {getFieldDecorator('unit', {
                  initialValue: detail.unit || '包',
                  rules: [{ required: false, message: '单位必填' }]
                })(
                  <Select allowClear style={{ width: '100%' }} getPopupContainer={target => target.parentNode}>
                    {unitMap.map(unit => {
                      return (
                        <Option key={unit} value={unit}>
                          {unit}
                        </Option>
                      )
                    })}
                  </Select>
                )}
              </JcDisplayItem>
            </Col>
            <Col span={8} style={{ marginBottom: 12 }}>
              <JcDisplayItem label='排序' mode={mode} text={`${detail.sort || ''}`}>
                {getFieldDecorator('sort', {
                  initialValue: detail.sort || undefined
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    max={9999}
                    step={1}
                    precision={0}
                    placeholder='请输入排序'
                  />
                )}
              </JcDisplayItem>
            </Col>
            <Col span={24}>
              <JcDisplayItem
                label='商品图'
                mode={mode}
                text={<JcMediaDisplay medias={detail.goodsImage} />}
                help={mode === 'edit' && '图片支持png、jpg格式，最佳尺寸800*800 默认第一张为主图，最多上传六张'}
              >
                {getFieldDecorator('goodsImage', {
                  initialValue: detail.goodsImage
                    ? detail.goodsImage.map((e, i) => ({ url: e, uid: `goodsImage:${i}` }))
                    : [],
                  valuePropName: 'fileList',
                  rules: [{ required: true, message: '商品图必填' }],
                  getValueFromEvent: this.normFile
                })(
                  <AliUpload {...commonUploadConfig} max={6}>
                    <UpLoadBtn />
                  </AliUpload>
                )}
              </JcDisplayItem>
            </Col>
          </Row>
        </Card>
        <PropertyTable ref={'property'} mode={mode} maxRow={3} />
        <Card title='商品详情' style={{ marginBottom: 24 }}>
          <JcDisplayItem
            label='购买须知'
            mode={mode}
            text={<JcExpandItem text={detail.tips} />}
            style={{ marginBottom: 12 }}
          >
            {getFieldDecorator('tips', {
              initialValue: detail.tips || undefined,
              rules: [{ max: 3000, message: '购买须知限3000个英文字符以内' }]
            })(<TextArea style={{ marginTop: 8 }} rows={4} placeholder='限3000个英文字符以内' />)}
          </JcDisplayItem>
          <JcDisplayItem
            label='图文详情'
            mode={mode}
            text={<JcMediaDisplay medias={detail.detail} />}
            help={mode === 'edit' && '图片支持png、jpg格式，建议宽度720，长不超过800，最多上传十张'}
          >
            {getFieldDecorator('detail', {
              initialValue: detail.detail ? detail.detail.map((e, i) => ({ url: e, uid: `detail:${i}` })) : [],
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
              rules: [{ required: true, message: '图文详情必填' }]
            })(
              <AliUpload {...commonUploadConfig} max={10}>
                <UpLoadBtn />
              </AliUpload>
            )}
          </JcDisplayItem>
        </Card>
      </Form>
    )
  }
}

const mapStateToProps = ({ globalReduck, commodity, property }) => {
  return {
    treeData: commodity.treeData,
    qiniuToken: globalReduck.qiniuToken,
    detail: commodity.detail,
    propertyRows: property.propertyRows
  }
}
export default connect(mapStateToProps)(Form.create()(CommodityDetail))
