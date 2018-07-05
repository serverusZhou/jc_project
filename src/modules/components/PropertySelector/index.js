import React, { Component } from 'react'
import { Select, Icon, Row, Col } from 'antd'

const Option = Select.Option

export default class PropertySelector extends Component {

  render () {
    const { property, propertyPull } = this.props
    return propertyPull.map((item, index) => {
      const childValues = property[index]
      let children = []
      let fatherValue = ''
      item.length > 0 && item.forEach(m => {
        if (m.isCheck === 1) {
          children = m.item || []
          fatherValue = m.groupId || ''
        }
      })
      return (
        <div key={index}>
          <Row gutter={8} style={{ marginBottom: 12 }}>
            <Col span={6} id='selector-id'>
              <Select
                allowClear={true}
                onChange={value => this.props.selectGroup(value, index)}
                value={fatherValue}
                getPopupContainer={() => document.getElementById('selector-id')}
              >
                {
                item.length > 0 && item.map((m, i) => {
                  return (
                    <Option key={i} value={m.groupId} >
                      { m.groupName }
                    </Option>
                  )
                })
              }
              </Select>
            </Col>
            <Col span={18}>
              <Row type='flex' justify='space-between' align='middle'>
                <Col span={18} id='child-selector-id'>
                  <Select
                    placeholder='点此添加属性'
                    mode='multiple'
                    key={childValues}
                    value={childValues}
                    onChange={value => this.props.selectProperty(value, index)}
                    allowClear={true}
                    getPopupContainer={() => document.getElementById('child-selector-id')}
                  >
                    {
                  children.map((m, i) => {
                    return (
                      <Option key={m.propertyId} value={m.propertyId}>
                        { m.propertyName }
                      </Option>)
                  })
                }
                  </Select>
                </Col>
                <Icon
                  type='close-circle-o'
                  style={{ fontSize: 23, color: '#C0C0C0', cursor: 'pointer' }}
                  onClick={() => this.props.deletPropertyGroup(index)}
                />
              </Row>
            </Col>
          </Row>
        </div>
      )
    })
  }
}
