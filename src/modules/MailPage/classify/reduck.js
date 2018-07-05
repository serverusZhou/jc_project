import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch_mail'
import { mailApi as api } from 'Global/apis'

export const GET_CLASSIFY_LIST = '/spa/classify/GET_CLASSIFY_LIST'
export const GET_CLASSIFY_FIRST_CATEGORY = 'spa/classify/GET_CLASSIFY_FIRST_CATEGORY'

export const getClassifyList = arg => dispatch => {
  fetchData(dispatch, api.classify.List, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(createAction(GET_CLASSIFY_LIST)(res.data))
    }
  })
}

export const getClassifyAdd = (arg, value) => dispatch => {
  fetchData(dispatch, api.classify.Add, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(getClassifyList(value))
      dispatch(getClassify({ businessType: value.businessType }))
    }
  })
}

export const getClassifyModify = (arg, value) => dispatch => {
  fetchData(dispatch, api.classify.modify, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(getClassifyList(value))
      dispatch(getClassify({ businessType: value.businessType }))
    }
  })
}

export const getClassifyDelete = (arg, value) => dispatch => {
  fetchData(dispatch, api.classify.delete, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(getClassifyList(value))
      dispatch(getClassify({ businessType: value.businessType }))
    }
  })
}

export const submitAudit = (arg, value) => dispatch => {
  fetchData(dispatch, api.classify.Audit, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(getClassifyList(value))
      dispatch(getClassify({ businessType: value.businessType }))
    }
  })
}

export const submitRevoke = (arg, value) => dispatch => {
  fetchData(dispatch, api.classify.revoke, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(getClassifyList(value))
      dispatch(getClassify({ businessType: value.businessType }))
    }
  })
}

export const getClassify = arg => dispatch => {
  fetchData(dispatch, api.classify.FirstCategory, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(createAction(GET_CLASSIFY_FIRST_CATEGORY)(res.data))
    }
  })
}

const initialState = {
  List: [],
  FirstCategory: [],
  pagination: {
    current: 1,
    total: 0,
    pageSize: 20,
  }
}

export const classify = function (state = initialState, action) {
  switch (action.type) {
    case GET_CLASSIFY_LIST:
      return {
        ...state,
        List: action.payload.data,
        pagination: {
          showQuickJumper: true,
          current: action.payload.pageNo,
          total: action.payload.records,
          pageSize: action.payload.pageSize,
          showTotal: total => `总共 ${action.payload.records} 条`,
        },
      }
    case GET_CLASSIFY_FIRST_CATEGORY:
      return { ...state, FirstCategory: action.payload }

    default:
      return state
  }
}
