import fetchData from 'Utils/fetch_mail'
import { createAction } from 'redux-actions'
import { mailApi as api } from 'Global/apis'
import { message } from 'antd'
import { goBack, go } from 'react-router-redux'

const SET_SHOP_LIST = '/spa/shops/SET_SHOP_LIST' // 店铺管理／店铺查询
const SET_SHOP_ADD_LIST = '/spa/shops/SET_SHOP_ADD_LIST' // 店铺管理／店铺查询
const SET_GOODS_LIST = '/spa/shops/SET_GOODS_LIST' // 店铺管理／店铺查询
const SET_SHOP_INFO = '/spa/shops/SET_SHOP_INFO'// 店铺管理／店铺查询／店铺信息
const SET_GOODS_TREE = '/spa/shops/SET_GOODS_TREE'// 店铺管理／店铺查询／商品类目

export const setShopInfo = data => createAction(SET_SHOP_INFO)(data)
export const setShopList = data => createAction(SET_SHOP_LIST)(data)

export const getShopList = args => (dispatch) => {
  return fetchData(dispatch, api.shop.shopList, args)
    .then(res => {
      if (res && res.code === 0) {
        dispatch(setShopList({ ...res.data, filter: args }))
      } else {
        message.error(res.errmsg)
      }
    })
}

export const updateShopStatus = args => (dispatch, getState) => {
  return fetchData(dispatch, api.shop.modifyShopStatus, args)
    .then(res => {
      if (res && res.code === 0) {
        message.success('店铺状态修改成功')
        dispatch(getShopList(getState().shop.shopList.filter))
      } else {
        message.error(res.errmsg)
      }
    })
}

export const submitAudit = args => (dispatch, getState) => {
  return fetchData(dispatch, api.shop.submitAudit, args)
    .then(res => {
      if (res && res.code === 0) {
        message.success('提交审核成功')
        dispatch(getShopList(getState().shop.shopList.filter))
        return res
      } else {
        message.error(res.errmsg)
        return res
      }
    })
}

export const cancelAudit = args => (dispatch, getState) => {
  return fetchData(dispatch, api.shop.cancelAudit, args)
    .then(res => {
      if (res && res.code === 0) {
        message.success('撤销审核成功')
        dispatch(getShopList(getState().shop.shopList.filter))
      } else {
        message.error(res.errmsg)
      }
    })
}

export const getShopInfo = args => (dispatch) => {
  return fetchData(dispatch, api.shop.shopInfo, args)
    .then(res => {
      if (res && res.code === 0) {
        dispatch(setShopInfo(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
}

export const shopAdd = args => (dispatch) => {
  return fetchData(dispatch, api.shop.addShop, args)
    .then(res => {
      if (res && res.code === 0) {
        message.success('店铺新增成功')
        dispatch(go(-2))
      } else {
        message.error(res.errmsg)
      }
    })
}

export const modifyShop = args => (dispatch) => {
  return fetchData(dispatch, api.shop.modifyShop, args)
    .then(res => {
      if (res && res.code === 0) {
        message.success('店铺修改成功')
        dispatch(goBack())
      } else {
        message.error(res.errmsg)
      }
    })
}

export const deleteShop = args => (dispatch, getState) => {
  return fetchData(dispatch, api.shop.deleteShop, args)
    .then(res => {
      if (res && res.code === 0) {
        message.success('店铺删除成功')
        dispatch(getShopList(getState().shop.shopList.filter))
      } else {
        message.error(res.errmsg)
      }
    })
}

export const getShopAddList = args => (dispatch) => {
  return fetchData(dispatch, api.shop.shopAddList, args)
    .then(res => {
      if (res && res.code === 0) {
        dispatch(createAction(SET_SHOP_ADD_LIST)({ ...res.data, filter: args }))
      } else {
        message.error(res.errmsg)
      }
    })
}

export const getGoodsList = args => (dispatch) => {
  return fetchData(dispatch, api.shop.goodsList, args)
    .then(res => {
      if (res && res.code === 0) {
        dispatch(createAction(SET_GOODS_LIST)({ ...res.data, filter: args }))
      } else {
        message.error(res.errmsg)
      }
    })
}

export const getTreeData = args => (dispatch) => {
  return fetchData(dispatch, api.classify.classifyTree, args)
    .then(res => {
      if (res && res.code === 0) {
        dispatch(createAction(SET_GOODS_TREE)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
}

export const bindingGoods = (args, filterData) => (dispatch) => {
  return fetchData(dispatch, api.shop.bindGoods, args)
    .then(res => {
      if (res && res.code === 0) {
        const ms = filterData.bindFlag === 'N' ? '绑定成功' : '取消绑定成功'
        message.success(ms)
        dispatch(getGoodsList(filterData))
      } else {
        message.error(res.errmsg)
      }
    })
}

const initialState = {
  shopList: {
    data: [],
    records: 0,
    pageSize: 10,
    pages: 1,
    pageNo: 1,
    filter: {
      currentPage: 1
    }
  },
  shopInfo: {},
  treeData: [],
  goodsList: {
    data: [],
    records: 0,
    pageSize: 10,
    pages: 1,
    pageNo: 1,
    filter: {
      currentPage: 1
    }
  },
  shopAddList: {
    data: [],
    records: 0,
    pageSize: 10,
    pages: 1,
    pageNo: 1,
    filter: {}
  },
}

export const shop = (state = initialState, action) => {
  switch (action.type) {
    case SET_SHOP_LIST:
      return { ...state, shopList: action.payload }
    case SET_SHOP_INFO:
      return { ...state, shopInfo: action.payload }
    case SET_SHOP_ADD_LIST:
      return { ...state, shopAddList: action.payload }
    case SET_GOODS_LIST:
      return { ...state, goodsList: action.payload }
    case SET_GOODS_TREE:
      return { ...state, treeData: action.payload }
    default:
      return state
  }
}
