import React, { Component } from 'react'
import { Carousel } from 'antd'
import styles from '../styles.less'
import classNames from 'classnames'
import { handleImgUrl } from 'Utils/ottUtils'

class Layout1 extends Component {

  render() {
    const { handlerClick } = this.props
    const clsString = classNames(styles['layoutBase'], styles['layout01'])
    const { dataSource } = this.props
    // 整合循环loop、构建新的二维数组
    let loopArray = []
    for (let index = 0; index < Number(dataSource.loop); index++) {
      loopArray[index] = dataSource.videos.filter((video, num) => num >= index * 4 && num < (index + 1) * 4)
    }
    const carouselList = loopArray.map((loop, index) => {
      return (
        <div key={index + 1}>
          <div className={clsString}>
            <ul>
              {
                loop.map((item, num) => {
                  return (
                    <li key={num}>
                      <div onClick={() => handlerClick(num)}>
                        {item.imageUrl && <img src={handleImgUrl(item.imageUrl)} />}
                        {item.name && <div>{item.name}</div>}
                      </div>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div>
      )
    })
    return (
      <div>{loopArray.length > 1 ? <Carousel>{carouselList}</Carousel> : <div>{carouselList}</div>}</div>
    )
  }
}

export default Layout1
