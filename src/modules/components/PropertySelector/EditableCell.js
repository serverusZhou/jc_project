import React, { Component } from 'react'
import { InputNumber, Input } from 'antd'
import styles from './style.less'

export default class EditableCell extends Component {
  render() {
    const { value, min, step, precision, componentType } = this.props
    return (
      <div className={styles['editable-cell']}>
        <div className={styles['editable-cell-input-wrapper']}>
          {componentType === 'InputNumber' ? (
            <InputNumber
              value={value}
              onChange={value => this.props.onChange(value)}
              onPressEnter={this.check}
              min={min}
              step={step}
              precision={precision}
            />
          ) : (
            <Input
              value={value ? value.toString() : ''}
              onChange={e => this.props.onChange(e.target.value)}
              onPressEnter={this.check}
            />
          )}
        </div>
      </div>
    )
  }
}
