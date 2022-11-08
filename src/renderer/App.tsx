import React, { useState } from 'react';
import 'antd/dist/antd.css';
import './App.css';
import { Layout } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import SideBar from './layout/SideBar';
import PageStart from './pages/PageStart';
import PageRoom from './pages/PageRoom';
import PageSaving from './pages/PageSaving';
import PageServer from './pages/PageServer';
import PageSettings from './pages/PageSettings';
import PageAbout from './pages/PageAbout';

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideBar />
      <Layout className="site-layout" style={{ position: 'relative' }}>
        <div className="side-drag" />
        <Content style={{ padding: '16px 16px' }}>
          <Routes>
            <Route path="/" element={<PageStart />} />
            <Route path="/room" element={<PageRoom />} />
            <Route path="/saving" element={<PageSaving />} />
            <Route path="/server" element={<PageServer />} />
            <Route path="/settings" element={<PageSettings />} />
            <Route path="/about" element={<PageAbout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
