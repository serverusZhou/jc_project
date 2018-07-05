import React, { Component } from 'react'
import { Divider } from 'antd'

import Layout1 from './layouts/layout1'
import Layout2 from './layouts/layout2'
import Layout3 from './layouts/layout3'
import Layout4 from './layouts/layout4'
import Layout5 from './layouts/layout5'
import Layout6 from './layouts/layout6'
import Layout7 from './layouts/layout7'

const style = { marginBottom: '.5rem', backgroundColor: 'white', cursor: 'move' }

const layOutMap = { 1: Layout1, 2: Layout2, 3: Layout3, 4: Layout4, 5: Layout5, 6: Layout6, 7: Layout7 }

class LayoutCardItem extends Component {
  render() {
    const { item, isPreview } = this.props
    let Layout = layOutMap[Number(item.layoutId)] || (() => <div style={{ ...style }}> 暂无布局 </div>)
    return (
      <div style={{ ...style }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 20px' }}>
          <div>{item.layoutName}</div>
          <div>
            {!isPreview && (
            <div>
              <a onClick={this.props.editModule}>编辑</a>
              <Divider type='vertical' />
              <a onClick={this.props.deleteModule}>删除</a>
            </div>
            )}
          </div>
        </div>
        <Layout dataSource={item} handlerClick={this.props.editVideo} />
      </div>
    )
  }
}

export default LayoutCardItem
