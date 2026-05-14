import SettingsSave from "./save/SettingsSave";
import RoomsListOpenedSwitch from "./others/RoomsListOpenedSwitch";
import RoomsStartupSwitch from "./others/RoomsStartupSwitch";
import SettingSection from "@/components/settings/SettingSection";
import version from "@/controller/version";
import SettingsServer from "./server/SettingsServer";
import SettingsLink from "./link/SettingsLink";

/** 搜索及添加直播间的组件 */
const LiveSettings: React.FC = function () {
  return (
    <div>
      <SettingsSave />
      {version.client == "electron" ? <SettingsServer /> : <SettingsLink />}

      <SettingSection title={<span>其他设置</span>}>
        <RoomsStartupSwitch />
        <RoomsListOpenedSwitch />
      </SettingSection>
    </div>
  );
};

export default LiveSettings;
