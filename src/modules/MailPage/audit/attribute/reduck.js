import { mailApi as api } from 'Global/apis'
import fetach from 'Utils/fetch_mail'
import { message } from 'antd'
import { createAction } from 'redux-actions'

// ================= Actions ============================================================
const GET_ATTRIBUTE_DATA = 'spa/attribute/query'

export const getlistAuditing = args => dispatch => {
  return fetach(dispatch, api.audit.listAudit, args).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_ATTRIBUTE_DATA)({ cardData: res.data }))
    } else {
      message.error(res.message)
    }
  })
}

export const audit = args => dispatch => {
  return fetach(dispatch, api.audit.auditProperty, args).then(res => {
    if (res.code === 0) {
      message.success('审核成功')
      dispatch(getlistAuditing({ audit: 0 }))
    } else {
      message.error(res.message)
    }
  })
}
// =================reducer ===============================================================
const initialState = {
  cardData: [],
}

export const auditAttributeData = (state = initialState, action) => {
  switch (action.type) {
    case GET_ATTRIBUTE_DATA:
      return { ...state, cardData: action.payload.cardData }
    default:
      return state
  }
}
