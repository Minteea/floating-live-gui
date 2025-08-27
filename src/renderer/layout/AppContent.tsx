import { Layout } from "antd";
import { ReactNode } from "react";

const AppContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Layout.Content style={{ padding: "0 16px 16px" }}>
      {children}
    </Layout.Content>
  );
};

export default AppContent;
