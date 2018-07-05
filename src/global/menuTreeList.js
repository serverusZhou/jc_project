import resource from 'Modules/Resource/menu'
import operate from 'Modules/Operate/menu'
import oTTresource from 'Modules/OTTResource/menu'
import mailPageMenu from 'Modules/MailPage/menu'

const menuTreeList = [
  ...resource,
  ...operate,
  ...mailPageMenu,
  ...oTTresource
]
export default menuTreeList

