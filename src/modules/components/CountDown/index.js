import React, { Component } from 'react'

function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val
}

class CountDown extends Component {
  constructor(props) {
    super(props)

    const { lastTime } = this.initTime(props)

    this.state = {
      lastTime,
    }
  }

  componentDidMount() {
    this.tick()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.target !== nextProps.target) {
      clearTimeout(this.timer)
      const { lastTime } = this.initTime(nextProps)
      this.setState({
        lastTime,
      }, () => {
        this.tick()
      })
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  timer = 0
  interval = 1000
  initTime = (props) => {
    let lastTime = 0
    let targetTime = 0
    try {
      if (Object.prototype.toString.call(props.target) === '[object Date]') {
        targetTime = props.target.getTime()
      } else {
        targetTime = new Date(props.target).getTime()
      }
    } catch (e) {
      throw new Error('invalid target prop', e)
    }

    lastTime = targetTime

    return {
      lastTime,
    }
  }
  // defaultFormat = time => (
  //  <span>{moment(time).format('hh:mm:ss')}</span>
  // )
  defaultFormat = (time) => {
    const day = 24 * 60 * 60 * 1000
    const hours = 60 * 60 * 1000
    const minutes = 60 * 1000

    const d = fixedZero(Math.floor(time / day))
    const h = fixedZero(Math.floor((time - day * d) / hours))
    const m = fixedZero(Math.floor(((time - day * d) - (h * hours)) / minutes))
    const s = fixedZero(Math.floor(((time - day * d) - (h * hours) - (m * minutes)) / 1000))
    return (
      <span>{d}天{h}时{m}分{s}秒</span>
    )
  }
  tick = () => {
    const { onEnd } = this.props
    let { lastTime } = this.state

    this.timer = setTimeout(() => {
      if (lastTime < this.interval) {
        clearTimeout(this.timer)
        this.setState({
          lastTime: 0,
        }, () => {
          if (onEnd) {
            onEnd()
          }
        })
      } else {
        lastTime -= this.interval
        this.setState({
          lastTime,
        }, () => {
          this.tick()
        })
      }
    }, this.interval)
  }

  render() {
    const { format = this.defaultFormat, ...rest } = this.props
    const { lastTime } = this.state

    const result = format(lastTime)

    return (<span {...rest}>{result}</span>)
  }
}

export default CountDown
