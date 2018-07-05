import { createAction } from 'redux-actions'

import { mailApi as api } from 'Global/apis'
import fetchData from 'Utils/fetch_mail'

// ===========================> 常量 <=========================== //
const AUDIT_SHOP_MODAL = 'AUDIT_SHOP_MODAL'
const AUDIT_SHOP_DETAIL_MODAL = 'AUDIT_SHOP_DETAIL_MODAL'
const AUDIT_SHOP_DETAIL = 'AUDIT_SHOP_DETAIL'

// ===========================> Action <=========================== //
export const showModalAction = payload => createAction(AUDIT_SHOP_MODAL)(payload)
export const showModalDetailAction = payload => createAction(AUDIT_SHOP_DETAIL_MODAL)(payload)
export const auditDetailAction = payload => createAction(AUDIT_SHOP_DETAIL)(payload)

export const getShopList = args => async dispatch => {
  return await fetchData(dispatch, api.audit.shopList, args)
}
export const getShopDetail = args => async dispatch => {
  return await fetchData(dispatch, api.audit.shopDetail, args)
}
export const auditShop = args => async dispatch => {
  return await fetchData(dispatch, api.audit.auditShop, args)
}

// ===========================> Reducer <=========================== //
const initialState = {
  isShowModal: false,
  isShowDetailModal: false,
  shopId: '',
  shopName: '',
  businessTypeList: [],
  owner: '',
  ownerPhone: '',
  auditStatus: '',
  unapprovedReason: '',
  auditor: '',
  auditTimeStr: ''
}

export const auditShopReduck = (state = initialState, action) => {
  switch (action.type) {
    case AUDIT_SHOP_MODAL:
      return {
        ...state,
        isShowModal: action.payload
      }
    case AUDIT_SHOP_DETAIL_MODAL:
      return {
        ...state,
        isShowDetailModal: action.payload
      }
    case AUDIT_SHOP_DETAIL:
      return {
        ...state,
        shopId: action.payload.shopId,
        shopName: action.payload.shopName,
        businessTypeList: action.payload.businessTypeList,
        owner: action.payload.owner,
        ownerPhone: action.payload.ownerPhone,
        auditStatus: action.payload.auditStatus,
        unapprovedReason: action.payload.unapprovedReason,
        auditor: action.payload.auditor,
        auditTimeStr: action.payload.auditTimeStr
      }
    default:
      return state
  }
}
