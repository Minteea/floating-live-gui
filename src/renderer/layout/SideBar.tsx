import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  HomeOutlined,
  PlusSquareOutlined,
  DesktopOutlined,
  LinkOutlined,
  SaveOutlined,
  SettingOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import version from '../controller/version';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getMenuLinkItem(
  name: string,
  link: string,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key: link,
    icon,
    children,
    label: <Link to={link}>{name}</Link>,
  } as MenuItem;
}

const items: MenuItem[] = [
  getMenuLinkItem('开始', '/', <HomeOutlined />),
  getMenuLinkItem('添加房间', '/room', <PlusSquareOutlined />),
  getMenuLinkItem('弹幕保存', '/save', <SaveOutlined />),
  version.client == 'electron'
    ? getMenuLinkItem('本地服务', '/server', <DesktopOutlined />)
    : getMenuLinkItem('连接服务', '/server', <LinkOutlined />),
  getMenuLinkItem('设置', '/settings', <SettingOutlined />),
  getMenuLinkItem('关于', '/about', <InfoCircleOutlined />),
];

const SideBar: React.FC = function () {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      collapsedWidth={60}
      width={200}
    >
      <div
        className="logo"
        style={{
          height: '50px',
          color: 'white',
          lineHeight: '50px',
          fontSize: '20px',
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            display: collapsed ? 'none' : 'block',
            whiteSpace: 'nowrap',
          }}
        >
          Floating Live
        </span>
        <span style={{ display: collapsed ? 'block' : 'none' }}>FL</span>
      </div>
      <Menu
        theme="dark"
        selectedKeys={[location.pathname]}
        defaultSelectedKeys={['start']}
        mode="inline"
        items={items}
      />
    </Sider>
  );
};

export default SideBar;
