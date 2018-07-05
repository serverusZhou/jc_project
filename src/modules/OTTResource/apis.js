const apis = {
  common: {
    auditConfirm: '/api/audit/add/v1',
    auditDetails: '/api/audit/getByServiceId/v1',
    episodeList: '/api/episode/search/v1',
    cateList: '/api/tvms/category/getAllList/v1',
  },
  channel: {
    channelList: '/api/channel/yx/list/v1',
    deleteChannel: '/api/channel/yx/delete/v1',
    addChannel: '/api/channel/yx/add/v1',
    modifyChannel: '/api/channel/yx/update/v1',
    channelCards: '/api/lego/yx/detail/v1',
    updateCards: '/api/lego/yx/update/v1',
  },
  category: {
    categorylList: '/api/catgory/yx/query/v1',
    deleteCategory: '/api/catgory/yx/delete/v1',
    addCategory: '/api/catgory/yx/create/v1',
    editCategory: '/api/catgory/yx/update/v1',
    enableChannel: '/api/catgory/yx/updateEnable/v1',
    sourceList: '/api/categoryepisode/yx/query/v1',
    addCategoryResource: '/api/categoryepisode/yx/create/v1',
    deleteResource: '/api/categoryepisode/yx/delete/v1',
  },
  media: {
    list: '/api/lego/yx/detail/other/v1',
    update: '/api/lego/yx/update/other/v1',
    channel: '/api/channel/yx/other/v1',
  }
}
export default apis
