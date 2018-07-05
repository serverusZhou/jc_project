import React, { Component } from 'react'
import { Icon, Input } from 'antd'
import styles from './style.css'

export default class EditableCell extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
      editable: false,
      changed: null
    }
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.value !== this.state.value) {
      this.setState({ value: nextProp.value })
    }
  }

  handleChange = (e) => {
    let value = e.target.value
    value = value.replace(/[\D]/g, '')
    if (!value && value !== this.state.value) {
      this.setState({
        value: '',
        changed: true
      })
    } else if (value && value !== this.state.value) {
      this.setState({
        value: value * 1,
        changed: true
      })
    }
  }

  check = () => {
    this.setState({ editable: false })
    if (this.state.changed) {
      this.props.onCheck(this.state.value)
      this.setState({
        changed: false
      })
    }
  }

  edit = () => {
    this.setState({ editable: true })
  }

  render() {
    const { value, editable } = this.state
    return (
      <div className={styles['editable-cell']}>
        {
          editable ? (
            <div className={styles['editable-cell-input-wrapper']}>
              <Input
                maxLength={4}
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon
                type='check'
                className={styles['editable-cell-icon-check']}
                onClick={this.check}
              />
            </div>
          ) : (
            <div className={styles['editable-cell-text-wrapper']}>
              {value || ' '}
              <Icon
                type='edit'
                className={styles['editable-cell-icon']}
                onClick={this.edit}
              />
            </div>
          )
        }
      </div>
    )
  }
}
