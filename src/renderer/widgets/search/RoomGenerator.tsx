import { Button, Input, Select, Tooltip } from "antd";
import {
  // 图标导入
  SearchOutlined,
  PlusOutlined,
  CaretRightOutlined,
  DeleteOutlined,
  CloseOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import RoomCard from "../../components/room/RoomCard";
import { $rooms, controller } from "../../controller";
import {
  $searchId,
  $searchInfo,
  $searchPlatform,
  $searchResult,
} from "../../../renderer/store";
import { useStore } from "@nanostores/react";
import { atom } from "nanostores";

const { Option } = Select;

/** 搜索及添加直播间的组件 */
const RoomGenerator: React.FC = function () {
  const platform = useStore($searchPlatform);
  const id = useStore($searchId);
  const result = useStore($searchInfo);
  const added = result?.added;
  const opened = result?.opened;
  return (
    <div>
      <div>
        <Select
          placeholder="直播平台"
          style={{ width: 100 }}
          value={platform || null}
          onChange={(value) => {
            $searchPlatform.set(value);
          }}
        >
          <Option value="acfun">AcFun</Option>
          <Option value="bilibili">bilibili</Option>
          <Option value="douyu" disabled>
            斗鱼
          </Option>
          <Option value="huya" disabled>
            虎牙
          </Option>
        </Select>
        <Input
          placeholder="直播间id"
          style={{ width: 150 }}
          value={id}
          onChange={(e) => {
            $searchId.set(e.target.value);
          }}
          onPressEnter={async () => {
            $searchResult.set(
              (await controller.call(`${platform}.room.info`, id)) || null
            );
          }}
        />
        <Tooltip title="查找房间">
          <Button
            type="primary"
            shape="circle"
            icon={<SearchOutlined />}
            onClick={async () => {
              const searchResult = await controller.call(
                `${platform}.room.info`,
                id
              );
              $searchResult.set(searchResult || null);
            }}
          />
        </Tooltip>
        <Tooltip title="清除">
          <Button
            type="ghost"
            shape="circle"
            icon={<CloseOutlined />}
            onClick={() => {
              $searchPlatform.set("");
              $searchId.set("");
            }}
          />
        </Tooltip>
      </div>
      <div style={{ display: result ? "" : "none" }}>
        <RoomCard
          roomInfo={result}
          key={result?.key || ""}
          button={{
            top: [
              <Tooltip title={added ? "房间已添加" : "添加房间到列表"}>
                <Button
                  type="ghost"
                  shape="circle"
                  size="small"
                  icon={<PlusOutlined />}
                  style={{ marginLeft: 5 }}
                  disabled={added}
                  onClick={() => {
                    if (result?.platform && result?.id) {
                      controller.call(
                        "add",
                        result.platform,
                        result.id as number
                      );
                    }
                  }}
                />
              </Tooltip>,
              <Tooltip
                title={
                  opened
                    ? "房间已打开"
                    : !result?.available
                    ? "房间不可用"
                    : added
                    ? "打开房间"
                    : "添加房间并打开"
                }
              >
                <Button
                  type="primary"
                  shape="circle"
                  size="small"
                  icon={<CaretRightOutlined />}
                  style={{ marginLeft: 5 }}
                  disabled={opened || !result?.available}
                  onClick={() => {
                    if (result?.platform && result?.id) {
                      added
                        ? controller.call("open", result.key)
                        : controller.call(
                            "add",
                            result.platform,
                            result.id as number,
                            true
                          );
                    }
                  }}
                />
              </Tooltip>,
            ],
            bottom: [
              <Tooltip title="刷新信息" placement="bottom">
                <Button
                  type="text"
                  shape="circle"
                  size="small"
                  icon={<SyncOutlined />}
                  style={{ marginLeft: 5 }}
                  onClick={async () => {
                    if (!result) return;
                    const { platform, id } = result;
                    const searchResult = await controller.call(
                      `${platform}.room.info`,
                      id
                    );
                    $searchResult.set(searchResult || null);
                  }}
                />
              </Tooltip>,
              <Tooltip title="清除" placement="bottom">
                <Button
                  type="text"
                  shape="circle"
                  size="small"
                  icon={<CloseOutlined />}
                  style={{ marginLeft: 5 }}
                  onClick={() => {
                    if (platform && id) {
                      $searchResult.set(null);
                    }
                  }}
                />
              </Tooltip>,
            ],
          }}
        />
      </div>
    </div>
  );
};

export default RoomGenerator;
