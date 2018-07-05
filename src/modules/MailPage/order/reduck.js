import { mailApi as api } from 'Global/apis'
import fetchData from 'Utils/fetch_mail'
import { message } from 'antd'
import { createAction } from 'redux-actions'

// ===========================> Action Types <=========================== //

export const GET_ORDER_LIST = '/spa/refund/GET_ORDER_LIST'
export const GET_ORDER_DETAIL = '/spa/refund/GET_ORDER_DETAIL'
export const GET_SHOP_LIST = '/spa/refund/GET_SHOP_LIST'

// ===========================> Actions <=========================== //

export const getList = data => createAction(GET_ORDER_LIST)({ list: data.data, filterData: data.filter })

export const getOrderList = args => dispatch => {
  return fetchData(dispatch, api.order.list, args).then(res => {
    if (res.code === 0) {
      dispatch(getList({ data: res.data, filter: args }))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const getShopList = args => dispatch => {
  return fetchData(dispatch, api.order.shopList, args).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_SHOP_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const getOrderDetail = args => dispatch => {
  return fetchData(dispatch, api.order.detail, args).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_ORDER_DETAIL)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// ===========================> Reducer <=========================== //

let initialState = {
  list: { data: [] },
  filterData: {},
  detail: {},
  shopList: []
}

// 列表的reducer
export const order = (state = initialState, action) => {
  switch (action.type) {
    case GET_ORDER_LIST:
      return { ...state, list: action.payload.list, filterData: action.payload.filterData }
    case GET_ORDER_DETAIL:
      return { ...state, detail: action.payload }
    case GET_SHOP_LIST:
      return { ...state, shopList: action.payload }
    default:
      return state
  }
}
