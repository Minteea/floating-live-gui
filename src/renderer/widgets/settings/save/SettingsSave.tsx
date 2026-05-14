import React from "react";
import Section from "@/components/settings/SettingSection";
import SaveMessageSwitch from "./SaveMessageSwitch";
import SaveRawSwitch from "./SaveRawSwitch";
import SavePathSetting from "./SavePathSetting";

const SettingsSave: React.FC = function () {
  return (
    <Section title={<span>弹幕保存设置</span>}>
      <SaveMessageSwitch />
      <SaveRawSwitch />
      <SavePathSetting />
    </Section>
  );
};

export default SettingsSave;
