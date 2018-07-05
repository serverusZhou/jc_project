import React, { Component } from 'react'
import styles from '../styles.less'
import classNames from 'classnames'

class Layout10001 extends Component {
  _numArray = length => Array.from({ length }, (v, k) => ++k)

  render() {
    const { handlerClick } = this.props
    const clsString = classNames(styles['layoutBase01'], styles['layout10001'])
    const { getDataFormArr, dataSource } = this.props
    const num = dataSource && dataSource.num
    const layoutbindVOs = dataSource && dataSource.layoutbindVOs
    const indexArray = this._numArray(num)
    // 如果效果为均分，则给li标签赋值下面width
    // const width3Float = (100 / num).toFixed(3)
    // const width = width3Float.substring(0, width3Float.lastIndexOf('.') + 3)
    return (
      <div className={clsString}>
        <div className={styles['wrapper']}>
          {
            indexArray && indexArray.map((item, index) => {
              const data = getDataFormArr(layoutbindVOs, item)
              return (
                <div key={index} className={styles['content']}>
                  <div onClick={() => handlerClick(item, data)} style={{ position: 'relative' }}>
                    {data.picUrl && (
                      <img src={data.picUrl} style={{ width: '100%', height: '100%', verticalAlign: 'baseline' }} />
                    )}
                    {data.name && (
                      <div style={{ color: '#ffffff', padding: 15, background: 'rgba(0,0,0,.45)', position: 'absolute', bottom: 0, right: 0, left: 0, width: '100%', height: 'auto' }}>
                        {data.name}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default Layout10001
