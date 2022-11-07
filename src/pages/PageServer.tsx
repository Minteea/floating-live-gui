import version from "../controller/version";
import LinkSettings from "../widgets/link/LinkSettings";
import ServerSettings from "../widgets/server/ServerSettings";

const PageServer: React.FC = function() {
  if (version.client == "electron") {
    return (
      <div>
        <h2>本地服务</h2>
        <ServerSettings />
      </div>
    )
  } else {
    return (
      <div>
        <h2>连接服务</h2>
        <LinkSettings />
      </div>
    )
  }
}

export default PageServer