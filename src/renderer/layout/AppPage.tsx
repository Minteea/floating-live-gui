import { ReactNode } from "react";

const AppPage: React.FC<{ children?: ReactNode }> = ({ children }) => {
  return <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>{children}</div>;
};

export default AppPage;
