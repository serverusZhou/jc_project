import React from 'react'
import { connect } from 'react-redux'
import { Carousel } from 'antd'
import ImageModal from './imageModal'
import * as action from './reduck'
import { fetchQiniuToken } from 'Global/globalReduck'
import { isEmpty } from 'Utils/lang'
import styles from './index.less'
import homeBGImg from 'Assets/images_mall/bg-home.jpg'

class Home extends React.Component {
  state = {
    isShowModal: false,
    modalLoading: false,
    info: {},
    height1: '',
    height4: ''
  }

  componentDidMount() {
    this.props.dispatch(action.getList()).then(res => {
      if (res.code === 0 && !isEmpty(res.data)) {
        const Width1 = this.refs.card1.offsetWidth
        const Width4 = this.refs.card4.offsetWidth
        const height1 = Width1 * 520 / 922
        const height4 = Width4 * 268 / 566
        this.setState({ height1, height4 })
      }
    })
    this.props.dispatch(fetchQiniuToken())
  }

  updateModal = (isShow, data) => {
    this.setState({ isShowModal: isShow, info: data || {}})
  }

  handleSubmit = updataInfo => {
    this.setState({ modalLoading: true })
    this.props.dispatch(action.updateInfo(updataInfo)).then(res => {
      this.setState({ modalLoading: false })
      if (res.code === 0) {
        this.props.dispatch(action.getList())
        this.setState({ isShowModal: false })
      }
    })
  }

  renderCarousel = (list, slideShow, height1) => {
    return (
      <div
        ref='card1'
        className='home-card1'
        style={{ height: height1 }}
        onClick={() => this.updateModal(true, list[0])}
        title='点击更新信息'
      >
        {slideShow[0].homePagePicRes.length > 0 &&
          slideShow[0].homePagePicRes.length === 1 && (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: `url(${slideShow[0].homePagePicRes[0].url}) no-repeat center / cover`
              }}
            />
          )}
        {slideShow[0].homePagePicRes.length > 1 && (
          <Carousel autoplay={slideShow[0].homePagePicRes.length > 1} className={styles['jc-carosel']}>
            {slideShow[0].homePagePicRes.map(item => {
              return <div key={item.picId} style={{ background: `url(${item.url}) no-repeat center / cover` }} />
            })}
          </Carousel>
        )}
        {!isEmpty(slideShow[0].url) && (
          <div className='home-card-text-url'>
            URL地址：<h6>{slideShow[0].url}</h6>
          </div>
        )}
        {slideShow[0].homePagePicRes.length === 0 && <p>轮播图，点击更新</p>}
      </div>
    )
  }

  renderSinglePic = item => {
    if (item.homePagePicRes.length > 0) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `url(${item.homePagePicRes[0].url}) no-repeat center / cover`
          }}
        />
      )
    } else {
      return <p>点击更新</p>
    }
  }

  render() {
    const { qiniuToken, list } = this.props
    const { height1, height4, info, modalLoading, isShowModal } = this.state
    if (isEmpty(list)) {
      return <div>暂无数据！</div>
    } else {
      // 过滤掉轮播图，遍历剩下的
      const slideShow = list.filter(i => {
        return i.posId === 1
      })
      const list2 = list.filter(i => {
        return i.posId !== 1
      })
      return (
        <div>
          <div className='home-wrap'>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                background: `url(${homeBGImg}) no-repeat top left / cover`
              }}
            />
            <div className='home-card-wrap'>
              {this.renderCarousel(list, slideShow, height1)}
              {!isEmpty(list2) &&
                list2.map(item => {
                  return (
                    <div
                      ref={`card${item.posId}`}
                      className='home-card'
                      key={item.posId}
                      style={{ height: item.posId === 2 || item.posId === 3 ? height1 : height4 }}
                      onClick={() => this.updateModal(true, item)}
                      title='点击更新信息'
                    >
                      {this.renderSinglePic(item)}
                      {!isEmpty(item.url) && (
                        <div className='home-card-text-url'>
                          URL地址：<h6>{item.url}</h6>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
          <ImageModal
            qiniuToken={qiniuToken}
            info={info}
            modalLoading={modalLoading}
            isShowModal={isShowModal}
            hideModal={() => this.updateModal(false)}
            onSubmit={this.handleSubmit}
          />
        </div>
      )
    }
  }
}

const mapStateToProps = ({ globalReduck, home }) => ({
  qiniuToken: globalReduck.qiniuToken,
  list: home.list
})

export default connect(mapStateToProps)(Home)
