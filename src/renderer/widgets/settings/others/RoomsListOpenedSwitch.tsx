import { Switch } from "antd";
import { $values } from "@/controller";
import { useStore } from "@nanostores/react";
import { $roomsListOpened } from "@/store";
import SettingItem from "@/components/settings/SettingItem";

const RoomsListOpenedSwitch: React.FC = function () {
  useStore($values);
  const roomsListOpened = useStore($roomsListOpened);
  return (
    <SettingItem
      title={<span>单独列出已打开的房间</span>}
      control={
        <Switch checked={roomsListOpened} onClick={() => $roomsListOpened.set(!roomsListOpened)} />
      }
    />
  );
};

export default RoomsListOpenedSwitch;
