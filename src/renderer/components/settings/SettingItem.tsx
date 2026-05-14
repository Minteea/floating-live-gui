import React from "react";

interface Props {
  title: React.ReactNode;
  control: React.ReactNode;
}

const SettingItem: React.FC<Props> = ({ title, control }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0",
        borderTop: "1px solid rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ flex: "0 0 auto", marginRight: 12 }}>{title}</div>
      <div style={{ flex: "1 1 320px", minWidth: 120, textAlign: "right" }}>{control}</div>
    </div>
  );
};

export default SettingItem;
