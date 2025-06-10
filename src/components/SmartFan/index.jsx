import { View, Text, Image } from "@tarojs/components";
import { useState } from "react";
import { controlScene, controlDevice } from "@/service/command";
import "./index.scss";

const SmartFan = ({ sceneId, sceneName = "智能风扇", deviceId }) => {
  // 风扇速度: 'off'(关闭), 'low'(低速), 'medium'(中速), 'high'(高速)
  const [fanSpeed, setFanSpeed] = useState("low");

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
        command = "speed:low";
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
    const command = newSpeed === "off" ? "off" : "speed:low";

    if (deviceId) {
      controlDevice(deviceId, command);
    } else {
      controlScene(sceneId, command);
    }
  };

  // 获取风扇状态文本
  const getFanStatusText = () => {
    switch (fanSpeed) {
      case "off":
        return "已关闭";
      case "low":
        return "低速";
      case "medium":
        return "中速";
      case "high":
        return "高速";
      default:
        return "未知状态";
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
          <Text className="card-title">速度调节</Text>

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

          <View className="speed-controls">
            <View
              className={`speed-button ${fanSpeed === "low" ? "active" : ""}`}
              onClick={() => handleSpeedChange("low")}
            >
              <Image
                className="speed-icon"
                src="https://unpkg.com/lucide-static@latest/icons/wind.svg"
              />
              <Text className="speed-text">低速</Text>
            </View>
            <View
              className={`speed-button ${fanSpeed === "medium" ? "active" : ""}`}
              onClick={() => handleSpeedChange("medium")}
            >
              <Image
                className="speed-icon"
                src="https://unpkg.com/lucide-static@latest/icons/wind.svg"
              />
              <Text className="speed-text">中速</Text>
            </View>
            <View
              className={`speed-button ${fanSpeed === "high" ? "active" : ""}`}
              onClick={() => handleSpeedChange("high")}
            >
              <Image
                className="speed-icon"
                src="https://unpkg.com/lucide-static@latest/icons/wind.svg"
              />
              <Text className="speed-text">高速</Text>
            </View>
          </View>
        </View>

        <View className="card auto-control-card">
          <Text className="card-title">自动控制</Text>
          <View
            className="auto-button"
            onClick={() => {
              if (deviceId) {
                controlDevice(deviceId, "autofan_on");
              } else {
                controlScene(sceneId, "autofan_on");
              }
            }}
          >
            <Text>启用自动控制</Text>
          </View>
          <View
            className="manual-button"
            onClick={() => {
              if (deviceId) {
                controlDevice(deviceId, "autofan_off");
              } else {
                controlScene(sceneId, "autofan_off");
              }
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
