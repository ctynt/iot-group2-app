import { View, Text } from "@tarojs/components";
import { AtInput, AtTextarea } from "taro-ui";
import { useState } from "react";
import "./index.scss";

export default function AddScene() {
  const [sceneName, setSceneName] = useState("");
  const [sceneDesc, setSceneDesc] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDevices, setSelectedDevices] = useState([]);

  const sceneTypes = [
    { id: "env", name: "环境检测", icon: "environment" },
    { id: "security", name: "智能安防", icon: "shield" },
    { id: "lighting", name: "智能照明", icon: "bulb" },
    { id: "fan", name: "智能节能风扇", icon: "fan" },
  ];

  const devices = [
    { id: 1, name: "客厅灯", type: "lighting", status: "在线" },
    { id: 2, name: "卧室空调", type: "ac", status: "在线" },
    { id: 3, name: "安防摄像头", type: "security", status: "离线" },
  ];

  return (
    <View className="add-scene-page">
      <View className="form-card">
        <View className="input-group">
          <Text className="label">场景名称</Text>
          <AtInput
            className="input"
            type="text"
            placeholder="给场景起个名字"
            value={sceneName}
            onChange={(value) => setSceneName(value)}
          />
        </View>

        <View className="input-group">
          <Text className="label">场景类型</Text>
          <View className="type-grid">
            {sceneTypes.map((type) => (
              <View
                key={type.id}
                className={`type-item ${
                  selectedType === type.id ? "selected" : ""
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <Text className={`at-icon at-icon-${type.icon}`} />
                <Text className="type-name">{type.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="input-group">
          <Text className="label">选择设备</Text>
          <View className="device-list">
            {devices.map((device) => (
              <View
                key={device.id}
                className={`device-item ${
                  selectedDevices.includes(device.id) ? "selected" : ""
                }`}
                onClick={() => {
                  const newSelected = selectedDevices.includes(device.id)
                    ? selectedDevices.filter((id) => id !== device.id)
                    : [...selectedDevices, device.id];
                  setSelectedDevices(newSelected);
                }}
              >
                <Text className="device-name">{device.name}</Text>
                <Text
                  className={`status ${
                    device.status === "在线" ? "online" : "offline"
                  }`}
                >
                  {device.status}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="input-group">
          <Text className="label">场景描述</Text>
          <AtTextarea
            className="textarea"
            value={sceneDesc}
            onChange={(value) => setSceneDesc(value)}
            maxLength={200}
            placeholder="描述一下这个场景的用途"
          />
        </View>
      </View>

      <View className="button-group">
        <View className="submit-button">保存场景</View>
      </View>
    </View>
  );
}
