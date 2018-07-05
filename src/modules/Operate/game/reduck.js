import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from '../apis'
import { ReduckHelper } from 'Utils/helper'
import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //
const GET_GAME_LIST = 'spa/operate/game/GET_GAME_LIST'  // 频道分类列表
// ===========================> Actions <=========================== //
export const gameList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.game.gameList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_GAME_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })

export const onlineGame = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.game.onlineGame, arg).then(res => {
    if (res.code === 0) {
      message.success('上架成功！')
      dispatch(gameList(filter))
    } else {
      message.error(res.errmsg)
    }
  })

export const outlineGame = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.game.outlineGame, arg).then(res => {
    if (res.code === 0) {
      message.success('下架成功！')
      dispatch(gameList(filter))
    } else {
      message.error(res.errmsg)
    }
  })
// ===========================> Reducer <=========================== //

const initialState = {
  ...ReduckHelper.genListState('game', {}),
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_GAME_LIST:
      return ReduckHelper.resolveListState('game', state, action.payload)
    default:
      return state
  }
}
