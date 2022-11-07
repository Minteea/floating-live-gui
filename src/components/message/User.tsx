import MessageData from "floating-living/src/Message/MessageData"
import { getAdminType } from "../../utils/nameUtils"
import platform from "../../utils/platform"

/** 用户 */
const User: React.FC<{
  msg: MessageData
}> = function(props) {
  let msg = props.msg
  let user = msg.info.user
  if(!user) return null
  let e_medal = user.medal ? 
    <>[
      <span>{user.medal.name}</span>
      <span>({user.medal.level})</span>
      ]
    </>
    : null
  return (
    <span>
      {e_medal}
      {user.privilege ? <span>[{platform.getPrivilegeName(msg.platform, user.privilege)}]</span> : null}
      {user.admin ? <span>[{getAdminType(user.admin)}]</span> : null}
      <span>{user.name}</span>
    </span>
  )
}

export default User