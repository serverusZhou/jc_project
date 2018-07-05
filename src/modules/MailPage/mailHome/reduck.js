import fetchData from 'Utils/fetch_mail'
import { createAction } from 'redux-actions'
import { message } from 'antd'
import { mailApi as api } from 'Global/apis'

// ====================> Action Types <==================== //
const GET_LIST = '/spa/home/GET_LIST'

// ====================> Action <==================== //
export const getList = () => dispatch => {
  return fetchData(dispatch, api.home.list).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      console.log(res.data)
      dispatch(createAction(GET_LIST)(res.data))
    }
    return res
  })
}

export const updateInfo = updataInfo => dispatch => {
  return fetchData(dispatch, api.home.update, updataInfo).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    }
    return res
  })
}

// ====================> Reducer <==================== //

const initialState = {
  list: []
}

export const home = (state = initialState, action) => {
  switch (action.type) {
    case GET_LIST:
      return { ...state, list: action.payload }
    default:
      return state
  }
}
