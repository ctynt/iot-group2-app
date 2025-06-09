import { View, Text, Image } from "@tarojs/components";
import { useState } from "react";
import { controlScene, controlDevice } from "@/service/command";
import "./index.scss";

const SmartLighting = ({ sceneId, sceneName = "智能照明", deviceId }) => {
  const [isOn, setIsOn] = useState(true);
  const [isAuto, setIsAuto] = useState(false);

  // 处理开关灯
  const toggleLight = () => {
    const newStatus = !isOn;

    setIsOn(newStatus);
    // 如果有设备ID，则控制设备；否则控制场景
    if (deviceId) {
      controlDevice(deviceId, newStatus ? "on" : "off");
    } else {
      controlScene(sceneId, newStatus ? "nightlight_on" : "nightlight_off");
    }
  };

  // 切换自动/手动控制
  const toggleAutoMode = () => {
    const newAutoStatus = !isAuto;
    setIsAuto(newAutoStatus);
    // 自动控制使用场景命令
    controlScene(sceneId, newAutoStatus ? "nightlight_on" : "nightlight_off");
  };

  return (
    <View className="smart-lighting">
      <View className="header">
        <Text className="title">{sceneName}</Text>
        {deviceId && <Text className="device-id">设备ID: {deviceId}</Text>}
      </View>

      <View className="content">
        <View className="card status-card" onClick={toggleLight}>
          <Image
            className="light-icon"
            src="https://unpkg.com/lucide-static@latest/icons/lightbulb.svg"
          />
          <Text className="status-text">{isOn ? "已开启" : "已关闭"}</Text>
        </View>

        <View className="card control-mode-card">
          <View className="mode-title">控制模式</View>
          <View className="mode-options">
            <View
              className={`mode-option ${!isAuto ? "active" : ""}`}
              onClick={() => isAuto && toggleAutoMode()}
            >
              <Text>手动控制</Text>
            </View>
            <View
              className={`mode-option ${isAuto ? "active" : ""}`}
              onClick={() => !isAuto && toggleAutoMode()}
            >
              <Text>自动控制</Text>
            </View>
          </View>
          <Text className="mode-desc">
            {isAuto ? "系统将根据环境自动控制灯光" : "您可以手动控制灯光开关"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SmartLighting;
