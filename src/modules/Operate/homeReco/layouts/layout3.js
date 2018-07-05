import React, { Component } from 'react'
import styles from '../styles.less'
import classNames from 'classnames'

class Layout3 extends Component {

  render() {
    const { handlerClick } = this.props
    const clsString = classNames(styles['layoutBase'], styles['layout03'])
    const { getDataFormArr, dataSource } = this.props
    const layoutbindVOs = dataSource.layoutbindVOs
    const data1 = getDataFormArr(layoutbindVOs, 1)
    const data2 = getDataFormArr(layoutbindVOs, 2)
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
            <div onClick={() => handlerClick(2, data2)} style={{ position: 'relative' }}>
              {data2.picUrl && (
                <img src={data2.picUrl} style={{ width: '100%', height: '100%' }} />
              )}
              {data2.name && (
                <div style={{ color: '#ffffff', padding: 15, background: 'rgba(0,0,0,.45)', position: 'absolute', bottom: 0, right: 0, left: 0, width: '100%', height: 'auto' }}>
                  {data2.name}
                </div>
              )}
            </div>
          </li>
        </ul>
        <ul>
          {[3, 4, 5, 6, 7, 8].map((item, index) => {
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
      </div>
    )
  }
}

export default Layout3
