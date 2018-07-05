import { createAction } from 'redux-actions'

import { mailApi as api } from 'Global/apis'
import fetchData from 'Utils/fetch_mail'

// ===========================> 常量 <=========================== //
const AUDIT_GOODS_MODAL = 'AUDIT_GOODS_MODAL'
const AUDIT_GOODS_DETAIL_MODAL = 'AUDIT_GOODS_DETAIL_MODAL'
const AUDIT_GOODS_DETAIL = 'AUDIT_GOODS_DETAIL'

// ===========================> Action <=========================== //
export const showModalAction = payload => createAction(AUDIT_GOODS_MODAL)(payload)
export const showModalDetailAction = payload => createAction(AUDIT_GOODS_DETAIL_MODAL)(payload)
export const auditDetailAction = payload => createAction(AUDIT_GOODS_DETAIL)(payload)

export const getGoodsList = args => async dispatch => {
  return await fetchData(dispatch, api.audit.goodsList, args)
}
export const getGoodsDetail = args => async dispatch => {
  return await fetchData(dispatch, api.audit.goodsDetail, args)
}
export const auditGoods = args => async dispatch => {
  return await fetchData(dispatch, api.audit.auditGoods, args)
}

// ===========================> Reducer <=========================== //
const initialState = {
  isShowModal: false,
  isShowDetailModal: false,
  goodsId: '',
  spuId: '',
  goodsTitle: '',
  goodsSubTitle: '',
  sort: '',
  categoryName: '',
  price: '',
  stock: '',
  unit: '',
  imageUrl: '',
  column: [],
  table: [],
  propertyPull: [],
  item: [],
  goodsImage: [],
  detail: [],
  tips: '',
  auditTime: '',
  auditUser: '',
  auditMessage: '',
  auditStatus: ''
}

export const auditGoodsReduck = (state = initialState, action) => {
  switch (action.type) {
    case AUDIT_GOODS_MODAL:
      return {
        ...state,
        isShowModal: action.payload
      }
    case AUDIT_GOODS_DETAIL_MODAL:
      return {
        ...state,
        isShowDetailModal: action.payload
      }
    case AUDIT_GOODS_DETAIL:
      return {
        ...state,
        goodsId: action.payload.goodsId,
        spuId: action.payload.spuId,
        goodsTitle: action.payload.goodsTitle,
        goodsSubTitle: action.payload.goodsSubTitle,
        sort: action.payload.sort,
        categoryName: action.payload.categoryName,
        price: action.payload.price,
        stock: action.payload.stock,
        unit: action.payload.unit,
        imageUrl: action.payload.imageUrl,
        column: action.payload.column,
        table: action.payload.table,
        propertyPull: action.payload.propertyPull,
        item: action.payload.item,
        goodsImage: action.payload.goodsImage,
        detail: action.payload.detail,
        tips: action.payload.tips,
        auditTime: action.payload.auditTime,
        auditUser: action.payload.auditUser,
        auditMessage: action.payload.auditMessage,
        auditStatus: action.payload.auditStatus
      }
    default:
      return state
  }
}
