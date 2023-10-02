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
import { store } from "../../store";
import controller from "../../controller";
import { useAtom, useAtomValue } from "jotai";

const { Option } = Select;
const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

/** 搜索及添加直播间的组件 */
const RoomGenerator: React.FC = function () {
  const [platform, setPlatform] = useAtom(store.search.platform);
  const [id, setId] = useAtom(store.search.id);
  const [result, setResult] = useAtom(store.search.result);
  const roomInList = useAtomValue(store.room.list).find(
    (r) => r.key == result?.key
  );
  const listed = !!roomInList;
  const opened = roomInList?.opened;
  return (
    <div>
      <div>
        <Select
          placeholder="直播平台"
          style={{ width: 100 }}
          value={platform || null}
          onChange={(value) => {
            setPlatform(value);
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
            setId(e.target.value);
          }}
          onPressEnter={async () => {
            (setResult as any)(
              (await controller.cmd("search", platform, id)) || null
            );
          }}
        />
        <Tooltip title="查找房间">
          <Button
            type="primary"
            shape="circle"
            icon={<SearchOutlined />}
            onClick={async () => {
              const searchResult = await controller.cmd("search", platform, id);
              console.log(searchResult);
              (setResult as any)(searchResult || null);
            }}
          />
        </Tooltip>
        <Tooltip title="清除">
          <Button
            type="ghost"
            shape="circle"
            icon={<CloseOutlined />}
            onClick={() => {
              setPlatform("");
              setId("");
            }}
          />
        </Tooltip>
      </div>
      <div style={{ display: result ? "" : "none" }}>
        <RoomCard
          roomInfo={result}
          button={{
            top: [
              <Tooltip title={listed ? "房间已添加" : "添加房间到列表"}>
                <Button
                  type="ghost"
                  shape="circle"
                  size="small"
                  icon={<PlusOutlined />}
                  style={{ marginLeft: 5 }}
                  disabled={listed}
                  onClick={() => {
                    if (result?.platform && result?.id) {
                      controller.cmd("add", result.platform, result.id);
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
                    : listed
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
                      listed
                        ? controller.cmd("open", result.key)
                        : controller.cmd(
                            "add",
                            result.platform,
                            result.id,
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
                  onClick={() => {
                    controller.cmd("searchUpdate");
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
                      (setResult as any)(null);
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
