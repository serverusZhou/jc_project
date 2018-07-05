import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import storage from 'Utils/storage'
import { reducers as operateReducers } from 'Modules/Operate/reduck'
import { reducers as resourceReducers } from 'Modules/Resource/reduck'
import { reducers as oTTResourceReducers } from 'Modules/OTTResource/reduck'

/* ========================= 商城 ======================= */
import { globalReduck } from './globalReduck'
import { userLogin } from 'Modules/MailPage/login/reduck'
import { commodity } from 'Modules/MailPage/commodity/reduck'
import { property } from 'Modules/MailPage/commodity/propertyReduck'
import { attributeData } from 'Modules/MailPage/attribute/reduck'
import { home } from 'Modules/MailPage/mailHome/reduck'
import { shop } from 'Modules/MailPage/shop/reduck'
import { order } from 'Modules/MailPage/order/reduck'
import { classify } from 'Modules/MailPage/classify/reduck'
import { auditShopReduck } from 'Modules/MailPage/audit/shop/reduck'
import { auditGoodsReduck } from 'Modules/MailPage/audit/goods/reduck'
import { auditAttributeData } from 'Modules/MailPage/audit/attribute/reduck'
import { auditCategory } from 'Modules/MailPage/audit/category/reduck'
/* ========================= 商城 ======================= */

import {
  SHOW_SPIN,
  SHOW_BUTTON_SPIN,
  SHOW_LIST_SPIN,
  SET_QINIU_TOKEN,
  SET_ALI_TOKEN,
  LOGIN,
  SET_MENU_LIST,
} from './action'

// ===========================> router Reducer <=========================== //

const LOCATION_CHANGE = '@@router/LOCATION_CHANGE'

const routerInitialState = {
  pre: '',
  location: null
}

const router = function (state = routerInitialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      window.scrollTo(0, 0)
      return {
        pre: state.location && state.location.payload.pathname,
        location: routerReducer(action)
      }
    default:
      return { ...state }
  }
}

// ===========================> common Reducer <=========================== //

const commonInitialState = {
  showSpin: { bool: false, content: '' },
  showButtonSpin: false,
  showListSpin: false,
  qiniuToken: '',
  aliToken: {},
  menuTreeList: [],
  auths: [],
  userLogin: {},
}

export const common = (state = commonInitialState, action) => {
  switch (action.type) {
    case SHOW_SPIN:
      return { ...state, showSpin: action.payload }
    case SHOW_BUTTON_SPIN:
      return { ...state, showButtonSpin: action.payload.bool }
    case SHOW_LIST_SPIN:
      return { ...state, showListSpin: action.payload.bool }
    case SET_QINIU_TOKEN:
      return { ...state, qiniuToken: action.payload }
    case SET_ALI_TOKEN:
      return { ...state, aliToken: action.payload }
    case LOGIN:
      storage.set('userInfo', action.payload)
      return { ...state, userLogin: action.payload }
    case SET_MENU_LIST:
      return { ...state, menuTreeList: action.payload.filterMenus, auths: action.payload.auths }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  router,
  common,
  operate: combineReducers(operateReducers),
  resource: combineReducers(resourceReducers),
  oTTResource: combineReducers(oTTResourceReducers),
  /* ========== mailHome ==========*/
  globalReduck,
  userLogin,
  attributeData,
  commodity,
  property,
  home,
  shop,
  classify,
  order,
  auditAttributeData,
  auditShopReduck,
  auditGoodsReduck,
  auditCategory,
  /* ========== mailHome ==========*/
})

export default rootReducer
