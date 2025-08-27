import LiveSettings from "../widgets/settings/LiveSettings";
import AppHeader from "../layout/AppHeader";
import AppContent from "../layout/AppContent";

const PageSettings: React.FC = function () {
  return (
    <>
      <div>
        <AppHeader>
          <h2 style={{ marginTop: 0 }}>设置</h2>
        </AppHeader>
        <AppContent>
          <LiveSettings />
        </AppContent>
      </div>
    </>
  );
};

export default PageSettings;
