import { createAction } from 'redux-actions'
import { message } from 'antd'
import moment from 'moment'
import { SHOW_LIST_SPIN } from '../global/action'
import { isEmpty } from './lang'

// ===========================> Route <=========================== //

function genRoute(path, breadcrumbName, baseComponent, parentPath, authTag) {
  return {
    path,
    exact: true,
    baseComponent,
    breadcrumbName,
    parentPath,
    authTag,
  }
}

const RouteHelper = { genRoute }

// ===========================> Menu <=========================== //

function genMenu(menu, menuUrl, buttons = [], menuIcon = 'team', children = null) {
  return {
    menu,
    menuKey: menuUrl,
    menuIcon,
    menuUrl,
    buttons,
    children,
  }
}

const Buttons = {
  DEFINE: (key, name) => ({ key, name }),
  CHECK: (name = '查看') => ({ key: 'check', name }),
  ADD: (name = '新增') => ({ key: 'add', name }),
  EDIT: (name = '编辑') => ({ key: 'edit', name }),
  DELETE: (name = '删除') => ({ key: 'delete', name }),
  EXPORT: (name = '导出') => ({ key: 'export', name }),
  PRINT: (name = '打印') => ({ key: 'print', name }),
  SAVE: (name = '保存') => ({ key: 'save', name }),
  SUBMIT: (name = '提交') => ({ key: 'submit', name }),
  CANCEL: (name = '取消') => ({ key: 'cancel', name }),
  BACK: (name = '返回') => ({ key: 'back', name }),
}

const CRUDButtons = [
  Buttons.CHECK(),
  Buttons.ADD(),
  Buttons.EDIT(),
  Buttons.DELETE(),
]

const MenuHelper = { genMenu, Buttons, CRUDButtons }

// ===========================> Reduck <=========================== //

function genListAction(arg, fetch, url, actionType) {
  return dispatch => {
    // const filter = objectHandler(arg, trim)
    const filter = arg
    return fetch(dispatch, SHOW_LIST_SPIN)(url, filter)
      .then(res => {
        if (res.code === 0) {
          dispatch(createAction(actionType)({ ...res.data, filter }))
        } else {
          message.error(res.errmsg)
        }
      })
  }
}

function genListState(key, filter) {
  return {
    [`${key}Filter`]: {
      pageSize: 10,
      currentPage: 1,
      ...filter,
    },
    [`${key}List`]: [],
    [`${key}Page`]: {},
  }
}

function resolveListState(key, state, payload) {
  const { filter, result, data, ...page } = payload
  return {
    ...state,
    [`${key}Filter`]: filter,
    [`${key}List`]: result || data,
    [`${key}Page`]: page,
  }
}

const ReduckHelper = { genListAction, genListState, resolveListState }

// ===========================> Page <=========================== //

function genPlanColumn(key, title, extend) {
  return { key, title, dataIndex: key, align: 'center', ...extend }
}

function genSelectColumn(key, title, options) {
  return {
    title,
    key,
    dataIndex: key,
    align: 'center',
    render: (text, record, index) => {
      const status = options.filter(option => (option.value + '') === (text + ''))
      return status.length > 0 ? status[0].name : ''
    }
  }
}

function unshiftIndexColumn(old, page, cProps = {}) {
  return [{
    key: 'index',
    title: '序号',
    ...cProps,
    render: (text, record, index) => page.pageSize * page.pageNo + (index + 1) - page.pageSize
  }].concat(old)
}

function filterResolver(filter, key, sub1, sub2, format = 'YYYY-MM-DD') {
  const resItem = filter[key]
  delete filter[key]
  const finalFilter = Object.assign({}, filter, {
    [sub1]: (resItem && !isEmpty(resItem) && moment(resItem[0]).format(format)) || '',
    [sub2]: (resItem && !isEmpty(resItem) && moment(resItem[1]).format(format)) || '',
  })
  return finalFilter
}

// 数组转成以field为key的map对象
function arrayToMap(arr, key) {
  if (!arr) return {}

  let map = {}
  arr.forEach(function(item) {
    let field = item[key]
    map[field] = item
  })
  return map
}

const DefaultPage = {
  pageNo: 1,
  records: 0,
  pageSize: 10,
}
function genPagination(page = DefaultPage) {
  return {
    current: parseInt(page.pageNo),
    total: parseInt(page.records),
    pageSize: parseInt(page.pageSize),
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: total => `共 ${page.records} 项`,
    pageSizeOptions: ['5', '10', '20', '50'],
  }
}

// const PageHelper = {}

export {
  RouteHelper,
  MenuHelper,
  ReduckHelper,
  genPlanColumn,
  genSelectColumn,
  unshiftIndexColumn,
  filterResolver,
  genPagination,
  arrayToMap,
}
