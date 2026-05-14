import React from "react";
import "./App.css";
import { Layout } from "antd";
import { Navigate, Route, Routes } from "react-router-dom";
import AppSidebar from "./layout/AppSidebar";
import PageStart from "./pages/PageStart";
import PageRoom from "./pages/PageRoom";
import PageSettings from "./pages/PageSettings";
import PageAbout from "./pages/PageAbout";
import PagePlugin from "./pages/PagePlugin";
import version from "./controller/version";
import FloatingCommandPanel from "./widgets/command/CommandBar";
import AppPage from "./layout/AppPage";

const App: React.FC = () => {
  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <AppSidebar />
      <Layout
        className="site-layout"
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div className="side-drag" />
        <FloatingCommandPanel />
        <AppPage>
          <Routes>
            <Route path="/" element={<PageStart />} />
            <Route path="/room" element={<PageRoom />} />
            <Route path="/settings" element={<PageSettings />} />
            <Route path="/about" element={<PageAbout />} />
            <Route path="/plugins" element={<PagePlugin />} />
            {version.client == "electron" ? (
              <Route path="*" element={<Navigate to="/" replace />} />
            ) : null}
          </Routes>
        </AppPage>
      </Layout>
    </Layout>
  );
};

export default App;
