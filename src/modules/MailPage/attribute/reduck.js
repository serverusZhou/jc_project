import { mailApi as api } from 'Global/apis'
import fetach from 'Utils/fetch_mail'
import { message } from 'antd'
import { createAction } from 'redux-actions'

// ================= Actions ============================================================
const GET_ATTRIBUTE_DATA = 'spa/attribute/query'

export const getAttribute = () => dispatch => {
  return fetach(dispatch, api.attribute.attributepage).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_ATTRIBUTE_DATA)({ cardData: res.data }))
    } else {
      message.error(res.message)
    }
  })
}

export const modifyAttr = arg => dispatch => {
  return fetach(dispatch, api.attribute.editproperty, arg).then(res => {
    if (res.code === 0 && res.data) {
      message.success('修改属性成功', 0.5, () => {
        dispatch(getAttribute())
      })
    } else {
      message.error(res.errmsg)
    }
  })
}

export const delAttr = arg => dispatch => {
  return fetach(dispatch, api.attribute.delproperty, arg).then(res => {
    if (res.code === 0 && res.data) {
      message.success('已删除', 0.5, () => {
        dispatch(getAttribute())
      })
    } else {
      message.error(res.errmsg)
    }
  })
}

// 新增属性
export const addAttr = arg => dispatch => {
  return fetach(dispatch, api.attribute.addproperty, arg).then(res => {
    if (res.code === 0 && res.data) {
      message.success('新增成功', 0.5, () => {
        dispatch(getAttribute())
      })
    } else {
      message.error(res.errmsg)
    }
  })
}

// 新增属性组
export const addGroup = arg => dispatch => {
  return fetach(dispatch, api.attribute.addgroup, arg).then(res => {
    if (res.code === 0 && res.data) {
      message.success('新增属性组成功', 0.5, () => {
        dispatch(getAttribute())
      })
    } else {
      message.error(res.errmsg)
    }
  })
}

// 修改属性组
export const modifyGroup = arg => dispatch => {
  return fetach(dispatch, api.attribute.editgroup, arg).then(res => {
    if (res.code === 0 && res.data) {
      message.success('修改属性组成功', 0.5, () => {
        dispatch(getAttribute())
      })
    } else {
      message.error(res.errmsg)
    }
  })
}

// 删除属性组
export const delGroup = arg => dispatch => {
  return fetach(dispatch, api.attribute.delgroup, arg).then(res => {
    if (res.code === 0 && res.data) {
      message.success('删除属性组成功', 1, () => {
        dispatch(getAttribute())
      })
    } else {
      message.error(res.errmsg)
    }
  })
}

// 提交审核
export const sendAudit = (args) => dispatch => {
  return fetach(dispatch, api.attribute.sendAudit, args).then(res => {
    if (res.code === 0 && res.data) {
      message.success('提交审核成功', 0.5, () => {
        dispatch(getAttribute())
      })
      return res
    } else {
      message.error(res.errmsg)
      return res
    }
  })
}

// 撤销审核
export const reverseAudit = (args) => dispatch => {
  return fetach(dispatch, api.attribute.restAudit, args).then(res => {
    if (res.code === 0 && res.data) {
      message.success('成功', 0.5, () => {
        dispatch(getAttribute())
      })
    } else {
      message.error(res.errmsg)
    }
  })
}
// =================reducer ===============================================================
const initialState = {
  list: [],
}

export const attributeData = (state = initialState, action) => {
  switch (action.type) {
    case GET_ATTRIBUTE_DATA:
      return { ...state, cardData: action.payload.cardData }
    default:
      return state
  }
}
