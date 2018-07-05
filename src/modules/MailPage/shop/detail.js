import React from 'react'
import { connect } from 'react-redux'
import { Card, Form, Button, Row, Col, Input, Select, Checkbox } from 'antd'
import { JcDisplayItem } from '../../components/styleComponents'
import { ShopType, BusinessTypes } from 'Global/bizdictionary'
import { getShopInfo, setShopInfo } from './reduck'
import { getValuesFromDic } from 'Utils/utils'

const Option = Select.Option
const CheckboxGroup = Checkbox.Group

class ShopDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 'view',
      shopId: this.props.match.match.params.shopId
    }
  }

  componentWillMount() {
    const { shopId } = this.state
    const { dispatch } = this.props
    dispatch(getShopInfo({ shopId }))
  }

  componentWillUnmount = () => {
    this.props.dispatch(setShopInfo({}))
  }

  _renderTopButton = () => {
    return (
      <div>
        <Button onClick={() => this.props.match.history.goBack()}>返回</Button>
      </div>
    )
  }

  render() {
    const { mode, shopId } = this.state
    const { form, detail } = this.props
    const { getFieldDecorator } = form
    return (
      <Form>
        <Card
          title={`店铺Id:${shopId}`}
          bodyStyle={{ height: 0, padding: 0 }}
          style={{ marginBottom: 24 }}
          extra={this._renderTopButton()}
          bordered={false}
        />
        <Card
          title={'基础信息'}
          style={{ marginBottom: 24 }}
          bordered={false}
        >
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} type='flex' align='middle'>
            <Col span={8} style={{ marginBottom: 8 }}>
              <JcDisplayItem labelWidth={5} label='店铺名称' mode={mode} text={detail.shopName || ''} maxLength={15}>
                {getFieldDecorator('shopName', {
                  initialValue: detail.shopName || undefined,
                  rules: [{ required: true, message: '店铺名称必填' }]
                })(
                  <Input
                    disabled={true}
                    style={{ width: '100%' }}
                    placeholder='请输入店铺名称'
                  />
                )}
              </JcDisplayItem>
            </Col>
            <Col span={8} style={{ marginBottom: 8 }}>
              <JcDisplayItem labelWidth={5} label='店铺类型' mode={mode} text={ShopType[detail.shopType] || ''}>
                {getFieldDecorator('shopType', {
                  initialValue: detail.shopType,
                  rules: [
                    {
                      required: true,
                      message: '店铺类型必填'
                    }
                  ]
                })(
                  <Select
                    disabled={true}
                    placeholder='请选择店铺类型'
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    {Object.keys(ShopType).map(key => {
                      return (
                        <Option
                          key={key}
                          value={key}
                        >
                          {ShopType[key]}
                        </Option>
                      )
                    })}
                  </Select>
                )}
              </JcDisplayItem>
            </Col>
            <Col span={8} style={{ marginBottom: 8 }}>
              <JcDisplayItem labelWidth={5} label='业务类型' mode={mode} text={getValuesFromDic(BusinessTypes, detail.businessTypeList) || ''}>
                {getFieldDecorator('businessTypeList', {
                  initialValue: detail.businessTypeList || undefined,
                  rules: [{ required: true, message: '业务类型必填' }]
                })(
                  <CheckboxGroup disabled={true}>
                    {Object.keys(BusinessTypes).map(key => {
                      return (
                        <Checkbox
                          key={key}
                          value={key}
                        >
                          {BusinessTypes[key]}
                        </Checkbox>
                      )
                    })}
                  </CheckboxGroup>
                )}
              </JcDisplayItem>
            </Col>
          </Row>
        </Card>
        <Card
          title={'店主信息'}
          style={{ marginBottom: 24 }}
          bordered={false}
        >
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} type='flex' align='middle'>
            <Col span={8} style={{ marginBottom: 8 }}>
              <JcDisplayItem labelWidth={5} label='姓名' mode={mode} text={detail.owner || ''} maxLength={9}>
                {getFieldDecorator('owner', {
                  initialValue: detail.owner || undefined,
                  rules: [{ required: true, message: '店主姓名必填' }]
                })(
                  <Input
                    disabled={true}
                    style={{ width: '100%' }}
                    placeholder='请输入店主姓名'
                  />
                )}
              </JcDisplayItem>
            </Col>
            <Col span={8} style={{ marginBottom: 8 }}>
              <JcDisplayItem labelWidth={5} label='手机号码' mode={mode} text={detail.ownerPhone || ''} maxLength={12}>
                {getFieldDecorator('ownerPhone', {
                  initialValue: detail.ownerPhone || undefined,
                  rules: [{ required: true, message: '手机号码必填' }]
                })(
                  <Input
                    disabled={true}
                    style={{ width: '100%' }}
                    placeholder='请输入手机号码'
                  />
                )}
              </JcDisplayItem>
            </Col>
          </Row>
        </Card>
      </Form>
    )
  }

}

const mapStateToProps = state => {
  return {
    detail: state.shop.shopInfo
  }
}

export default connect(mapStateToProps)(Form.create()(ShopDetail))
