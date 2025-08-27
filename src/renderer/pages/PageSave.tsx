import SaveSettings from "../widgets/save/SaveSettings";
import AppHeader from "../layout/AppHeader";
import AppContent from "../layout/AppContent";

const PageSave: React.FC = function () {
  return (
    <div>
      <AppHeader>
        <h2 style={{ marginTop: 0 }}>弹幕保存</h2>
      </AppHeader>
      <AppContent>
        <SaveSettings />
      </AppContent>
    </div>
  );
};

export default PageSave;
