import { useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";

import { controlScene, controlDevice } from "@/service/command";
import "./index.scss";

const SmartFan = ({ sceneId, sceneName = "智能风扇", deviceId }) => {
  // 风扇速度: 'off'(关闭), 'low'(低速), 'medium'(中速), 'high'(高速)
  const [fanSpeed, setFanSpeed] = useState("off");

  // 处理风扇速度控制
  const handleSpeedChange = (speed) => {
    // 如果点击当前速度，则关闭风扇
    const newSpeed = speed === fanSpeed ? "off" : speed;
    setFanSpeed(newSpeed);

    // 发送控制命令
    let command;
    switch (newSpeed) {
      case "off":
        command = "off";
        break;
      case "low":
        command = "on";
        break;
      case "medium":
        command = "speed:medium";
        break;
      case "high":
        command = "speed:high";
        break;
      default:
        command = "off";
    }

    if (deviceId) {
      controlDevice(deviceId, command);
    } else {
      controlScene(sceneId, command);
    }
  };

  // 处理风扇开关控制
  const handlePowerToggle = () => {
    const newSpeed = fanSpeed === "off" ? "low" : "off";
    setFanSpeed(newSpeed);

    // 发送控制命令
    const command = newSpeed === "off" ? "off" : "on";

    if (deviceId) {
      controlDevice(deviceId, command);
    } else {
      controlScene(sceneId, command);
    }
    Taro.showToast({
      title: newSpeed === "off" ? "风扇已关闭" : "风扇已开启",
      icon: "success",
    });
  };

  // 获取风扇状态文本
  const getFanStatusText = () => {
    switch (fanSpeed) {
      case "off":
        return "已关闭";
      default:
        return "已开启";
    }
  };

  return (
    <View className="smart-fan">
      <View className="header">
        <Text className="title">{sceneName}</Text>
        {deviceId && <Text className="device-id">设备ID: {deviceId}</Text>}
      </View>

      <View className="content">
        <View className="card status-card">
          <Image
            className="fan-icon"
            src="https://unpkg.com/lucide-static@latest/icons/wind.svg"
          />
          <Text className="status-title">风扇状态</Text>
          <Text className="status-text">当前: {getFanStatusText()}</Text>
        </View>

        <View className="card control-card">
          <Text className="card-title">风扇开关</Text>
          <View className="power-button-container">
            <View
              className={`power-button ${fanSpeed === "off" ? "" : "active"}`}
              onClick={handlePowerToggle}
            >
              <Image
                className="power-icon"
                src="https://unpkg.com/lucide-static@latest/icons/power.svg"
              />
              <Text className="power-text">
                {fanSpeed === "off" ? "开启" : "关闭"}
              </Text>
            </View>
          </View>
        </View>

        <View className="card auto-control-card">
          <Text className="card-title">自动控制</Text>
          <View
            className="auto-button"
            onClick={() => {
              controlScene(sceneId, "autofan_on");
              Taro.showToast({
                title: "已启用自动控制",
                icon: "success",
              });
            }}
          >
            <Text>启用自动控制</Text>
          </View>
          <View
            className="manual-button"
            onClick={() => {
              controlScene(sceneId, "autofan_off");
              Taro.showToast({
                title: "已切换到手动控制",
                icon: "success",
              });
            }}
          >
            <Text>切换到手动控制</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SmartFan;
