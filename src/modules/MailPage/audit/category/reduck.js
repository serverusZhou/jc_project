import { mailApi as api } from 'Global/apis'
import fetchData from 'Utils/fetch_mail'

export const GET_CATEGORY_LIST = '/spa/audit/GET_CATEGORY_LIST'
export const GET_CATEGORY_DETAIL = '/spa/audit/GET_CATEGORY_DETAIL'
export const GET_CLASSIFY_FIRST_CATEGORY = '/spa/audit/GET_CLASSIFY_FIRST_CATEGORY'
/* =========action部分=========== */

// 获取类目审核列表
export const getCategoryList = args => async dispatch => {
  return await fetchData(dispatch, api.audit.classifyList, args)
}

// 审核
export const audit = (args, value) => async dispatch => {
  return await fetchData(dispatch, api.audit.audit, args)
}

// 获取详细信息
export const categoryDetail = args => async dispatch => {
  return await fetchData(dispatch, api.audit.calssifyDetail, args)
}

// 初始化数据列表
const initialCategoryState = {
  detail: {}
}

/* ==========reducer部分============ */

export const auditCategory = function (state = initialCategoryState, action) {
  switch (action.type) {
    case GET_CATEGORY_DETAIL:
      return {
        ...state,
        detail: action.payload
      }
    default:
      return state
  }
}
