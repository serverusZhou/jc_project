import Home from './app/pages/home'
import * as urls from 'Global/urls'

import operateRoutes from 'Modules/Operate/routes'
import adminRoutes from 'Modules/Resource/routes'
import oTTResourceRoutes from 'Modules/OTTResource/routers'

/* =================== 商城 ==================== */
import mallHomeRoutes from 'Modules/MailPage/routes'
/* =================== 商城 ==================== */

const routes = [
  {
    path: urls.HOME,
    exact: true,
    component: Home,
    breadcrumbName: '首页'
  },
  ...operateRoutes,
  ...adminRoutes,
  ...oTTResourceRoutes
]

export { mallHomeRoutes, routes }
