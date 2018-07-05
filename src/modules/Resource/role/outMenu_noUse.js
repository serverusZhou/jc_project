import { tvmallUrl } from '../../../config'
import storage from 'Utils/storage'

const userInfo = storage.get('userInfo')
const ticket = (userInfo && userInfo.ticket) ? userInfo.ticket : ''

export default [
  {
    name: 'TV商城',
    url: `${tvmallUrl}?t=${ticket}`,
    icon: 'shop',
    isOut: true,
    children: [
      {
        name: '首页管理',
        menuKey: 'tvmall-home',
      },
      {
        name: '商品管理',
        menuKey: 'tvmall-commodity',
      },
      {
        name: '店铺管理',
        menuKey: 'tvmall-shop',
      },
      {
        name: '类目管理',
        menuKey: 'tvmall-classify',
      },
      {
        name: '属性管理',
        menuKey: 'tvmall-attribute',
      },
      {
        name: '订单管理',
        menuKey: 'tvmall-order',
      },
      {
        name: '审核管理',
        menuKey: 'tvmall-audit',
      },
    ],
  }
]
