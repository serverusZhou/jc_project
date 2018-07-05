import { reducer as actor } from './actor/reduck'
import { reducer as audit } from './audit/reduck'
import { reducer as auths } from './auths/reduck'
import { reducer as role } from './role/reduck'
import { reducer as classify } from './classify/reduck'
import { reducer as license } from './resource/license/reduck'
import { reducer as third } from './resource/third/reduck'

export const reducers = {
  actor,
  audit,
  auths,
  role,
  classify,
  license,
  third,
}
