import { Button, Divider, Select } from "antd";
import { store } from "../../store";
import { useAtomValue } from "jotai";
import PlatformAuth from "./PlatformAuth";

const { Option } = Select;
const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

/** 平台设置 */
const PlatformSettings: React.FC = function () {
  const platform = useAtomValue(store.search.platform);
  const authOptions = useAtomValue(store.auth.options)[platform];
  return (
    <div style={{ display: authOptions ? "" : "none" }}>
      <Divider />
      <h3>平台设置 - {platform}</h3>
      <PlatformAuth platform={platform} options={authOptions} />
    </div>
  );
};

export default PlatformSettings;
