import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from '../apis'
import { ReduckHelper } from 'Utils/helper'
import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //
const GET_ORDER_LIST = 'spa/operate/order/GET_ORDER_LIST'  // 订单列表
// ===========================> Actions <=========================== //
export const orderList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.order.orderList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_ORDER_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })

export const refund = arg => dispatch => {
  return new Promise((resolve) => {
    fetchData(apis.order.refund, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}
  
// ===========================> Reducer <=========================== //

const initialState = {
  ...ReduckHelper.genListState('order', {}),
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_ORDER_LIST:
      return ReduckHelper.resolveListState('order', state, action.payload)
    default:
      return state
  }
}
