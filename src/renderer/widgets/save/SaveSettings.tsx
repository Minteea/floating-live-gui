import SaveMessageSwitch from "../settings/save/SaveMessageSwitch";
import SaveRawSwitch from "../settings/save/SaveRawSwitch";
import SavePathSetting from "../settings/save/SavePathSetting";
import type {} from "@floating-live/plugin-save";

/** 兼容旧路径的转发组件（保留行为不变） */
const SavingSettings: React.FC = function () {
  return (
    <div>
      <SaveMessageSwitch />
      <SaveRawSwitch />
      <SavePathSetting />
    </div>
  );
};

export default SavingSettings;
