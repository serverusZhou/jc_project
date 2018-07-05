const apis = {
  common: {
    auditConfirm: '/api/audit/add/v1',
    auditDetails: '/api/audit/getByServiceId/v1',
    episodeList: '/api/episode/search/v1',
    cateList: '/api/tvms/category/getAllList/v1',
    getSuggestion: '/api/audit/getByServiceId/v1',
    applyCateList: '/api/appcate/listAll/v1', // 应用分类列表
    applyList: '/api/app/query/v1' // 应用分类列表
  },
  goods: {
    goodsList: '/api/tvmall/system/goods/list'
  },
  advertise: {
    allPositionList: '/api/tv/adPosition/listAll/v1',
    list: '/api/tv/ad/query/v1',
    details: '/api/tv/ad/detail/v1',
    add: '/api/tv/ad/create/v1',
    edit: '/api/tv/ad/update/v1',
    deleteAd: '/api/tv/ad/delete/v1',
    enableAd: '/api/tv/ad/updateEnabled/v1',
    classify: {
      list: '/api/tv/adPosition/query/v1',
      operate: '/api/tv/adPosition/updateEnable/v1',
      add: '/api/tv/adPosition/create/v1',
      edit: '/api/tv/adPosition/update/v1',
      deletePosition: '/api/tv/adPosition/delete/v1',
    }
  },
  game: {
    gameList: '/api/game/list/v1',
    onlineGame: '/api/game/online/v1',
    outlineGame: '/api/game/offline/v1',
  },
  homeReco: {
    homeRecoList: '/api/channel/list/v1',
    addChannel: '/api/channel/to/add/v1',
    enableChannel: '/api/channel/updateUseStatus/v1',
    listLayout: '/api/layout/listsByChannelId/v1',
    addLayout: '/api/layout/add/v1',
    editLayout: '/api/layout/update/v1',
    bindContent: '/api/layout/bind/v1',
    deleteLayout: '/api/layout/del/v1',
  },
  order: {
    orderList: '/api/orderCenter/list/v1',
    refund: '/api/refund/manualRefund/v1',
  },
  service: {
    serviceList: '/api/life/service/list/v1',
    updateEnable: '/api/life/service/updateEnable/v1',
    serviceClassifyList: '/api/life/catg/list/v1',
  },
  user: {
    userList: '/api/user/list/v1',
    collectList: '/api/user/collection/list/v1',
    macList: '/api/user/macList/v1',
    accountList: '/api/recharge/account/pageQuery/v1',
    userEnable: '/api/user/enable/v1',
  },
  channel: {
    channelList: '/api/livechannelcate/query/v1',
    deleteChannel: '/api/livechannelcate/delete/v1',
    addChannel: '/api/livechannelcate/create/v1',
    editChannel: '/api/livechannelcate/update/v1',
    addChildChannel: '/api/livechannel/add/v1',
    enableChannel: '/api/livechannelcate/updateEnable/v1',
    channelChildList: '/api/livechannel/list/v1',
    deleteChannelChild: '/api/livechannel/delete/v1',
    editChannelChild: '/api/livechannel/update/v1',
    cancelEnableChannelChild: '/api/livechannel/cancelEnabled/v1',
    enableChannelChild: '/api/livechannel/setEnabled/v1',
    addChannelResource: '/api/livechannelsource/create/v1',
    deleteResource: '/api/livechannelsource/delete/v1',
    sourceList: '/api/livechannelsource/query/v1',
    setRecommended: '/api/livechannel/setRecommended/v1',
    cancelRecommended: '/api/livechannel/cancelRecommended/v1',
  },
  vedio: {
    vedioCateList: '/api/tv/operationcate/query/v1',
    addVedioCate: '/api/tv/operationcate/create/v1',
    editVedioCate: '/api/tv/operationcate/update/v1',
    deleteVedioCate: '/api/tv/operationcate/delete/v1',
    enabledVedioCate: '/api/tv/operationcate/updateEnable/v1',
    sourceList: '/api/tv/operationcateepisode/query/v1',
    deleteResource: '/api/tv/operationcateepisode/delete/v1',
    addResource: '/api/tv/operationcateepisode/create/v1',
    queryAllTags: '/api/tv/operationtag/queryByParentId/v1',
    tagsList: '/api/tv/operationtag/query/v1',
    deleteTag: '/api/tv/operationtag/delete/v1',
    addTag: '/api/tv/operationtag/create/v1',
    modify: '/api/tv/operationtag/update/v1'
  },
  lookLoop: {
    lookLoopList: '/api/lookLoop/list/v1',
    deleteLookLoop: '/api/lookLoop/del/v1',
    addLookLoop: '/api/lookLoop/add/v1',
  },
  application: {
    applicationList: '/api/app/query/v1',
    appCate: '/api/appcate/listAll/v1',
    add: '/api/app/create/v1',
    edit: '/api/app/update/v1',
    update: '/api/appversion/create/v1',
    detail: '/api/app/detail/v1',
    delete: '/api/app/delete/v1',
    updateEnabled: '/api/appversion/updateEnabled/v1',
    audit: '/api/audit/listByServiceId/v1',
  },
  operaterpic: {
    detail: '/api/operaterpic/detail/v1',
    add: '/api/operaterpic/add/v1',
    delete: '/api/operaterpic/delete/v1',
  },
}

export default apis
