import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from '../apis'
import { ReduckHelper } from 'Utils/helper'
import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //
const GET_SERVICE_LIST = 'spa/operate/service/GET_SERVICE_LIST'  // 生活服务列表

// ===========================> Actions <=========================== //

export const serviceList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.service.serviceList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_SERVICE_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })

export const updateEnable = (arg, filter) => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.service.updateEnable, arg).then(res => {
    if (res.code === 0) {
      message.success((arg.isEnabled ? '启用' : '禁用') + '成功！')
      dispatch(serviceList(filter))
    } else {
      message.error(res.errmsg)
    }
  })

// ===========================> Reducer <=========================== //

const initialState = {
  ...ReduckHelper.genListState('service', {}),
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_SERVICE_LIST:
      return ReduckHelper.resolveListState('service', state, action.payload)
    default:
      return state
  }
}
