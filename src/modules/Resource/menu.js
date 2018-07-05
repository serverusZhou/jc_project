import * as urls from 'Global/urls'
// import { tvmallUrl } from '../../config'

// import storage from 'Utils/storage'
// const userInfo = storage.get('userInfo')
// const ticket = (userInfo && userInfo.ticket) ? userInfo.ticket : ''

export default [
  {
    name: '媒资库管理',
    url: urls.RESOURCE,
    icon: 'book',
    children: [
      {
        name: '媒资管理',
        url: urls.RESOURCE_MEDIA,
        menuKey: 'resourceMedia',
        icon: 'folder',
        children: [
          {
            name: '牌照方媒资管理',
            url: urls.RESOURCE_MEDIA_LICENSE,
            icon: 'file',
          },
          {
            name: '三方媒资管理',
            url: urls.RESOURCE_MEDIA_THIRD,
            icon: 'file',
          }
        ]
      },
      {
        name: '介质管理',
        menuKey: 'resourceMediaAdd',
        url: urls.RESOURCE_MEDIA_ADD,
        icon: 'file-text',
      },
      {
        name: '分类管理',
        url: urls.RESOURCE_CLASSIFY,
        menuKey: 'resourceClassify',
        icon: 'appstore-o',
        children: [
          {
            name: '全部分类',
            url: urls.RESOURCE_CLASSIFY_MANAGE,
            icon: 'file',
          },
          // 一期不做
          // {
          //   name: '字段模版',
          //   url: urls.RESOURCE_CLASSIFY_TEMPLATE,
          //   icon: 'file-text',
          // }
        ]
      },
      {
        name: '演员管理',
        url: urls.RESOURCE_ACTOR,
        menuKey: 'resourceActor',
        icon: 'idcard',
      },
      {
        name: '审核管理',
        url: urls.RESOURCE_AUDIT,
        menuKey: 'resourceAudit',
        icon: 'edit',
        children: [
          {
            name: '媒资审核',
            url: urls.RESOURCE_AUDIT_MEDIA,
            icon: 'file-text',
          },
          {
            name: '界面审核',
            url: urls.RESOURCE_AUDIT_INTERPHASE,
            icon: 'picture',
          },
          {
            name: '广告位审核',
            url: urls.RESOURCE_AUDIT_ADVERTISE_POSITION,
            icon: 'environment',
          },
          {
            name: '广告推荐审核',
            url: urls.RESOURCE_AUDIT_ADVERTISE,
            icon: 'notification',
          },
          {
            name: '频道分类审核',
            url: urls.RESOURCE_AUDIT_LIVE_CATE,
            icon: 'appstore',
          },
          {
            name: '频道审核',
            url: urls.RESOURCE_AUDIT_LIVE_CHANNEL,
            icon: 'hdd',
          },
          {
            name: '影视分类审核',
            url: urls.RESOURCE_AUDIT_OPERATION,
            icon: 'layout',
          },
          {
            name: '商品审核',
            url: `${urls.AUDIT_GOODS}`,
            icon: 'barcode',
          },
          {
            name: '应用审核',
            url: urls.RESOURCE_AUDIT_APPLY,
            icon: 'camera-o',
          },
          {
            name: '运营图审核',
            url: urls.RESOURCE_AUDIT_OPERATEPIC,
            icon: 'picture',
          }
        ]
      },
      {
        name: '有象审核',
        url: urls.OTTRESOURCE_AUDIT,
        menuKey: 'yxResourceAudit',
        icon: 'edit',
        children: [
          {
            name: '频道审核',
            url: urls.OTTRESOURCE_AUDIT_CHANNEL,
            icon: 'file-text',
          },
          {
            name: '分类审核',
            url: urls.OTTRESOURCE_AUDIT_CATEGORY,
            icon: 'file-text',
          },
          {
            name: '点播审核',
            url: `${urls.OTTRESOURCE_AUDIT_MEDIA}?1`,
            icon: 'picture',
          },
          {
            name: '资讯审核',
            url: `${urls.OTTRESOURCE_AUDIT_MEDIA}?2`,
            icon: 'environment',
          },
          {
            name: '推荐审核',
            url: `${urls.OTTRESOURCE_AUDIT_MEDIA}?3`,
            icon: 'notification',
          }
        ]
      },
      {
        name: '权限管理',
        url: urls.RESOURCE_AUTHS,
        menuKey: 'resourceAuths',
        icon: 'safety',
      },
      {
        name: '角色管理',
        url: urls.RESOURCE_ROLE,
        menuKey: 'resourceRole',
        icon: 'user',
      },
    ],
  }
]
