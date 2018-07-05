
/* ======================== 商城 ========================  */
import * as urls from 'Global/urls'

const menuData = [
  {
    name: 'TV商城',
    menuKey: 'tvmall',
    path: 'tvmall-home',
    icon: 'shop',
    children: [
      {
        name: '首页管理',
        // icon: 'icon-shouye',
        icon: 'home',
        menuKey: 'tvmall/home',
        path: urls.MailHome
      },
      {
        name: '商品管理',
        // icon: 'icon-shangpinzhongxin',
        icon: 'gift',
        menuKey: 'tvmall-commodity',
        path: urls.COMMODITY_LIST
      },
      {
        name: '店铺管理',
        // icon: 'icon-dianpu',
        icon: 'shop',
        menuKey: 'tvmall-shop',
        path: urls.SHOP_LIST
      },
      {
        name: '类目管理',
        // icon: 'icon-dujiayuniconzhenggao-27',
        icon: 'appstore-o',
        path: urls.CLASSIFY,
        menuKey: 'tvmall-classify',
        children: [
          {
            name: '电商类目',
            path: urls.CLASSIFY_MALL,
          },
          {
            name: '商超类目',
            path: urls.CLASSIFY_SUPERMARKET,
          }
        ],
      },
      {
        name: '属性管理',
        // icon: 'icon-kongzhishuxingshezhi',
        icon: 'database',
        menuKey: 'tvmall-attribute',
        path: urls.ATTRIBUTE
      },
      {
        name: '订单管理',
        // icon: 'icon-dingdan',
        icon: 'profile',
        menuKey: 'tvmall-order',
        path: urls.ORDER,
      },
      {
        name: '审核管理',
        // icon: 'icon-shijian',
        icon: 'check',
        menuKey: 'tvmall-audit',
        path: urls.AUDIT_MANAGEMENT,
        children: [
          {
            name: '店铺审核',
            path: urls.AUDIT_SHOP,
          },
          {
            name: '商品审核',
            path: urls.AUDIT_GOODS,
          },
          {
            name: '属性审核',
            path: urls.AUDIT_ATTRIBUTE,
          },
          {
            name: '类目审核',
            path: urls.AUDIT_CATEGORY,
          }
        ]
      }
    ]
  }
]

function formatter(data, parentAuthority) {
  return data.map(item => {
    const result = {
      ...item,
      path: item.path,
      url: item.path,
      authority: item.authority || parentAuthority,
      key: item.path
    }
    if (item.children) {
      result.children = formatter(item.children, item.authority)
    }
    return result
  })
}

function getMenu(userInfo, parentAuthority) {
  let menus = menuData
  if (userInfo && userInfo.roleId) {
    // 判断是否是超级管理员
    if (userInfo.roleId === '0') {
      menus = menuData
    } else if (userInfo.menuList) {
      menus = menuData.filter(menu => {
        const legalMenu = userInfo.menuList.filter(item => menu.menuKey === item.menuTag)
        return legalMenu && legalMenu.length > 0
      })
    }
  }
  return formatter(menus)
}
const getMenuData = (userInfo = {}) => getMenu(userInfo)
/* ======================== 商城 ========================  */
const exportDefault = [...getMenuData({})]
export default exportDefault
