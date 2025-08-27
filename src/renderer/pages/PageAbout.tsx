import { Button, Divider, version as antd_version } from "antd";
import React from "react";
import { controller } from "../controller";
import version from "../controller/version";
import AppHeader from "../layout/AppHeader";
import AppContent from "../layout/AppContent";

const PageAbout: React.FC = function () {
  return (
    <div>
      <AppHeader>
        <h2 style={{ marginTop: 0 }}>关于</h2>
      </AppHeader>
      <AppContent>
        <div>
          <div>
            <b>Floating Live GUI</b> {version.app ? `v${version.app}` : null}
          </div>
          <div>{version.client} 模式</div>
          {version.floating ? (
            <div>floating-live@{version.floating}</div>
          ) : null}
          <Divider size="small" />
          <div>界面库：react@{version.react}</div>
          <div>UI组件库：antd@{antd_version}</div>
          <Divider size="small" />
          {version.client == "electron" ? (
            <>
              <div>运行时：Node v{version.node}</div>
              <div>GUI框架：Electron v{version.electron}</div>
              <div>GUI内核：Chromium v{version.chrome}</div>
              <div>操作系统平台：{version.platform}</div>
            </>
          ) : (
            <>
              <div>
                浏览器: {version.browser?.[0]} {version.browser?.[1]} (
                {version.browser?.[2]})
              </div>
            </>
          )}
        </div>
        <Divider size="small" />
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
      </AppContent>
    </div>
  );
};

export default PageAbout;
