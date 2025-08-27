import version from "../controller/version";
import LinkSettings from "../widgets/link/LinkSettings";
import ServerSettings from "../widgets/server/ServerSettings";
import AppHeader from "../layout/AppHeader";
import AppContent from "../layout/AppContent";

const PageServer: React.FC = function () {
  if (version.client == "electron") {
    return (
      <div>
        <AppHeader>
          <h2 style={{ marginTop: 0 }}>本地服务</h2>
        </AppHeader>
        <AppContent>
          <ServerSettings />
        </AppContent>
      </div>
    );
  }
  return (
    <div>
      <h2>连接服务</h2>
      <LinkSettings />
    </div>
  );
};

export default PageServer;
