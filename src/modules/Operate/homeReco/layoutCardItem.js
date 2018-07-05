import React, { Component } from 'react'
// import { Row, Col } from 'antd'
import { showModalWrapper } from 'Components/modal/ModalWrapper'

// import AddLayoutForm from './addLayoutForm'
import BoundContent from './boundContent'
// import * as { Layout1, Layout2, Layout3, Layout4, Layout5 } from './layouts/index'
import Layout1 from './layouts/layout1'
import Layout2 from './layouts/layout2'
import Layout3 from './layouts/layout3'
import Layout4 from './layouts/layout4'
import Layout5 from './layouts/layout5'
import Layout6 from './layouts/layout6'
import Layout10001 from './layouts/layout10001'
import Layout10002 from './layouts/layout10002'
import Layout10003 from './layouts/layout10003'
import { deleteLayout } from './reduck'
import { isEmpty } from 'Utils/lang'

const style = {
  // border: '1px dashed gray',
  // padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

class LayoutCardItem extends Component {
  _showModal = (sort, layoutId, itemData, dataSourceType) => {
    const { aliToken } = this.props
    showModalWrapper((
      <BoundContent
        itemData={itemData}
        sort={sort}
        layoutId={layoutId}
        bindContent={this.props.bindContent}
        dataSourceType={dataSourceType}
        aliToken={aliToken}
      />
    ), {
      title: isEmpty(itemData) ? '添加' : '修改',
      width: 800
    })
  }

  _handlerClick(sort, layoutId, itemData, dataSourceType) {
    if (this.props.isPreview) {
      return false
    }
    this._showModal(sort, layoutId, itemData, dataSourceType)
  }

  getDataFormArr = (arr, index, defaultValue = {}) => {
    const i = arr.findIndex(item => item.sort + '' === index + '')
    if (i > -1) {
      return arr[i]
    }
    return defaultValue
  }

  _handleDelete = (layoutId) => {
    this.props.dispatch(deleteLayout({ layoutId }, this.props.channelId))
  }

  render() {
    const {
      dataSource,
      isPreview
    } = this.props
    let Layout = () => {
      return (
        <div style={{ ...style }}>
          暂无布局
        </div>
      )
    }
    switch (dataSource.type) {
      case 1: {
        Layout = Layout1
        break
      }
      case 2: {
        Layout = Layout2
        break
      }
      case 3: {
        Layout = Layout3
        break
      }
      case 4: {
        Layout = Layout4
        break
      }
      case 7:
      case 5: {
        Layout = Layout5
        break
      }
      case 6: {
        Layout = Layout6
        break
      }
      case 10001: {
        Layout = Layout10001
        break
      }
      case 10002: {
        Layout = Layout10002
        break
      }
      case 10003: {
        Layout = Layout10003
        break
      }
      default: {
        break
      }
    }
    return (
      <div style={{ ...style }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 20px' }}>
          <div>{dataSource.name}</div>
          <div>
            {!isPreview && ![10001, 10002, 10003].includes(dataSource.type) && (<a onClick={() => this._handleDelete(dataSource.layoutId)}>删除</a>)}
          </div>
        </div>
        <Layout
          getDataFormArr={this.getDataFormArr}
          dataSource={dataSource}
          handlerClick={(sort, itemData) => this._handlerClick(sort, dataSource.layoutId, itemData, dataSource.type)}
        />
      </div>
    )
  }
}

export default LayoutCardItem
