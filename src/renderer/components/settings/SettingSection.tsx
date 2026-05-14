import React from "react";

interface Props {
  title: React.ReactNode;
  children?: React.ReactNode;
  control?: React.ReactNode;
}

const Section: React.FC<Props> = ({ title, children, control }) => {
  return (
    <div style={{ marginBottom: 20, padding: "12px 12px 0", borderRadius: 6, background: "white" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ fontWeight: 600 }}>{title}</div>
        {control ? <div>{control}</div> : null}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Section;
