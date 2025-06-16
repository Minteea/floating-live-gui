import { Button, version as antd_version } from "antd";
import React from "react";
import { controller } from "../controller";
import version from "../controller/version";

const PageAbout: React.FC = function () {
  return (
    <div>
      <h2>关于</h2>
      <div>
        <div>
          <b>Floating Live GUI</b>{" "}
          {version.app ? `[DEV] 版本 v${version.app}` : null}
        </div>
        <div>{version.client} 模式</div>
        {version.floating ? (
          <div>floating-live版本：v{version.floating}</div>
        ) : null}
        <div>----------</div>
        <div>React版本: v{version.react}</div>
        <div>界面库版本: Ant Design v{antd_version}</div>
        <div>----------</div>
        {version.client == "electron" ? (
          <>
            <div>Node版本: v{version.node}</div>
            <div>Electron版本: v{version.electron}</div>
            <div>Chrome版本: v{version.chrome}</div>
            <div>操作系统平台: {version.platform}</div>
          </>
        ) : (
          <>
            <div>
              浏览器版本: {version.browser?.[0]} {version.browser?.[1]} (
              {version.browser?.[2]})
            </div>
          </>
        )}
      </div>
      <div>
        {version.client == "electron" ? (
          <Button
            onClick={() => {
              controller.command("devtools");
            }}
          >
            打开控制台(Ctrl+Shift+I)
          </Button>
        ) : (
          "按F12打开控制台"
        )}
      </div>
    </div>
  );
};

export default PageAbout;
