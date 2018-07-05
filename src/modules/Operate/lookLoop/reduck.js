import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from '../apis'
import { ReduckHelper } from 'Utils/helper'
import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //
const GET_LOOK_LOOP_LIST = 'spa/operate/lookLoop/GET_LOOK_LOOP_LIST'  // 频道分类列表
// ===========================> Actions <=========================== //
export const lookLoopList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.lookLoop.lookLoopList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_LOOK_LOOP_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })

export const deleteLookLoop = (arg, filter) => dispatch =>
  fetchData(dispatch)(apis.lookLoop.deleteLookLoop, arg).then(res => {
    if (res.code === 0) {
      message.success('删除成功！')
      dispatch(lookLoopList(filter))
    } else {
      message.error(res.errmsg)
    }
  })

export const addLookLoop = (arg, filter, onCancel) => dispatch =>
  fetchData(dispatch)(apis.lookLoop.addLookLoop, arg).then(res => {
    if (res.code === 0) {
      message.success('新增成功！')
      onCancel && onCancel()
      dispatch(lookLoopList(filter))
    } else {
      message.error(res.errmsg)
    }
  })
// ===========================> Reducer <=========================== //

const initialState = {
  ...ReduckHelper.genListState('lookLoop', {}),
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_LOOK_LOOP_LIST:
      return ReduckHelper.resolveListState('lookLoop', state, action.payload)
    default:
      return state
  }
}
