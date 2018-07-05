let operateUrl = 'http://39.105.25.40:8192'
let resourceUrl = 'http://39.105.25.40:8182'
let tvmallUrl = '/'
let tvmallReqUrl = '/'

if (process.env.NODE_ENV === 'production') {
  operateUrl = 'https://wapi-tv.youxiangtv.com'
  resourceUrl = 'https://wapi-tv-ms.youxiangtv.com'
  tvmallUrl = 'https://admintvmall.youxiangtv.com'
  tvmallReqUrl = 'http://wapi.tvmall.jcease.com'
  if (TEST) {
    console.log('in TEST')
    operateUrl = 'http://39.105.25.40:8192'
    resourceUrl = 'http://39.105.25.40:8182'
    tvmallUrl = 'http://test.admin.tvmall.jcease.com'
    tvmallReqUrl = 'http://test.wapi.tvmall.jcease.com'
  }
  if (DEV) {
    console.log('in DEV')
    operateUrl = 'http://39.105.25.40:8192'
    resourceUrl = 'http://39.105.25.40:8182'
    tvmallUrl = 'http://dev.admin.tvmall.jcease.com'
    tvmallReqUrl = 'http://dev.wapi.tvmall.jcease.com'
  }
  if (PRE) {
    console.log('in PRE')
    operateUrl = 'https://wapi-tv.youxiangtv.com'
    resourceUrl = 'https://wapi-tv-ms.youxiangtv.com'
    tvmallUrl = 'https://admintvmall.youxiangtv.com'
    tvmallReqUrl = 'http://pre.wapi.tvmall.jcease.com'
  }
}

export { operateUrl, resourceUrl, tvmallUrl, tvmallReqUrl }
