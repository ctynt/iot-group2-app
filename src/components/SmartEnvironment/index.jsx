import { useState, useEffect } from "react";
import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AtButton, AtSwitch } from "taro-ui";
import { controlScene, controlDevice, getDevice } from "@/service/command";
import "./index.scss";

// 图标引用
const ICONS = {
  temperature: "https://unpkg.com/lucide-static@latest/icons/thermometer.svg",
  humidity: "https://unpkg.com/lucide-static@latest/icons/droplets.svg",
  fan: "https://unpkg.com/lucide-static@latest/icons/wind.svg",
  led: "https://unpkg.com/lucide-static@latest/icons/lightbulb.svg",
};

const SmartEnvironment = ({ sceneName, deviceIds, sceneId }) => {
  const [environmentData, setEnvironmentData] = useState({
    temperature: "24.5",
    humidity: "55",
  });

  const [controls, setControls] = useState({
    fan: { active: false, threshold: 60, manual: false },
    led: { active: false, threshold: 500, manual: false },
  });

  const [autoMode, setAutoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (deviceIds && (deviceIds.sensor || deviceIds.fan || deviceIds.led)) {
      fetchEnvironmentData();
    } else {
      setLoading(false);
    }

    // 每30秒自动刷新一次数据
    const timer = setInterval(() => {
      fetchEnvironmentData();
    }, 30000);

    return () => clearInterval(timer);
  }, [deviceIds]);

  useEffect(() => {
    setControls((prevControls) => ({
      fan: { ...prevControls.fan, active: false },
      led: { ...prevControls.led, active: false },
    }));
  }, []);

  const fetchEnvironmentData = async () => {
    try {
      setLoading(true);
      if (deviceIds.sensor) {
        const res = await getDevice(deviceIds.sensor);
        const device = res.data ? res.data : res;
        setEnvironmentData({
          temperature:
            typeof device.temperature === "number" ? device.temperature : "--",
          humidity:
            typeof device.humidity === "number" ? device.humidity : "--",
        });
        if (autoMode) {
          updateControlStatus(device);
        }
      }
    } catch (error) {
      console.error("获取环境数据失败:", error);
      Taro.showToast({
        title: "获取环境数据失败",
        icon: "none",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateControlStatus = (data) => {
    setControls((prevControls) => ({
      fan: {
        ...prevControls.fan,
        active: parseInt(data.humidity) > 60,
        threshold: 60,
      },
      led: {
        ...prevControls.led,
        active: false, // 这里可以根据需要调整LED灯的自动控制逻辑
        threshold: 500,
      },
    }));
  };

  const toggleAutoMode = (value) => {
    setAutoMode(value);
    if (value) {
      updateControlStatus(environmentData);
      sendAutoControlCommand(value);
    } else {
      sendAutoControlCommand(false);
    }
  };

  const sendAutoControlCommand = (isAutoOn) => {
    const command = isAutoOn ? "autolight_on" : "autolight_off";
    controlScene(sceneId, command);
    Taro.showToast({
      title: `${isAutoOn ? "自动照明已开启" : "自动照明已关闭"}`,
      icon: "success",
      duration: 1500,
    });
  };

  const toggleDevice = (device, value) => {
    setControls((prevControls) => ({
      ...prevControls,
      [device]: {
        ...prevControls[device],
        active: value,
        manual: !autoMode,
      },
    }));
    const command = value ? "on" : "off";
    const deviceId = deviceIds[device];
    if (deviceId) {
      controlDevice(deviceId, `${command}`);
      Taro.showToast({
        title: `${device === "fan" ? "风扇" : "LED灯"}已${value ? "开启" : "关闭"}`,
        icon: "success",
        duration: 1500,
      });
    } else {
      Taro.showToast({
        title: `未找到${device === "fan" ? "风扇" : "LED灯"}设备`,
        icon: "none",
        duration: 1500,
      });
    }
  };

  const refreshData = () => {
    setUpdating(true);
    fetchEnvironmentData().finally(() => {
      setUpdating(false);
      Taro.showToast({
        title: "数据已更新",
        icon: "success",
        duration: 1500,
      });
    });
  };

  if (loading) {
    return (
      <View className="smart-environment loading-container">
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View className="smart-environment">
      {/* 顶部导航 */}
      <View className="header">
        <Text className="title">{sceneName}</Text>
        {deviceIds && (
          <>
            {deviceIds.sensor && (
              <Text className="device-id">传感器ID: {deviceIds.sensor}</Text>
            )}
            {deviceIds.fan && (
              <Text className="device-id">风扇ID: {deviceIds.fan}</Text>
            )}
            {deviceIds.led && (
              <Text className="device-id">LED灯ID: {deviceIds.led}</Text>
            )}
          </>
        )}
      </View>
      <View className="content">
        {/* 当前环境数据卡片 */}
        <View className="card status-card">
          <Image className="env-icon" src={ICONS.temperature} />
          <Text className="status-title">环境监测</Text>
          <Text className="status-text">数据更新时间: 刚刚</Text>
        </View>
        {/* 环境数据指标卡片 */}
        <View className="card data-card">
          <Text className="card-title">环境数据</Text>
          <View className="data-grid">
            <View className="data-item">
              <Image
                className="data-icon temperature"
                src={ICONS.temperature}
              />
              <View className="data-content">
                <Text className="data-label">温度</Text>
                <Text className="data-value">
                  {environmentData.temperature}°C
                </Text>
              </View>
            </View>
            <View className="data-item">
              <Image className="data-icon humidity" src={ICONS.humidity} />
              <View className="data-content">
                <Text className="data-label">湿度</Text>
                <Text className="data-value">{environmentData.humidity}%</Text>
              </View>
            </View>
          </View>
        </View>
        {/* 控制模式切换 */}
        <View className="card control-card">
          <Text className="card-title">控制模式</Text>
          <View className="mode-switch">
            <Text className="mode-label">自动控制模式</Text>
            <AtSwitch
              checked={autoMode}
              onChange={toggleAutoMode}
              color="#6190e8"
            />
          </View>
        </View>
        {/* 控制设备卡片 */}
        <View className="card device-control-card">
          <Text className="card-title">手动控制</Text>
          <View className="control-items">
            {deviceIds.fan && (
              <View className="control-item">
                <View className="control-info">
                  <Image className="control-icon" src={ICONS.fan} />
                  <Text className="control-name">智能风扇</Text>
                </View>
                <View className="control-button">
                  <View
                    className={`device-button ${controls.fan.active ? "active" : ""} ${autoMode ? "disabled" : ""}`}
                    onClick={
                      !autoMode
                        ? () => toggleDevice("fan", !controls.fan.active)
                        : undefined
                    }
                    style={
                      autoMode ? { opacity: 0.5, pointerEvents: "none" } : {}
                    }
                  >
                    <Text>{controls.fan.active ? "关闭" : "开启"}</Text>
                  </View>
                </View>
              </View>
            )}
            {deviceIds.led && (
              <View className="control-item">
                <View className="control-info">
                  <Image className="control-icon" src={ICONS.led} />
                  <Text className="control-name">LED 补光灯</Text>
                </View>
                <View className="control-button">
                  <View
                    className={`device-button ${controls.led.active ? "active" : ""} ${autoMode ? "disabled" : ""}`}
                    onClick={
                      !autoMode
                        ? () => toggleDevice("led", !controls.led.active)
                        : undefined
                    }
                    style={
                      autoMode ? { opacity: 0.5, pointerEvents: "none" } : {}
                    }
                  >
                    <Text>{controls.led.active ? "关闭" : "开启"}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
        {/* 刷新按钮 */}
        <View className="refresh-button-container">
          <View className="refresh-button" onClick={refreshData}>
            <Text>{updating ? "刷新中..." : "刷新数据"}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SmartEnvironment;
