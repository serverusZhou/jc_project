let baseUrl = 'http://realtest.youxiang0210.com' // 开发服务器  test01,admin,zhw

if (process.env.REACT_APP_URLCENTER === 'production') {
    /* 正式环境 */
  baseUrl = 'http://daxiangapi.youxiang0210.com' // 线上正式服务器临时接口
    // baseUrl = 'http://dxapi.youxiang0210.com'; // 线上正式服务器
}

if (process.env.REACT_APP_URLCENTER === 'test') {
    /* 测试环境 */
  baseUrl = 'http://realtest.youxiang0210.com'
}

if (process.env.REACT_APP_URLCENTER === 'dev') {
    /* 开发环境 */
  baseUrl = 'http://realtest.youxiang0210.com'
}

let baseTvUrl = 'http://dxapiforboss.youxiangtv.com'
let imgPrefix = 'https://image.youxiang0210.com/'
let videoPrefix = 'https://video.youxiang0210.com/'

const handleVideoUrl = (url) => {
  if (!url) return ''
  if (url.includes('http') || url.includes('https')) {
    return url
  }
  return videoPrefix + url
}

export { baseUrl, baseTvUrl, imgPrefix, videoPrefix, handleVideoUrl }
