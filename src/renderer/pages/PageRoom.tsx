import PlatformSettings from "../widgets/search/PlatformSettings";
import RoomGenerator from "../widgets/search/RoomGenerator";

const PageRoom: React.FC = function () {
  return (
    <div>
      <h2>添加房间</h2>
      <RoomGenerator />
      <PlatformSettings />
    </div>
  );
};

export default PageRoom;
