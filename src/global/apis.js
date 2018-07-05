/* 登陆api */
const loginApi = {
  login: '/api/admin/login/v1',
  logout: '/api/admin/logout/v1',
  qiniuToken: '/api/sys/file/uptoken',
  aliToken: '/api/oss/get/sts/v1',
  adminInfo: '/api/admin/info/v1',
}

/* 商城 */
const mailApi = {
  // todo 改为阿里云
  qiniuToken: '/api/tvmall/system/file/uptoken',
  getLoginMenu: '/api/tvmall/system/getLoginMenu',
  user: {
    login: '/api/system/business/login',
    logout: '/api/system/logout',
  },
  attribute: {
    attributepage: '/api/tvmall/system/propertyGroup/list', // 属性组列表
    editproperty: '/api/tvmall/system/property/update', // 修改属性
    addproperty: '/api/tvmall/system/property/add', // 新增属性
    sendAudit: '/api/tvmall/system/property/submitAudit', // 属性提审
    restAudit: '/api/tvmall/system/property/cancelAudit', // 撤销审核
    delproperty: '/api/tvmall/system/property/delete', // 删除属性
    editgroup: '/api/tvmall/system/propertyGroup/update', // 属性组编辑
    addgroup: '/api/tvmall/system/propertyGroup/add', // 新增属性组
    delgroup: '/api/tvmall/system/propertyGroup/delete', // 删除属性组
  },
  home: {
    list: 'api/tvmall/system/home/pos/list',
    update: 'api/tvmall/system/home/pos/update'
  },
  shop: {
    shopList: '/api/tvmall/system/shop/list',
    shopInfo: '/api/tvmall/system/shop/modifyDetail',
    addShop: '/api/tvmall/system/shop/add',
    modifyShop: '/api/tvmall/system/shop/modify',
    deleteShop: '/api/tvmall/system/shop/delete',
    modifyShopStatus: '/api/tvmall/system/shop/modifyShopStatus',
    submitAudit: '/api/tvmall/system/shop/submitAudit',
    cancelAudit: '/api/tvmall/system/shop/cancelAudit',
    removeShop: '/api/tvmall/system/shop/removeShop',
    goodsList: '/api/tvmall/system/shop/bindableGoodsList',
    shopAddList: '/api/tvmall/system/shop/addShopList',
    bindGoods: '/api/tvmall/system/shop/bindingGoods',
  },
  classify: {
    List: '/api/tvmall/system/category/list',
    classifyTree: '/api/tvmall/system/category/tree',
    Add: '/api/tvmall/system/category/add',
    modify: '/api/tvmall/system/category/modify',
    delete: '/api/tvmall/system/category/delete',
    FirstCategory: '/api/tvmall/system/category/plist',
    Audit: '/api/tvmall/system/category/submit',
    revoke: '/api/tvmall/system/category/revoke',
  },
  order: {
    list: '/api/tvmall/system/order/list',
    detail: '/api/tvmall/system/order/detail',
    shopList: '/api/tvmall/system/shop/tv/list',
  },
  commodity: {
    list: '/api/tvmall/system/goods/list',
    add: '/api/tvmall/system/goods/add',
    update: '/api/tvmall/system/goods/update',
    bindList: '/api/tvmall/system/goods/bindList',
    sendAudit: '/api/tvmall/system/goods/sendAudit',
    reverseAudit: '/api/tvmall/system/goods/reverseAudit',
    updateStatus: '/api/tvmall/system/goods/updateStatus',
    delete: '/api/tvmall/system/goods/delete',
    detail: '/api/tvmall/system/goods/detail',
    propertyList: '/api/tvmall/system/goods/propertyList',
    propertyTable: '/api/tvmall/system/goods/propertyTable',
    categoryTree: '/api/tvmall/system/category/tree',
  },
  audit: {
    listAudit: '/api/tvmall/system/propertyGroup/listAudit',
    auditProperty: '/api/tvmall/system/property/auditProperty',
    shopList: '/api/tvmall/system/shop/auditList',
    shopDetail: '/api/tvmall/system/shop/detail',
    auditShop: '/api/tvmall/system/shop/auditorRespond',
    goodsList: '/api/tvmall/system/goods/auditList',
    goodsDetail: '/api/tvmall/system/goods/detail',
    auditGoods: '/api/tvmall/system/goods/audit',
    classifyList: '/api/tvmall/system/category/audit/list',
    calssifyDetail: '/api/tvmall/system/category/detail',
    audit: '/api/tvmall/system/category/audit'
  }
}

export { mailApi, loginApi }
