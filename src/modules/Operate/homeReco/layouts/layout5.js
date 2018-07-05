// import { moduleEnum } from '../advertise/dict'
import React, { Component } from 'react'
// import * as urls from 'Global/urls'
// import { Link } from 'react-router-dom'
// import {
//   Row,
//   li
//   } from 'antd'
// import { connect } from 'react-redux'
import styles from '../styles.less'
import classNames from 'classnames'

class Layout5 extends Component {

  render() {
    const { handlerClick } = this.props
    const clsString = classNames(styles['layoutBase'], styles['layout05'])
    const { getDataFormArr, dataSource } = this.props
    const layoutbindVOs = dataSource.layoutbindVOs
    const indexArray = [1, 2, 3]
    return (
      <div className={clsString}>
        <ul>
          {
            indexArray && indexArray.map((item, index) => {
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
            })
          }
        </ul>
      </div>
    )
  }
}

export default Layout5
