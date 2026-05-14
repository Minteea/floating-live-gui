import React from "react";
import Section from "@/components/settings/SettingSection";
import version from "@/controller/version";
import ServerOpenSwitch from "./ServerOpenSwitch";
import ServerPortInput from "./ServerPortInput";

const SettingsServer: React.FC = function () {
  return (
    <Section title={<span>本地服务设置</span>}>
      <ServerOpenSwitch />
      <ServerPortInput />
    </Section>
  );
};

export default SettingsServer;
