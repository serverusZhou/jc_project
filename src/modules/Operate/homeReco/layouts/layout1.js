// import { moduleEnum } from '../advertise/dict'
import React, { Component } from 'react'
import classNames from 'classnames'
// import * as urls from 'Global/urls'
// import { Link } from 'react-router-dom'
// import {
//   Row,
//   li
//   } from 'antd'
// import { connect } from 'react-redux'
import styles from '../styles.less'

class Layout1 extends Component {

  render() {
    const { handlerClick } = this.props
    const clsString = classNames(styles['layoutBase'], styles['layout01'])
    const { getDataFormArr, dataSource } = this.props
    const layoutbindVOs = dataSource.layoutbindVOs
    const data1 = getDataFormArr(layoutbindVOs, 1)
    return (
      <div className={clsString}>
        <ul>
          <li>
            <div onClick={() => handlerClick(1, data1)} style={{ position: 'relative' }}>
              {data1.picUrl && (
                <img src={data1.picUrl} style={{ width: '100%', height: '100%' }} />
              )}
              {data1.name && (
                <div style={{ color: '#ffffff', padding: 15, background: 'rgba(0,0,0,.45)', position: 'absolute', bottom: 0, right: 0, left: 0, width: '100%', height: 'auto' }}>
                  {data1.name}
                </div>
              )}
            </div>
          </li>
          <li>
            <ul>
              {[2, 3, 4, 5].map((item, index) => {
                const data = getDataFormArr(layoutbindVOs, item)
                return (
                  <li key={index}>
                    <div onClick={() => handlerClick(item, data)} style={{ position: 'relative' }}>
                      {data.picUrl && (
                        <img src={data.picUrl} style={{ width: '100%', height: '100%' }} />
                      )}
                      {data.name && (
                        <div style={{ color: '#ffffff', padding: 15, background: 'rgba(0,0,0,.45)', position: 'absolute', bottom: 0, right: 0, left: 0, width: '100%', height: 'auto' }}>
                          {data.name}
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </li>
        </ul>
      </div>
    )
  }
}

export default Layout1
