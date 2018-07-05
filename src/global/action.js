import { message } from 'antd'
import { createAction } from 'redux-actions'

import fetchData from 'Utils/fetch'
import storage from 'Utils/storage'
import { isEmpty } from 'Utils/lang'
import { loginApi } from 'Global/apis'
import * as urls from 'Global/urls'
import menuList from './menuTreeList'

// 全局公用常量
export const SHOW_SPIN = 'spa/common/SHOW_SPIN'
export const SHOW_BUTTON_SPIN = 'spa/common/SHOW_BUTTON_SPIN'
export const SHOW_LIST_SPIN = 'spa/common/SHOW_LIST_SPIN'
export const SET_QINIU_TOKEN = 'spa/common/SET_QINIU_TOKEN'
export const SET_ALI_TOKEN = 'spa/common/SET_ALI_TOKEN'
export const UPDATE_LOADING = 'spa/common/UPDATE_LOADING'
export const UPDATE_DISABLED = 'spa/common/UPDATE_DISABLED'
export const UPDATE_VISIBLE = 'spa/common/UPDATE_VISIBLE'
export const LOGIN = 'spa/common/LOGIN'
export const SET_MENU_LIST = 'spa/common/SET_MENU_LIST'

// ===========================> common Action <=========================== //

export const showSpin = arg => {
  return createAction(SHOW_SPIN)(arg)
}

export const showBtnSpin = arg => {
  return createAction(SHOW_BUTTON_SPIN)(arg)
}

export const showListSpin = arg => {
  return createAction(SHOW_LIST_SPIN)(arg)
}

export const updLoading = arg => {
  return createAction(UPDATE_LOADING)(arg)
}

export const updDisabled = arg => {
  return createAction(UPDATE_DISABLED)(arg)
}

export const updVisible = arg => {
  return createAction(UPDATE_VISIBLE)(arg)
}

// ===========================> login Action <=========================== //

// 登入
export const userLogin = arg => dispatch =>
  fetchData(dispatch, SHOW_BUTTON_SPIN)(loginApi.login, arg)
    .then(res => {
      if (res.code !== 0) {
        message.error(res.errmsg)
      } else {
        dispatch(createAction(LOGIN)(res.data))
        location.href = urls.HOME
      }
    })

// 登出
export const userLogout = arg => dispatch => {
  fetchData(dispatch)(loginApi.logout, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    }
    storage.clear()
    location.href = urls.HOME
  })
}

// 根据当前当前登录人获取菜单
export const getMenus = arg => dispatch => {
  const menuTreeList = JSON.parse(JSON.stringify(menuList))
  fetchData(dispatch, SHOW_SPIN)(loginApi.adminInfo, arg).then(res => {
    if (res.code === 0) {
      const userInfo = storage.get('userInfo')
      if (isEmpty(menuTreeList)) {
        return
      }
      if (!isEmpty(userInfo) && userInfo.roleId === '0') {
        dispatch(createAction(SET_MENU_LIST)({ filterMenus: menuTreeList, auths: [] }))
        return
      }
      // 根据权限过滤菜单
      if (isEmpty(res.data.menuList)) {
        return
      } else {
        const filterMenus = []
        const auths = []
        const menuKeys = res.data.menuList.map(menu => {
          return menu.menuTag
        })
        menuTreeList.map(menu => {
          let newMenu = menu
          let childrenMenus = []
          if (!isEmpty(menu.children)) {
            menu.children.forEach(child => {
              if (menuKeys.indexOf(child.menuKey) !== -1) {
                childrenMenus.push(child)
                if (child.url && !child.isOut) {
                  auths.push(child.url)
                }
              }
            })
            if (!isEmpty(childrenMenus)) {
              newMenu.children = childrenMenus
              filterMenus.push(newMenu)
            }
          }
        })
        dispatch(createAction(SET_MENU_LIST)({ filterMenus, auths }))
      }
    } else {
      message.error(res.errmsg)
    }
  })
}

// 修改密码
export const modifyPassword = arg => dispatch =>
  fetchData(dispatch, SHOW_SPIN)(loginApi.modifyPass, arg)
    .then(res => {
      if (res.code === 0) {
        message.info('密码修改成功', 3)
        return Promise.resolve(true)
      } else {
        message.error(res.errmsg)
        return Promise.resolve(false)
      }
    })

// 获取七牛token
export const getQiniuToken = key => dispatch =>
  fetchData(loginApi.qiniuToken, { key })
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(SET_QINIU_TOKEN)(res.data.token))
      } else {
        message.error(res.errmsg)
      }
    })

// 获取 ALIYUN token
export const getAliToken = key => dispatch => {
  const platformBusinessNo = '01'
  fetchData(loginApi.aliToken, { platformBusinessNo })
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(SET_ALI_TOKEN)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
}

