import AppHeader from "../layout/AppHeader";
import AppContent from "../layout/AppContent";
import { $installedPlugins, $internalPlugins, controller } from "../controller";
import { useStore } from "@nanostores/react";
import { Button, Space, Switch, Modal } from "antd";
import type {} from "../../main/plugins/pluginInstaller";

const PagePlugin: React.FC = function () {
  const handleInstallPlugin = async () => {
    const result = await controller.remoteCall("electronGui.showOpenDialog", {
      title: "请选择目标文件夹",
      properties: ["openFile"],
      filters: [
        { name: "可安装文件", extensions: ["json", "zip"] },
        { name: "插件包信息文件", extensions: ["json"] },
        { name: "插件包文件", extensions: ["zip"] },
      ],
    });
    if (result.canceled) {
      console.log("取消安装插件");
    } else {
      const filePath = result.filePaths[0];
      console.log(filePath);
      await controller.remoteCall("pluginInstaller.install", filePath);
    }
  };

  return (
    <>
      <AppHeader>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h2 style={{ margin: 0 }}>插件管理</h2>
          <Button type="primary" onClick={handleInstallPlugin}>
            安装插件
          </Button>
        </div>
      </AppHeader>
      <AppContent>
        <h3>已安装插件</h3>
        <InstalledPlugins />
        <h3>内置插件</h3>
        <InternalPlugins />
      </AppContent>
    </>
  );
};

interface InstalledPluginItemProps {
  pluginName: string;
  isOpen: boolean;
  onToggle: (pluginName: string, checked: boolean) => void;
  onUninstall: (pluginName: string) => void;
}

const InstalledPluginItem: React.FC<InstalledPluginItemProps> = ({
  pluginName,
  isOpen,
  onToggle,
  onUninstall,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      borderBottom: "1px solid #f0f0f0",
    }}
  >
    <div>
      {isOpen ? "🟢" : "⚪"} {pluginName}
    </div>
    <Space>
      <Switch checked={isOpen} onChange={(checked) => onToggle(pluginName, checked)} />
      <Button danger size="small" onClick={() => onUninstall(pluginName)}>
        卸载
      </Button>
    </Space>
  </div>
);

const InstalledPlugins: React.FC = function () {
  const installedPlugins = useStore($installedPlugins);

  const handleTogglePlugin = (pluginName: string, isLoad: boolean) => {
    if (isLoad) {
      controller.command("pluginLoader.load", pluginName);
    } else {
      controller.command("pluginLoader.unload", pluginName);
    }
  };

  const handleUninstallPlugin = (pluginName: string) => {
    Modal.confirm({
      title: "卸载插件",
      content: `确认卸载插件 ${pluginName} 吗`,
      okText: "确认卸载",
      okType: "danger",
      cancelText: "取消卸载",
      onOk: () => {
        controller.command("pluginInstaller.uninstall", pluginName);
      },
      onCancel: () => {
        console.log("已取消卸载");
      },
    });
  };

  return (
    <div>
      {installedPlugins.map((p) => {
        const plugin = p.get();
        return (
          <InstalledPluginItem
            key={plugin.pluginName}
            pluginName={plugin.pluginName}
            isOpen={!!plugin.open}
            onToggle={handleTogglePlugin}
            onUninstall={handleUninstallPlugin}
          />
        );
      })}
    </div>
  );
};

interface InternalPluginItemProps {
  pluginName: string;
  onInstall: (pluginName: string) => void;
}

const InternalPluginItem: React.FC<InternalPluginItemProps> = ({ pluginName, onInstall }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 4,
      borderBottom: "1px solid #f0f0f0",
    }}
  >
    <span>{pluginName}</span>
  </div>
);

const InternalPlugins: React.FC = function () {
  const internalPlugins = useStore($internalPlugins);

  const handleInstallInternalPlugin = (pluginName: string) => {
    console.log("install-internal-plugin", pluginName);
  };

  return (
    <div>
      {internalPlugins.map((p) => (
        <InternalPluginItem
          key={p.pluginName}
          pluginName={p.pluginName}
          onInstall={handleInstallInternalPlugin}
        />
      ))}
    </div>
  );
};

export default PagePlugin;
