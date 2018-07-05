import { Redirect } from 'react-router-dom'
import * as urls from 'Global/urls'
import MailHome from './mailHome'
import classifyMall from 'Modules/MailPage/classify/mall/index'
import superMarket from 'Modules/MailPage/classify/superMarket/index'
import Attribute from 'Modules/MailPage/attribute'
import CommodityList from 'Modules/MailPage/commodity/list'
import ShopList from 'Modules/MailPage/shop'
import ShopAddList from 'Modules/MailPage/shop/shopAddList'
import ShopAddDetail from 'Modules/MailPage/shop/shopAddDetail'
import ShopDetail from 'Modules/MailPage/shop/detail'
import BindGoods from 'Modules/MailPage/shop/bind'
import CommodityDetail from 'Modules/MailPage/commodity/detail'
import Order from 'Modules/MailPage/order'
import OrderDetail from 'Modules/MailPage/order/detail'
import AuditShopList from 'Modules/MailPage/audit/shop/AuditShopList'
import AuditGoodsList from 'Modules/MailPage/audit/goods/AuditGoodsList'
import AuditAttributeList from 'Modules/MailPage/audit/attribute/AuditAttributeList'
import AuditCategoryList from 'Modules/MailPage/audit/category/AuditClassifyList'

const mallHomeRoutes = [
  {
    path: urls.MailHome,
    exact: true,
    component: MailHome,
    breadcrumbName: '首页',
    parentPath: urls.HOME,
  },
  {
    path: urls.CLASSIFY,
    exact: true,
    breadcrumbName: '类目管理',
    component: () => <Redirect to={urls.CLASSIFY_MALL} />,
    parentPath: urls.HOME,
  },
  {
    path: urls.CLASSIFY_MALL,
    exact: true,
    component: classifyMall,
    breadcrumbName: '电商类目',
    parentPath: urls.CLASSIFY,
  },
  {
    path: urls.CLASSIFY_SUPERMARKET,
    exact: true,
    component: superMarket,
    breadcrumbName: '商超类目',
    parentPath: urls.CLASSIFY,
  },
  {
    path: urls.ATTRIBUTE,
    exact: true,
    component: Attribute,
    breadcrumbName: '属性管理',
    parentPath: urls.HOME,
  },
  // 商品管理 孙弘飞
  {
    path: urls.COMMODITY_LIST,
    exact: true,
    // component: CommodityList,
    component: CommodityList,
    breadcrumbName: '商品列表',
    parentPath: urls.HOME,
  },
  {
    path: urls.COMMODITY_DETAIL,
    exact: true,
    component: CommodityDetail,
    breadcrumbName: '商品新增',
    parentPath: urls.COMMODITY_LIST,
  },
  {
    path: `${urls.COMMODITY_DETAIL}/:goodsId`,
    exact: true,
    component: CommodityDetail,
    breadcrumbName: '商品详情',
    parentPath: urls.COMMODITY_LIST,
  },
  // 店铺管理
  {
    path: urls.SHOP_LIST,
    exact: true,
    component: ShopList,
    breadcrumbName: '店铺列表',
    parentPath: urls.HOME,
  },
  {
    path: urls.SHOP_ADD_LIST,
    exact: true,
    component: ShopAddList,
    breadcrumbName: '店铺新增列表',
    parentPath: urls.SHOP_LIST,
  },
  {
    path: `${urls.SHOP_DETAIL}/:shopId?`,
    exact: true,
    component: ShopDetail,
    breadcrumbName: '店铺详情',
    parentPath: urls.SHOP_LIST,
  },
  {
    path: `${urls.SHOP_ADD_DETAIL}/:shopId/:shopName/:ownerPhone/:owner`,
    exact: true,
    component: ShopAddDetail,
    breadcrumbName: '店铺新增',
    parentPath: urls.SHOP_LIST,
  },
  {
    path: `${urls.SHOP_BIND_GOODS}/:shopId`,
    exact: true,
    component: BindGoods,
    breadcrumbName: '绑定商品',
    parentPath: urls.SHOP_LIST,
  },
  // 订单管理
  {
    path: urls.ORDER,
    exact: true,
    component: Order,
    breadcrumbName: '订单管理',
    parentPath: urls.HOME,
  },
  {
    path: `${urls.ORDER}/detail/:orderNo`,
    exact: true,
    component: OrderDetail,
    breadcrumbName: '订单详情',
    parentPath: urls.HOME,
  },
  {
    path: urls.AUDIT_MANAGEMENT,
    exact: true,
    breadcrumbName: '审核管理',
    component: () => <Redirect to={urls.AUDIT_SHOP} />,
    parentPath: urls.HOME,
  },
  {
    path: urls.AUDIT_SHOP,
    exact: true,
    component: AuditShopList,
    breadcrumbName: '店铺审核',
    parentPath: urls.AUDIT_MANAGEMENT,
  },
  {
    path: urls.AUDIT_GOODS,
    exact: true,
    component: AuditGoodsList,
    breadcrumbName: '商品审核',
    parentPath: urls.AUDIT_MANAGEMENT,
  },
  {
    path: urls.AUDIT_ATTRIBUTE,
    exact: true,
    component: AuditAttributeList,
    breadcrumbName: '属性审核',
    parentPath: urls.AUDIT_MANAGEMENT,
  },
  {
    path: urls.AUDIT_CATEGORY,
    exact: true,
    component: AuditCategoryList,
    breadcrumbName: '类目审核',
    parentPath: urls.AUDIT_MANAGEMENT,
  },
]

export default mallHomeRoutes
