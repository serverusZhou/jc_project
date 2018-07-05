import React, { Component } from 'react'
import styles from '../styles.less'
import classNames from 'classnames'

class Layout10003 extends Component {

  render() {
    const { handlerClick } = this.props
    const clsString = classNames(styles['layoutBase'], styles['layout10003'])
    const { getDataFormArr, dataSource } = this.props
    const layoutbindVOs = dataSource && dataSource.layoutbindVOs
    const indexArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    return (
      <div className={clsString}>
        <ul>
          <li>
            <div />
          </li>
          <li>
            <ul>
              {
                indexArray && indexArray.map((item, index) => {
                  const data = getDataFormArr(layoutbindVOs, item)
                  return (
                    <li key={index}>
                      <div onClick={() => handlerClick(item, data)} className={styles.contentBg}>
                        <span className={styles.contentWrapper}>
                          {data.picUrl && (
                            <img className={styles.logoImg} src={data.picUrl} />
                          )}
                          {data.name && (
                            <div className={styles.contentTxt}>
                              {data.name}
                            </div>
                          )}
                        </span>
                      </div>
                    </li>
                  )
                })
              }
            </ul>
          </li>
        </ul>
      </div>
    )
  }
}

export default Layout10003
