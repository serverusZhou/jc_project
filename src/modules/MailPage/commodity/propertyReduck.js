import fetchData from 'Utils/fetch_mail'
import { mailApi as api } from 'Global/apis'
// import { createAction } from 'redux-actions'
import { message } from 'antd'

export const SET_PROPERTYS = 'spa/property/SET_PROPERTYS'

// todo 清理propertTable
export const setPropertys = payload => ({ type: SET_PROPERTYS, payload })

// 切换属性组列表，请求数据, 新组件
export const getPropertyList = args => (dispatch, getState) => {
  const { groupId, index } = args
  fetchData(dispatch, api.commodity.propertyList, { groupId }).then(res => {
    if (res.code === 0) {
      const propertyPull = getState().property.propertyPull
      const groupIds = getState().property.groupIds
      const oList = propertyPull.slice()
      const l = groupIds.slice()
      l[index] = groupId
      oList[index] = res.data
      dispatch(setPropertys({ groupIds: l, propertyPull: oList }))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 根据属性获取Table数据, 新组件
export const getPropertyTable = property => dispatch => {
  // 去除空数组
  const propertyArgs = property.filter(m => m.length > 0)
  fetchData(dispatch, api.commodity.propertyTable, { property: propertyArgs }).then(res => {
    if (res.code === 0) {
      dispatch(
        setPropertys({
          propertyColumns: res.data.column,
          propertyRows: res.data.table
        })
      )
    } else {
      message.error(res.errmsg)
    }
  })
}

// 删除属性栏要等待state.commodity.property被修改后，
// 再获取property作为参数发起请求, 新组件
export const tableAfterDelete = property => dispatch => {
  const propertyArgs = property.filter(m => m.length > 0)
  return fetchData(dispatch, api.commodity.propertyTable, { property: propertyArgs }).then(res => {
    if (res.code === 0) {
      dispatch(setPropertys({
        propertyColumns: res.data.column || [],
        propertyRows: res.data.table || []
      }))
      return res
    } else {
      message.error(res.errmsg)
    }
  })
}

// 添加属性组选择栏，请求数据，新组件
export const addPropertySelector = args => (dispatch, getState) => {
  fetchData(dispatch, api.commodity.propertyList, args).then(res => {
    const propertyPull = getState().property.propertyPull
    if (res.code === 0) {
      const afterAdd = propertyPull.concat(new Array(res.data))
      dispatch(setPropertys({ propertyPull: afterAdd }))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const setAddStock0 = () => (dispatch, getState) => {
  const propertyRows = getState().property.propertyRows
  dispatch(
    setPropertys({
      propertyRows: propertyRows.map(item => ({ ...item, stock: 0 }))
    })
  )
}

const initialState = {
  property: [],
  propertyPull: [],
  propertyRows: [],
  propertyColumns: [],
  groupIds: []
}

export const property = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROPERTYS:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
