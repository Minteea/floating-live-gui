import { UserInfo } from 'floating-live';
import { MessageData } from 'floating-live/src/types/message/MessageData';
import { getAdminType } from '../../utils/nameUtils';
import platform from '../../utils/platform';

/** 用户 */
const User: React.FC<{
  msg: MessageData & { info: { user: UserInfo } };
}> = function (props) {
  const { msg } = props;
  const { user } = msg.info;
  if (!user) return null;
  const e_medal = user.medal ? (
    <>
      [<span>{user.medal.name}</span>
      <span>({user.medal.level})</span>]
    </>
  ) : null;
  return (
    <span>
      {e_medal}
      {user.membership ? (
        <span>[{platform.getPrivilegeName(msg.platform, user.membership)}]</span>
      ) : null}
      {user.identity ? <span>[{getAdminType(user.identity)}]</span> : null}
      <span>{user.name}</span>
    </span>
  );
};

export default User;
