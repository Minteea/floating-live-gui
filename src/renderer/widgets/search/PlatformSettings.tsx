import { Divider } from "antd";

import PlatformAuth from "./PlatformAuth";
import { $searchPlatform } from "../../../renderer/store";
import { useStore } from "@nanostores/react";
import { $platform } from "../../../renderer/controller";

// const handleChange = (value: string) => {
//   console.log(`selected ${value}`);
// };

/** 平台设置 */
const PlatformSettings: React.FC = function () {
  const platform = useStore($searchPlatform);
  const platformName = useStore($platform)[platform]?.name || platform;
  return (
    <div style={{ display: platform ? "" : "none" }}>
      <Divider />
      <h3>平台设置 - {platformName}</h3>
      <PlatformAuth platform={platform} />
    </div>
  );
};

export default PlatformSettings;
