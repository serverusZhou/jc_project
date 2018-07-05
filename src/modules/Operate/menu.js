import * as urls from 'Global/urls'

export default [
  {
    name: '视听中心',
    url: urls.OPERATE,
    icon: 'video-camera',
    children: [
      {
        name: '广告管理',
        url: urls.OPERATE_ADVERTISE,
        menuKey: 'operateAdvertise',
        icon: 'book',
        children: [
          {
            name: '广告管理',
            url: urls.OPERATE_ADVERTISE_MANAGE,
            icon: 'sound',
          },
          {
            name: '广告位管理',
            url: urls.OPERATE_ADVERTISE_CLASSFIY,
            icon: 'tag-o',
          }
        ],
      },
      {
        name: '首页推荐',
        url: urls.OPERATE_HOME_MANAGE,
        menuKey: 'operateHomeReco',
        icon: 'laptop',
      },
      {
        name: '影视推荐',
        url: urls.OPERATE_VEDIO_RECO_MANAGE,
        menuKey: 'operateVedioReco',
        icon: 'sound',
      },
      // {
      //   name: '游戏中心',
      //   url: urls.OPERATE_GAME,
      //   menuKey: 'operateGame',
      //   icon: 'book',
      //   children: [
      //     {
      //       name: '游戏中心',
      //       url: urls.OPERATE_GAME_CENTER,
      //       icon: 'credit-card',
      //     },
      //     {
      //       name: '分类管理',
      //       url: urls.OPERATE_GAME_CLASSFIY,
      //       icon: 'file-text',
      //     }
      //   ],
      // },
      // {
      //   name: '生活服务中心',
      //   url: urls.OPERATE_SERVICE,
      //   menuKey: 'operateLifeService',
      //   icon: 'book',
      //   children: [
      //     {
      //       name: '生活服务中心',
      //       url: urls.OPERATE_SERVICE_CENTER,
      //       icon: 'credit-card',
      //     },
      //     {
      //       name: '分类管理',
      //       url: urls.OPERATE_SERVICE_CLASSFIY,
      //       icon: 'file-text',
      //     }
      //   ],
      // },
      {
        name: '游戏中心',
        menuKey: 'operateGame',
        url: urls.OPERATE_GAME_CENTER,
        icon: 'rocket',
      },
      {
        name: '生活服务中心',
        menuKey: 'operateLifeService',
        url: urls.OPERATE_SERVICE_CENTER,
        icon: 'customer-service',
      },
      {
        name: '用户中心',
        url: urls.OPERATE_USER_CENTER,
        menuKey: 'operateUserCenter',
        icon: 'user',
      },
      {
        name: '订单中心',
        url: urls.OPERATE_ORDER,
        menuKey: 'operateOrder',
        icon: 'shopping-cart',
      },
      {
        name: '频道管理',
        url: urls.OPERATE_CHANNEL_CATE,
        menuKey: 'operateChannel',
        icon: 'folder',
      },
      {
        name: '影视分类管理',
        url: urls.OPERATE_VEDIO_CATE,
        menuKey: 'operateVedio',
        icon: 'folder',
      },
      {
        name: '看了又看',
        url: urls.OPERATE_LOOK_LOOP,
        menuKey: 'operateLookLoop',
        icon: 'picture',
      },
      {
        name: '应用中心',
        url: urls.OPERATE_APP_CENTER,
        menuKey: 'operateAppCenter',
        icon: 'picture',
      },
    ]
  },
]
