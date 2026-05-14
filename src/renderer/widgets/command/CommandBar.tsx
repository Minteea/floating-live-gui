import React, { useState, useRef, useEffect } from "react";
import { Button, Input, Tooltip } from "antd";
import {
  SendOutlined,
  CloseOutlined,
  CodeOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useStore } from "@nanostores/react";
import { $commandInput, $commandOutput, $showCommandBar, $showCommandOutput } from "@/store";
import { controller } from "@/controller";
import commandParser from "@/utils/commandParser";
import { AppCommandMap } from "floating-live";

const CommandBar: React.FC = () => {
  const commandInput = useStore($commandInput);
  const showCommandBar = useStore($showCommandBar);
  const showCommandOutput = useStore($showCommandOutput);
  const inputRef = useRef<any>(null);
  const commandOutput = useStore($commandOutput);

  useEffect(() => {
    if (showCommandBar) {
      // small delay to allow panel animation
      setTimeout(() => inputRef.current?.focus?.(), 150);
    }
  }, [showCommandBar]);
  const submit = () => {
    try {
      const [cmd, ...args] = commandParser(commandInput);
      controller.command(cmd, ...(args as Parameters<AppCommandMap[any]>));
    } catch (err) {
      console.error(err);
    }
    $commandInput.set("");
  };

  return (
    <div>
      {/* 命令栏按钮 */}
      <div
        style={{
          position: "absolute",
          right: 16,
          bottom: 16,
          zIndex: 10001,
          pointerEvents: showCommandBar ? "none" : "auto",
        }}
      >
        <Tooltip title="打开指令面板" style={{}}>
          <Button
            type="primary"
            shape="circle"
            size="large"
            onClick={() => $showCommandBar.set(true)}
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              transform: showCommandBar ? "scale(0)" : "scale(1)",
              opacity: showCommandBar ? 0 : 1,
              transition: "transform 180ms ease, opacity 180ms ease",
            }}
            aria-hidden={showCommandBar}
          >
            <CodeOutlined />
          </Button>
        </Tooltip>
      </div>

      {/* 命令栏 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
          transition: "transform 220ms ease",
          transform: showCommandBar ? "translateY(0)" : "translateY(100%)",
        }}
      >
        {/* output panel - appears above the command bar */}
        <div
          aria-hidden={!showCommandOutput}
          style={{
            position: "absolute",
            width: "min(960px, calc(100% - 32px))",
            bottom: 60,
            margin: 8,
            maxHeight: 96,
            overflowY: "auto",
            display: showCommandOutput && showCommandBar ? "block" : "none",
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              padding: 8,
              boxShadow: "0 -2px 8px rgba(0,0,0,0.06)",
              background: "rgba(255,255,255,0.9)",
              borderRadius: 6,
              minHeight: 40,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            {commandOutput.map((line) => (
              <div key={line.id} style={{ padding: 4 }}>
                {line.content}
              </div>
            ))}
          </div>
        </div>

        <div
          aria-hidden={!showCommandBar}
          style={{
            width: "min(960px, calc(100% - 32px))",
            margin: 8,
            padding: 8,
            display: "flex",
            gap: 8,
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            background: "white",
            borderRadius: 6,
            pointerEvents: "auto",
          }}
        >
          <Button
            type="text"
            shape="circle"
            icon={showCommandOutput ? <DownOutlined /> : <UpOutlined />}
            onClick={() => $showCommandOutput.set(!$showCommandOutput.get())}
            aria-pressed={showCommandOutput}
          />

          <Input
            ref={inputRef}
            value={commandInput}
            onChange={(e) => $commandInput.set(e.target.value)}
            onPressEnter={() => submit()}
            placeholder="输入指令..."
            style={{ flex: 1 }}
          />

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Button type="text" shape="circle" icon={<SendOutlined />} onClick={() => submit()} />
            <Button
              type="text"
              shape="circle"
              icon={<CloseOutlined />}
              onClick={() => $showCommandBar.set(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandBar;
