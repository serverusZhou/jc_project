import React, { Component } from 'react'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd'
import { Table, Divider, Button, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
import * as urls from 'Global/urls'
import HTML5Backend from 'react-dnd-html5-backend'

const DragSingleton = DragDropContext(HTML5Backend)
let DragWapper = (props) => {
  let { connectDragSource, connectDropTarget, ...restProps } = props
  restProps = Object.assign({}, restProps)
  delete restProps.isOver
  delete restProps.dragRow
  delete restProps.moveRow
  delete restProps.clientOffset
  delete restProps.sourceClientOffset
  delete restProps.initialClientOffset
  return connectDragSource(
      connectDropTarget(<tr key={restProps.rowKey} {...restProps} />)
  )
}

DragWapper = DropTarget('row', {
  drop(props, monitor) {
    const obj = monitor.getItem()
    obj.moveRow(props.item, obj.item)
  },
}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset(),
}))(
  DragSource('row', {
    beginDrag(props) {
      return { item: props.item, moveRow: props.moveRow }
    },
  }, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }))(DragWapper)
)

class ModuleTable extends Component {
  _columns = [
    {
      title: '模块名称',
      dataIndex: 'layoutName',
      key: 'layoutName',
    }, {
      title: '状态',
      dataIndex: 'isEnable',
      key: 'isEnable',
      render: (value, record) => {
        return value ? '已启用' : '未启用'
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record, index) => (
        <div>
          <Popconfirm
            title='确认删除此模块吗?'
            onConfirm={() => this.props.deleteModule(index)}
            okText='确认'
            cancelText='取消'
          >
            <a href='javascript:;'>删除</a>
          </Popconfirm>
        </div>
          ),
    }
  ]
  moveRow = (target, source) => {
    this.props.sort(source, target)
  }
  render() {
    return (
      <div>
        <Table
          size={'small'}
          bordered={true}
          columns={this._columns}
          pagination={false}
          rowKey={(record, index) => index + Math.floor(Math.random() * 1000)}
          components={{
            body: {
              row: DragWapper,
            },
          }}
          onRow={(record, index) => ({
            moveRow: this.moveRow,
            item: {
              ...record,
              index
            }
          })}
          {...this.props}
        />
      </div>
    )
  }
}

class ChannelTable extends Component {
  _columns = [
    {
      title: '频道名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href='javascript:;' onClick={() => this.props.editMehod(record)}>编辑</a>
          <Divider type='vertical' />
          <a href='javascript:;' onClick={() => this.props.deleteMethod(record)}>删除</a>
          <Divider type='vertical' />
          <Link key='1' to={`${urls.OTT_CHANNEL}/edit/${record.id}`}>进入模块</Link>
        </span>
          ),
    }
  ]
  render() {
    return (
      <div>
        <Table
          size={'small'}
          bordered={true}
          columns={this._columns}
          pagination={false}
          rowKey={(record, index) => index + Math.floor(Math.random() * 1000)}
          components={{
            body: {
              row: DragWapper,
            },
          }}
          onRow={(record, index) => ({
            index,
            moveRow: this.moveRow,
          })}
          {...this.props}
        />
        <Button
          type='dashed' style={{ width: '100%', marginBottom: 8, height: 35, marginTop: 8, marginLeft: 0 }} icon='plus'
          onClick={this.props.addMethod}
        >添加子频道</Button>
      </div>
    )
  }
}
export const MainChannelModuleTable = DragSingleton(ModuleTable)
export const ChildChannelTable = DragSingleton(ChannelTable)
