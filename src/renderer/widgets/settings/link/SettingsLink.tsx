import Section from "@/components/settings/SettingSection";
import LinkStatusTag from "./components/LinkStatusTag";
import LinkUrlInput from "./LinkUrlInput";
import { useStore } from "@nanostores/react";
import { $values } from "@/controller";

/** 搜索及添加直播间的组件 */
const SettingsLink: React.FC = function () {
  const values = useStore($values);
  const linkConnected = values["link.connected"];
  return (
    <Section title={<span>连接服务设置</span>} control={<LinkStatusTag />}>
      <LinkUrlInput />
    </Section>
  );
};

export default SettingsLink;
