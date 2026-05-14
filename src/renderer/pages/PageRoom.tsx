import AppHeader from "../layout/AppHeader";
import PlatformSettings from "../widgets/search/PlatformSettings";
import RoomGenerator from "../widgets/search/RoomGenerator";
import AppContent from "../layout/AppContent";

const PageRoom: React.FC = function () {
  return (
    <>
      <AppHeader>
        <h2 style={{ marginTop: 0 }}>添加房间</h2>
      </AppHeader>
      <AppContent>
        <RoomGenerator />
        <PlatformSettings />
      </AppContent>
    </>
  );
};

export default PageRoom;
