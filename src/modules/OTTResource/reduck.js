import { reducer as oTTChannel } from './channel/reduck'
import { reducer as oTTCategory } from './category/reduck'
import { message } from 'antd'
import apis from './apis'
import fetchData from 'Utils/fetch'

// ===========================> Action Types <=========================== //

// ===========================> Actions <=========================== //
// 审核
export const auditConfirm = (arg, callback) => dispatch => {
  return new Promise((resolve, reject) => {
    fetchData(dispatch)(apis.common.auditConfirm, arg).then(res => {
      if (res.code === 0) {
        message.success('提交成功！')
        callback && callback()
        resolve({ status: 'success' })
      } else {
        message.error(res.errmsg)
        resolve({ status: 'error' })
      }
    })
  })
}
export const auditDetails = (arg) => dispatch => {
  return new Promise((resolve, reject) => {
    fetchData(dispatch)(apis.common.auditDetails, arg).then(res => {
      if (res.code === 0) {
        // message.success('操作成功')
        dispatch(createAction(AUDIT_DETAILS)({ ...res }))
        resolve({ ...res.data, status: 'success' })
      } else {
        message.error(res.errmsg)
        resolve({ status: 'error' })
      }
    })
  })
}

export const reducers = {
  oTTChannel,
  oTTCategory
}
