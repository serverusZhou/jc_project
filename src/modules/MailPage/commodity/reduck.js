import fetchData from 'Utils/fetch_mail'
import { mailApi as api } from 'Global/apis'
import { createAction } from 'redux-actions'
import { push } from 'react-router-redux'
import { notification } from 'antd'
import * as url from 'Global/urls'
// import * as url from 'Global/routepath'
import { setPropertys } from './propertyReduck'

// ===========================> Action Types <=========================== //

export const GET_COMMODITY_LIST = 'spa/commodity/GET_COMMODITY_LIST'
export const SET_COMMODITY_LIST_LOCAL = 'spa/commodity/SET_COMMODITY_LIST_LOCAL'
export const EBOOKING_RESET_FIELDS = 'spa/commodity/EBOOKING_RESET_FIELDS'
export const SET_COMMODITY_DETAIL = 'spa/commodity/SET_COMMODITY_DETAIL'
export const SET_CATEGORY_TREE = 'spa/commodity/SET_CATEGORY_TREE'

// ===========================> Actions <=========================== //
// 查
export const list = args => dispatch => {
  return fetchData(dispatch, api.commodity.list, args).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_COMMODITY_LIST)({ data: res.data, filterData: args }))
    } else {
      notification['error']({ message: '失败', description: res.errmsg })
    }
  })
}
export const getListFromStore = () => (dispatch, getState) => {
  const filter = getState().commodity.filterData
  dispatch(list(filter))
}

// 商品上下架
export const updateStatus = args => dispatch => {
  return fetchData(dispatch, api.commodity.updateStatus, args).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_COMMODITY_LIST_LOCAL)({ goodsIds: [args.goodsId], status: args.status }))
    } else {
      notification['error']({ message: '失败', description: res.errmsg })
    }
  })
}

// 提交审核
export const sendAudit = args => dispatch => {
  return fetchData(dispatch, api.commodity.sendAudit, args).then(res => {
    if (res.code === 0) {
      dispatch(getListFromStore())
    } else {
      notification['error']({ message: '失败', description: res.errmsg })
    }
    return res
  })
}

// 删除
export const deleteCommodity = args => dispatch => {
  return fetchData(dispatch, api.commodity.delete, args).then(res => {
    if (res.code === 0) {
      dispatch(getListFromStore())
    } else {
      notification['error']({ message: '失败', description: res.errmsg })
    }
    return res
  })
}

// 撤销审核
export const reverseAudit = args => dispatch => {
  return fetchData(dispatch, api.commodity.reverseAudit, args).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_COMMODITY_LIST_LOCAL)({ goodsIds: args.goodsIdList, auditStatus: '1' }))
    } else {
      notification['error']({ message: '失败', description: res.errmsg })
    }
  })
}

// 获取详情
export const getDetail = args => dispatch => {
  return fetchData(dispatch, api.commodity.detail, args).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_COMMODITY_DETAIL)(res.data))
      let selectGroupIds = []
      if (res.data.propertyPull[0] && res.data.propertyPull[0].length > 0) {
        selectGroupIds = res.data.propertyPull.map(item => {
          return item.filter(property => property.isCheck).map(property => property.groupId)[0]
        })
      }
      const propertyList = []
      res.data.propertyPull.forEach((m, i) => {
        m.forEach((k, n) => {
          if (k.isCheck === 1) {
            const groupList = []
            k.item &&
              k.item.forEach(m => {
                if (m.isCheck === 1) {
                  groupList.push(m.propertyId)
                }
              })
            propertyList.push(groupList)
          }
        })
      })
      dispatch(
        setPropertys({
          property: propertyList,
          propertyPull: res.data.propertyPull,
          propertyColumns: res.data.property.column || [],
          propertyRows: res.data.property.table || [],
          groupIds: selectGroupIds
        })
      )
    } else {
      notification['error']({ message: '失败', description: res.errmsg })
    }
    return res
  })
}

// 增
export const addCommodity = args => dispatch => {
  return fetchData(dispatch, api.commodity.add, args).then(res => {
    if (res.code === 0) {
      dispatch(push(url.COMMODITY_LIST))
      notification['success']({ message: '成功', description: '新增成功' })
      return res
    } else {
      notification['error']({ message: '失败', description: res.errmsg })
    }
  })
}
// 改
export const updateCommodity = args => dispatch => {
  return fetchData(dispatch, api.commodity.update, args).then(res => {
    if (res.code === 0) {
      dispatch(push(url.COMMODITY_LIST))
      notification['success']({ message: '成功', description: '修改成功' })
      return res
    } else {
      notification['error']({ message: '失败', description: res.errmsg })
    }
  })
}

export const treeData = args => dispatch => {
  return fetchData(dispatch, api.commodity.categoryTree, args).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_CATEGORY_TREE)(res.data))
    } else {
      notification['error']({ message: '失败', description: res.errmsg })
    }
  })
}

export const resetDetail = args => dispatch => {
  dispatch(createAction(SET_COMMODITY_DETAIL)({}))
  dispatch(setPropertys({
    property: [],
    propertyPull: [],
    propertyRows: [],
    propertyColumns: [],
    groupIds: []
  }))
}

// ===========================> Reducer <=========================== //

const initialState = {
  treeData: [],
  list: [],
  page: {
    current: 1,
    total: 0
  },
  detail: {},
  filterData: {
    pageNo: 1,
    pageSize: 10
  }
}

export const commodity = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMMODITY_LIST:
      return {
        ...state,
        list: action.payload.data.data,
        page: {
          current: action.payload.data.pageNo,
          total: action.payload.data.records
        },
        filterData: action.payload.filterData
      }
    case SET_COMMODITY_DETAIL:
      return {
        ...state,
        detail: { ...action.payload }
      }

    case SET_COMMODITY_LIST_LOCAL:
      return {
        ...state,
        list: state.list.map(item => {
          return {
            ...item,
            status: action.payload.status
              ? action.payload.goodsIds.find(v => v === item.goodsId) ? action.payload.status : item.status
              : item.status,
            auditStatus: action.payload.auditStatus
              ? action.payload.goodsIds.find(v => v === item.goodsId) ? action.payload.auditStatus : item.auditStatus
              : item.auditStatus
          }
        })
      }
    case SET_CATEGORY_TREE:
      return {
        ...state,
        treeData: action.payload
      }
    default:
      return state
  }
}
