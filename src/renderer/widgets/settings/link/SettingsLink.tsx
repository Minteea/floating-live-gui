import Section from "@/components/settings/SettingSection";
import LinkStatusTag from "./components/LinkStatusTag";
import LinkUrlInput from "./LinkUrlInput";

/** 搜索及添加直播间的组件 */
const SettingsLink: React.FC = function () {
  return (
    <Section title={<span>连接服务设置</span>} control={<LinkStatusTag />}>
      <LinkUrlInput />
    </Section>
  );
};

export default SettingsLink;
