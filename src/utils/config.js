let baseUrl = 'http://39.105.11.17:8083/'
// let imgPrefix = 'https://tvmallimg.jcease.com/'
// let imgPrefix = 'http:// tv-mall-test.oss-cn-beijing.aliyuncs.com'
let daxiang = 'http://test-admin-tv.dx-groups.com/'

let region = 'oss-cn-beijing'
let bucket = 'tv-ott-test'   // 测试

if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://wapitvmall.jcease.com/'
  daxiang = 'https://admin-tv.dx-groups.com/'
  if (TEST) {
    console.log('in TEST')
    baseUrl = 'http://test.wapi.tvmall.jcease.com/'
    daxiang = 'http://test-admin-tv.dx-groups.com/'
    console.log(baseUrl)
  }
  if (PRE) {
    console.log('in PRE')
    baseUrl = 'https://prewapitvmall.jcease.com/'
    daxiang = 'https://pre-admin-tv.dx-groups.com/'
    console.log(baseUrl)
  }
  if (DEV) {
    console.log('in DEV')
    baseUrl = 'http://39.105.11.17:8083/'
    daxiang = 'http://dev-admin-tv.dx-groups.com/'
    bucket = 'tv-ott-prod'
  }
}

const UPLOAD_CONST = {
  region,
  bucket,
}

export { UPLOAD_CONST, baseUrl, daxiang, imgPrefix }
