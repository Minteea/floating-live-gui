import ServerOpenSwitch from "../settings/server/ServerOpenSwitch";
import ServerPortInput from "../settings/server/ServerPortInput";

/** 兼容旧路径的转发组件（保留行为不变） */
const ServerSettings: React.FC = function () {
  return (
    <div>
      <ServerOpenSwitch />
      <ServerPortInput />
    </div>
  );
};

export default ServerSettings;
