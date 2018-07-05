import * as urls from 'Global/urls'

export default [
  {
    name: '有象快搜',
    url: urls.OTT_SEARCH,
    icon: 'book',
    children: [
      {
        name: '频道配置',
        url: urls.OTT_CHANNEL,
        menuKey: 'ottChannel',
        icon: 'safety',
      },
      {
        name: '影视分类',
        url: urls.OTT_CATGORY,
        menuKey: 'ottCatgory',
        icon: 'safety',
      },
      {
        name: '点播配置',
        url: `${urls.OTT_MEDIA}?1`,
        menuKey: 'ottDemand',
        icon: 'safety',
      },
      {
        name: '资讯配置',
        url: `${urls.OTT_MEDIA}?2`,
        menuKey: 'ottInfo',
        icon: 'safety',
      },
      {
        name: '推荐配置',
        url: `${urls.OTT_MEDIA}?3`,
        menuKey: 'ottRecommend',
        icon: 'safety',
      },
    ],
  }
]
