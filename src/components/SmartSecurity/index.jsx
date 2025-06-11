import { View, Text, Image } from "@tarojs/components";
import { useState } from "react";
import { controlScene, controlDevice } from "@/service/command";
import Taro from "@tarojs/taro";
import "./index.scss";

const SmartSecurity = ({
  sceneId,
  sceneName = "智能安防",
  deviceId,
  buzzerId,
}) => {
  // 安防状态: 'armed'(已布防), 'disarmed'(未布防), 'alert'(警报中)
  const [securityStatus, setSecurityStatus] = useState("disarmed");

  // 处理布防/撤防
  const toggleSecurityStatus = () => {
    let newStatus;
    let command;
    let useDeviceControl = false; // 是否使用设备控制而非场景控制

    if (securityStatus === "armed") {
      // 撤防
      newStatus = "disarmed";
      command = "autoalarm_off";
      useDeviceControl = false; // 使用场景控制
    } else if (securityStatus === "disarmed") {
      // 布防
      newStatus = "armed";
      command = "autoalarm_on";
      useDeviceControl = false; // 使用场景控制
    } else if (securityStatus === "alert") {
      // 解除警报
      newStatus = "armed";
      command = "off";
      useDeviceControl = true; // 使用设备控制
    }

    setSecurityStatus(newStatus);

    // 发送控制命令
    if (useDeviceControl && deviceId) {
      // 解除报警使用设备ID
      controlDevice(deviceId, command);
    } else {
      // 布防/撤防使用场景ID
      controlScene(sceneId, command);
    }
  };

  // 获取状态图标和文本
  const getStatusInfo = () => {
    switch (securityStatus) {
      case "armed":
        return {
          icon: "https://unpkg.com/lucide-static@latest/icons/lock.svg",
          text: "已布防",
          description: "系统已激活，所有传感器正常工作。",
          buttonText: "撤防",
          buttonClass: "disarm-button",
        };
      case "disarmed":
        return {
          icon: "https://unpkg.com/lucide-static@latest/icons/lock-open.svg",
          text: "未布防",
          description: "系统处于非活动状态。",
          buttonText: "布防",
          buttonClass: "arm-button",
        };
      case "alert":
        return {
          icon: "https://unpkg.com/lucide-static@latest/icons/bell-ring.svg",
          text: "警报中",
          description: "检测到异常活动！请立即查看。",
          buttonText: "解除警报",
          buttonClass: "alert-button",
        };
      default:
        return {
          icon: "https://unpkg.com/lucide-static@latest/icons/help-circle.svg",
          text: "未知状态",
          description: "系统状态未知。",
          buttonText: "重置系统",
          buttonClass: "reset-button",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <View className="smart-security">
      <View className="header">
        <Text className="title">{sceneName}</Text>
        {deviceId && <Text className="device-id">设备ID: {deviceId}</Text>}
        {buzzerId && <Text className="device-id">蜂鸣器ID: {buzzerId}</Text>}
      </View>

      <View className="content">
        <View className="card status-card">
          <View className={`status-indicator ${securityStatus}`}>
            <Image className="status-icon" src={statusInfo.icon} />
            <Text className="status-text">{statusInfo.text}</Text>
          </View>
          <Text className="status-description">{statusInfo.description}</Text>
          <View
            className={`action-button ${statusInfo.buttonClass}`}
            onClick={toggleSecurityStatus}
          >
            <Text>{statusInfo.buttonText}</Text>
          </View>
        </View>
        {buzzerId && (
          <View className="card manual-control-card">
            <Text className="card-title">蜂鸣器手动控制</Text>
            <View
              className="control-buttons"
              style={{ background: "#eee", minHeight: 40 }}
            >
              <View
                className="control-button buzzer-on"
                onClick={() => {
                  controlDevice(buzzerId, "on");
                  Taro.showToast({
                    title: "蜂鸣器已开启",
                    icon: "success",
                    duration: 1500,
                  });
                }}
              >
                <Text>开启警报</Text>
              </View>
              <View
                className="control-button buzzer-off"
                onClick={() => {
                  controlDevice(buzzerId, "off");
                  Taro.showToast({
                    title: "蜂鸣器已关闭",
                    icon: "success",
                    duration: 1500,
                  });
                }}
              >
                <Text>关闭警报</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default SmartSecurity;
