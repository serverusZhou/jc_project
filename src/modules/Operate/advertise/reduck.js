import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from '../apis'
import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

const GET_ADVERTISE_LIST = 'Operate/advertise/GET_ADVERTISE_LIST'
export const GET_ADVERTISE_DETAILS = 'Operate/advertise/GET_ADVERTISE_DETAILS'
const GET_ADVERTISE_CLASSIFY_LIST = 'Operate/advertise/GET_ADVERTISE_CLASSIFY_LIST'
const GET_ALL_POSITION_LIST = 'Operate/advertise/GET_ALL_POSITION_LIST'

// ===========================> Actions <=========================== //
// 广告
export const getAdList = arg => dispatch => {
  return new Promise(function (resolve) {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.advertise.list, arg, '加载中...').then(res => {
      if (res.code === 0) {
        resolve({ status: 'success' })
        dispatch(createAction(GET_ADVERTISE_LIST)({ ...res.data, filter: arg }))
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

export const getAdDetails = arg => dispatch => {
  return new Promise(function (resolve) {
    return fetchData(dispatch)(apis.advertise.details, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success', adDetail: res.data })
        dispatch(createAction(GET_ADVERTISE_DETAILS)({ ...res.data }))
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

export const AddAd = arg => dispatch => {
  return new Promise(function (resolve) {
    fetchData(dispatch)(apis.advertise.add, arg, '上传中...').then(res => {
      if (res.code === 0) {
        message.success('操作成功', 1, () => {
          history.go(-1)
        })
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

export const EditAd = arg => dispatch => {
  return new Promise(function (resolve) {
    fetchData(dispatch)(apis.advertise.edit, arg).then(res => {
      if (res.code === 0) {
        message.success('操作成功', 1, () => {
          history.go(-1)
        })
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

export const handlerAd = arg => dispatch => {
  return new Promise(function (resolve) {
    fetchData(dispatch)(apis.advertise.operate, arg).then(res => {
      if (res.code === 0) {
        message.success('操作成功')
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

export const deleteAd = arg => dispatch => {
  return new Promise(function (resolve) {
    fetchData(dispatch)(apis.advertise.deleteAd, arg).then(res => {
      if (res.code === 0) {
        message.success('操作成功')
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

export const enableAd = arg => dispatch => {
  return new Promise(function (resolve) {
    fetchData(dispatch)(apis.advertise.enableAd, arg, '上传中').then(res => {
      if (res.code === 0) {
        message.success('操作成功')
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 广告位
export const getAdClassifyList = arg => dispatch => {
  return new Promise(function (resolve) {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.advertise.classify.list, arg, '加载中...').then(res => {
      if (res.code === 0) {
        resolve({ status: 'success' })
        dispatch(createAction(GET_ADVERTISE_CLASSIFY_LIST)({ ...res.data, filter: arg }))
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

export const getAllAdPositionList = arg => dispatch => {
  return new Promise(function (resolve) {
    return fetchData(apis.advertise.allPositionList, arg, '加载中...').then(res => {
      if (res.code === 0) {
        resolve({ status: 'success' })
        dispatch(createAction(GET_ALL_POSITION_LIST)({ ...res }))
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

export const AddAdClassify = (arg) => dispatch => {
  return new Promise(function (resolve) {
    fetchData(dispatch)(apis.advertise.classify.add, arg, '上传中').then(res => {
      if (res.code === 0) {
        message.success('新增成功')
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

export const EditAdClassify = (arg) => dispatch => {
  return new Promise(function (resolve) {
    fetchData(dispatch)(apis.advertise.classify.edit, arg, '上传中').then(res => {
      if (res.code === 0) {
        message.success('编辑成功')
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

export const handlerAdClassify = arg => dispatch => {
  return new Promise(function (resolve) {
    fetchData(dispatch, SHOW_LIST_SPIN)(apis.advertise.classify.operate, arg, '上传中').then(res => {
      if (res.code === 0) {
        message.success('操作成功')
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

export const deleteAdClassify = arg => dispatch => {
  return new Promise(function (resolve) {
    fetchData(dispatch)(apis.advertise.classify.deletePosition, arg, '上传中').then(res => {
      if (res.code === 0) {
        message.success('操作成功')
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

}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_ADVERTISE_LIST: {
      return { ...state, adsList: action.payload.data, adFilter: action.payload.filter, adPagination: { pages: action.payload.pages, records: action.payload.records, pageNo: action.payload.pageNo, pageSize: action.payload.pageSize }}
    }
    case GET_ADVERTISE_DETAILS: {
      return { ...state, adDetails: action.payload }
    }
    case GET_ADVERTISE_CLASSIFY_LIST: {
      return { ...state, adsClassifyList: action.payload.data, adsClassifyFilter: action.payload.filter, adsClassifyPagination: { pages: action.payload.pages, records: action.payload.records, pageNo: action.payload.pageNo, pageSize: action.payload.pageSize }}
    }
    case GET_ALL_POSITION_LIST: {
      return { ...state, allPositionList: action.payload.data }
    }
    default:
      return state
  }
}
