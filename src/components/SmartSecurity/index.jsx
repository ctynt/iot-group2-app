import { View, Text, Image } from "@tarojs/components";
import { useState } from "react";
import { controlScene, controlDevice } from "@/service/command";
import "./index.scss";

const SmartSecurity = ({ sceneId, sceneName = "智能安防", deviceId }) => {
  // 安防状态: 'armed'(已布防), 'disarmed'(未布防), 'alert'(警报中)
  const [securityStatus, setSecurityStatus] = useState("disarmed");

  // 活动日志
  const [logs] = useState([
    {
      content: "系统已布防",
      time: "2023-11-15 10:30",
      status: "normal",
    },
    {
      content: "前门传感器触发",
      time: "2023-11-15 09:15",
      status: "alert",
      extraInfo: "警报已解除",
    },
    {
      content: "系统已撤防",
      time: "2023-11-15 08:00",
      status: "normal",
    },
    {
      content: "后窗传感器正常",
      time: "2023-11-14 22:00",
      status: "normal",
    },
  ]);

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

  // 手动控制蜂鸣器
  const toggleBuzzer = (turnOn) => {
    if (deviceId) {
      controlDevice(deviceId, turnOn ? "on" : "off");
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

        {deviceId && (
          <View className="card manual-control-card">
            <Text className="card-title">手动控制</Text>
            <View className="control-buttons">
              <View
                className="control-button alarm-on"
                onClick={() => toggleBuzzer(true)}
              >
                <Text>开启警报</Text>
              </View>
              <View
                className="control-button alarm-off"
                onClick={() => toggleBuzzer(false)}
              >
                <Text>关闭警报</Text>
              </View>
            </View>
          </View>
        )}

        <View className="card log-card">
          <Text className="card-title">活动日志</Text>
          <View className="log-list">
            {logs.map((log, index) => (
              <View key={index} className="log-item">
                <Text className="log-content">{log.content}</Text>
                <Text
                  className={`log-time ${log.status === "alert" ? "alert" : ""}`}
                >
                  {log.time}
                  {log.extraInfo ? ` - ${log.extraInfo}` : ""}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default SmartSecurity;
