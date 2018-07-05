const apis = {
  media: {
    add: '/api/ms/admin/episode/add',
    update: '/api/ms/admin/episode/update',
    detail: '/api/ms/admin/episode/view',
    list: '/api/ms/admin/episode/search',
    arraignment: '/api/audit/add/v1',
    addEpisode: '/api/ms/admin/episode/media/add',
    addTitbits: '/api/ms/admin/episode/highlight/add',
    editVideoUrl: '/api/ms/admin/episode/update/url',
    passstatus: 'api/ms/admin/episode/passstatus/update',
    categoryList: '/api/tvms/category/getListByCatgParentId/v1',
    enable: '/api/ms/admin/episode/update/enable',
    deleteMedia: '/api/ms/admin/episode/delete'
  },
  actor: {
    add: '/api/ms/admin/actor/add/v1',
    update: '/api/ms/admin/actor/update/v1',
    detail: '/api/ms/admin/actor/view/v1',
    list: '/api/ms/admin/actor/search/v1',
    selectList: '/api/ms/admin/actor/query/v1',
    delete: '/api/ms/admin/actor/delete/v1',
    shelvesMedia: '/api/ms/admin/actor/update/episode/status',
    shelvesActor: '/api/ms/admin/actor/update/status',
  },
  class: {
    add: '/api/tvms/category/create/v1',
    update: '/api/tvms/category/update/v1',
    list: '/api/tvms/category/getAllList/v1',
    delete: '/api/tvms/category/delete/v1',
  },
  template: {
    add: '/api/ms/admin/attr/other/add',
    update: '/api/ms/admin/attr/other/update',
    list: '/api/ms/admin/attr/other/list',
    delete: '/api/ms/admin/attr/other/delete',
    detail: '/api/ms/admin/attr/other/view',
  },
  auths: {
    allrole: '/api/role/all/v1',
    add: '/api/admin/add/v1',
    update: '/api/admin/update/v1',
    detail: '/api/admin/detail/v1',
    list: '/api/admin/list/v1',
    unfreeze: '/api/admin/unfreeze/v1',
    freeze: '/api/admin/freeze/v1'
  },
  role: {
    add: '/api/role/add/v1',
    update: '/api/role/update/v1',
    detail: '/api/role/detail/v1',
    list: '/api/role/list/v1',
    delete: '/api/role/delete/v1',
  },
  audit: {
    media: {
      list: '/api/ms/admin/episode/search',
      auditList: '/api/audit/listAuditedByType/v1',
      detail: '/api/ms/admin/episode/video/preview',
      auditdetail: '/api/audit/getByServiceId/v1',
      auditLog: '/api/audit/listByServiceId/v1',
      postAduit: '/api/audit/add/v1',
      postEpisodeAudit: '/api/audit/add/v1'
    },
    advertisePosition: {
      list: '/api/tv/adPosition/query/v1',
      auditList: '/api/audit/listAuditedByType/v1',
      detail: '/api/tv/ad/detail/v1',
      auditDetail: '/api/audit/getByServiceId/v1',
      auditLog: '/api/audit/listByServiceId/v1',
      postAduit: '/api/audit/add/v1'
    },
    advertise: {
      list: '/api/tv/ad/query/v1',
      auditList: '/api/audit/listAuditedByType/v1',
      detail: '/api/tv/ad/detail/v1',
      auditDetail: '/api/audit/getByServiceId/v1',
      auditLog: '/api/audit/listByServiceId/v1',
      postAduit: '/api/audit/add/v1'
    },
    interphase: {
      list: '/api/channel/list/v1',
      auditList: '/api/audit/listAuditedByType/v1',
      detail: '/api/channel/detail/v1',
      auditDetail: '/api/audit/getByServiceId/v1',
      auditLog: '/api/audit/listByServiceId/v1',
      postAduit: '/api/audit/add/v1'
    },
    live: {
      cate: {
        list: '/api/livechannelcate/query/v1',
        auditList: '/api/audit/listAuditedByType/v1',
        detail: '/api/livechannelcate/detail/v1',
        auditDetail: '/api/audit/getByServiceId/v1',
        auditLog: '/api/audit/listByServiceId/v1',
        postAduit: '/api/audit/add/v1'
      },
      channel: {
        list: '/api/livechannel/list/v1',
        auditList: '/api/audit/listAuditedByType/v1',
        detail: '/api/livechannel/detail/v1',
        auditDetail: '/api/audit/getByServiceId/v1',
        auditLog: '/api/audit/listByServiceId/v1',
        postAduit: '/api/audit/add/v1'
      }
    },
    operate: {
      list: '/api/tv/operationcate/query/v1',
      auditList: '/api/audit/listAuditedByType/v1',
      detail: '/api/tv/operationcate/detail/v1',
      auditDetail: '/api/audit/getByServiceId/v1',
      auditLog: '/api/audit/listByServiceId/v1',
      postAduit: '/api/audit/add/v1'
    },
    apply: {
      list: '/api/app/query/v1',
      auditList: '/api/audit/listAuditedByType/v1',
      auditedDetail: '/api/audit/getByServiceId/v1', // 已审核详情
      unAuditedDetail: '/api/appversion/detail/v1', // 未审核详情
      aduit: '/api/audit/add/v1' // 审核
    },
    operatepic: {
      list: '/api/operaterpic/list/v1',
      auditList: '/api/audit/listAuditedByType/v1',
      unAuditedDetail: '/api/operaterpic/detail/v1',
    },
    ottCategory: {
      list: '/api/catgory/yx/query/v1',
      auditList: '/api/audit/listAuditedByType/v1',
      auditedDetail: '/api/audit/getByServiceId/v1', // 已审核详情
      detail: '/api/catgory/yx/detail/v1',
      audit: '/api/audit/add/v1',
      auditLog: '/api/audit/listByServiceId/v1',
    },
    ottChannel: {
      list: '/api/channel/yx/find/v1',
      auditList: '/api/audit/listAuditedByType/v1',
      auditedDetail: '/api/audit/getByServiceId/v1', // 已审核详情
      detail: '/api/channel/yx/detail/v1',
      audit: '/api/audit/add/v1',
      auditLog: '/api/audit/listByServiceId/v1'
    },
    ottMedia: {
      auditList: '/api/audit/listAuditedByType/v1',
      detail: 'api/channel/yx/detail/v1',
      auditDetail: '/api/audit/getByServiceId/v1',
      auditLog: '/api/audit/listByServiceId/v1',
      postAduit: '/api/audit/add/v1',
      auditedList: 'api/audit/listAuditedByType/v1',
      unAuditedList: '/api/channel/yx/other/find/v1',
    }
  }
}
export default apis
