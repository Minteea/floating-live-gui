import AppHeader from "../layout/AppHeader";
import AppContent from "../layout/AppContent";
import StorePlugins from "../controller/plugins/store/plugins";
import { $installedPlugins, $internalPlugins } from "../controller";
import { useStore } from "@nanostores/react";
import { Button } from "antd";

const PagePlugin: React.FC = function () {
  return (
    <>
      <div>
        <AppHeader>
          <h2 style={{ marginTop: 0 }}>插件管理</h2>
        </AppHeader>
        <AppContent>
          <h3>已安装插件</h3>
          <InstalledPlugins />
          <h3>内置插件</h3>
          <InternalPlugins />
        </AppContent>
      </div>
    </>
  );
};


const InstalledPlugins: React.FC = function () {
  const installedPlugins = useStore($installedPlugins);
  return (
    <div>
      {installedPlugins.map((p) => (
        <div key={p.get().pluginName}>{p.get().open ? "🟢" : "⚪"}{p.get().pluginName}</div>
      ))}
    </div>
  );
}

const InternalPlugins: React.FC = function () {
  const internalPlugins = useStore($internalPlugins);
  return (
    <div>
      {internalPlugins.map((p) => (
        <div key={p.pluginName}>{p.pluginName}</div>
      ))}
    </div>
  );
}

export default PagePlugin;
