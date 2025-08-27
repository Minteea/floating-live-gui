import { ReactNode } from "react";

const AppHeader: React.FC<{
  children: ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => {
  return (
    <header
      style={{
        padding: "env(titlebar-area-height, 16px) 16px 0",
        ...style,
      }}
    >
      {children}
    </header>
  );
};

export default AppHeader;
