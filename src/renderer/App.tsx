import React, { useState } from "react";
import "./App.css";
import { Layout } from "antd";
import { Navigate, Route, Routes } from "react-router-dom";
import AppSidebar from "./layout/AppSidebar";
import PageStart from "./pages/PageStart";
import PageRoom from "./pages/PageRoom";
import PageSave from "./pages/PageSave";
import PageServer from "./pages/PageServer";
import PageSettings from "./pages/PageSettings";
import PageAbout from "./pages/PageAbout";

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppSidebar />
      <Layout className="site-layout" style={{ position: "relative" }}>
        <div className="side-drag" />
        <Routes>
          <Route path="/" element={<PageStart />} />
          <Route path="/room" element={<PageRoom />} />
          <Route path="/save" element={<PageSave />} />
          <Route path="/server" element={<PageServer />} />
          <Route path="/settings" element={<PageSettings />} />
          <Route path="/about" element={<PageAbout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Layout>
  );
};

export default App;
