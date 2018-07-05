import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Popconfirm } from 'antd'

import { genPlanColumn, genPagination } from 'Utils/helper'
import Filter from 'Components/Filter'
import noImage from 'Assets/images_mall/no-image.png'
import { gameList, onlineGame, outlineGame } from './reduck'

class Game extends Component {

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(gameList({ pageSize: 10, currentPage: 1 }))
  }

  _handleEnable = (gameId, shelveStatus) => {
    const { filter, dispatch } = this.props
    let requestFn = onlineGame
    if (shelveStatus + '' === '1') {
      requestFn = outlineGame
    }
    dispatch(requestFn({ gameId }, filter))
  }

  _columns = [
    genPlanColumn('cover169Url', '封面图', {
      render: (text) => {
        return (<img src={text || noImage} alt='加载失败' style={{ width: 80, height: 80 }} />)
      }
    }),
    genPlanColumn('gameName', '游戏名称'),
    genPlanColumn('gameType', '游戏类型'),
    genPlanColumn('rightAge', '适龄'),
    genPlanColumn('sort', '排序'),
    // genPlanColumn('briefInfo', '简介'),
    genPlanColumn('gameVersion', '软件版本号'),
    genPlanColumn('gameSize', '软件大小'),
    genPlanColumn('gameLang', '软件语言'),
    genPlanColumn('shelveStatus', '状态', {
      render: text => (
        <span>{text + '' === '1' ? '已上架' : '已下架'}</span>
      )
    }),
    genPlanColumn('modifyTime', '更新时间'),
    genPlanColumn('operateUser', '操作人'),
    genPlanColumn('operate', '操作', {
      render: (text, record) => {
        return (
          <Popconfirm
            placement='topRight'
            title={`确定要${record.shelveStatus + '' === '1' ? '下架' : '上架'}该游戏吗？`}
            onConfirm={() => this._handleEnable(record.gameId, record.shelveStatus)}
          >
            <a>{record.shelveStatus + '' === '1' ? '下架' : '上架'}</a>
          </Popconfirm>
        )
      },
      width: 100
    }),
  ]

  _handleSearch = searchData => {
    const { filter } = this.props
    const finalFilter = Object.assign(
      {},
      filter,
      searchData,
      {
        gameName: searchData.gameName && searchData.gameName.trim(),
        currentPage: 1
      })
    this.props.dispatch(gameList(finalFilter))
  }

  _handleChange = (pagination, filters, sorter) => {
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(gameList(finalFilter))
  }

  _genFilterFields = (filter) => {
    const fields = [
      {
        key: 'gameName',
        label: '游戏名称',
        initialValue: '',
        type: 'Input',
      }
    ]

    return fields
  }

  render() {
    const { showListSpin, list, filter, page } = this.props
    const fields = this._genFilterFields(filter)
    const pagination = genPagination(page)

    return (
      <div>
        <Filter
          fields={fields}
          onSearch={this._handleSearch}
        />
        <Table
          pagination={pagination}
          columns={this._columns}
          onChange={this._handleChange}
          rowKey='gameId'
          dataSource={list}
          loading={showListSpin}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,
    list: state.operate.game.gameList,
    filter: state.operate.game.gameFilter,
    page: state.operate.game.gamePage,
    preRouter: state.router.pre
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Game)
