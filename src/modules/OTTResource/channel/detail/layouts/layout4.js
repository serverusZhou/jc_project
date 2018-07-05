import React, { Component } from 'react'
import styles from '../styles.less'
import classNames from 'classnames'
import { handleImgUrl } from 'Utils/ottUtils'

class Layout4 extends Component {

  render() {
    const { handlerClick } = this.props
    const clsString = classNames(styles['layoutBase'], styles['layout02'])
    const { dataSource } = this.props
    return (
      <div className={clsString}>
        <p>layout4</p>
        <ul>
          {dataSource.videos.map((item, index) => {
            return (
              <li key={index}>
                <div onClick={() => handlerClick(num)} style={{ position: 'relative' }}>
                  {item.imageUrl && (
                    <img src={handleImgUrl(item.imageUrl)} style={{ width: '100%', height: '100%' }} />
                  )}
                  {item.name && (
                    <div style={{ color: '#ffffff', padding: 15, background: 'rgba(0,0,0,.45)', position: 'absolute', bottom: 0, right: 0, left: 0, width: '100%', height: 'auto' }}>
                      {item.name}
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

export default Layout4
