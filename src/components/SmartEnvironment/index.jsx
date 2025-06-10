import { useState, useEffect } from "react";
import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AtButton, AtSwitch } from "taro-ui";
import "./index.scss";

// 图标引用
const ICONS = {
  temperature: "https://unpkg.com/lucide-static@latest/icons/thermometer.svg",
  humidity: "https://unpkg.com/lucide-static@latest/icons/droplets.svg",
  light: "https://unpkg.com/lucide-static@latest/icons/sun.svg",
  airQuality: "https://unpkg.com/lucide-static@latest/icons/cloud.svg",
  fan: "https://unpkg.com/lucide-static@latest/icons/wind.svg",
  led: "https://unpkg.com/lucide-static@latest/icons/lightbulb.svg",
  back: "https://unpkg.com/lucide-static@latest/icons/arrow-left.svg",
  settings: "https://unpkg.com/lucide-static@latest/icons/settings-2.svg",
};

const SmartEnvironment = ({ sceneName, deviceId }) => {
  const [environmentData, setEnvironmentData] = useState({
    temperature: "24.5",
    humidity: "55",
    lightIntensity: "850",
    airQuality: "35",
  });

  const [controls, setControls] = useState({
    fan: { active: false, threshold: 60, manual: false },
    led: { active: false, threshold: 500, manual: false },
  });

  const [autoMode, setAutoMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (deviceId) {
      fetchEnvironmentData();
    } else {
      setLoading(false);
    }

    // 每30秒自动刷新一次数据
    const timer = setInterval(() => {
      fetchEnvironmentData();
    }, 30000);

    return () => clearInterval(timer);
  }, [deviceId]);

  const fetchEnvironmentData = async () => {
    try {
      setLoading(true);

      // 这里应该是实际的API调用，获取设备的环境数据
      // 以下是模拟数据
      // 实际实现应该调用对应的API
      // const response = await getDeviceData(deviceId);

      // 模拟延迟
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 模拟数据
      const data = {
        temperature: (20 + Math.random() * 10).toFixed(1),
        humidity: Math.floor(40 + Math.random() * 40),
        lightIntensity: Math.floor(300 + Math.random() * 700),
        airQuality: Math.floor(20 + Math.random() * 40),
      };

      setEnvironmentData(data);

      // 自动控制逻辑
      if (autoMode) {
        updateControlStatus(data);
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
    // 根据环境数据更新控制设备状态
    setControls((prevControls) => ({
      fan: {
        ...prevControls.fan,
        active: parseInt(data.humidity) > 60,
        threshold: 60,
      },
      led: {
        ...prevControls.led,
        active: parseInt(data.lightIntensity) < 500,
        threshold: 500,
      },
    }));
  };

  const toggleAutoMode = (value) => {
    setAutoMode(value);
    if (value) {
      // 切换到自动模式时，根据当前环境数据更新设备状态
      updateControlStatus(environmentData);
    }
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

    // 实际应用中，这里应该调用API来控制设备
    Taro.showToast({
      title: `${device === "fan" ? "风扇" : "LED灯"}已${value ? "开启" : "关闭"}`,
      icon: "success",
      duration: 1500,
    });
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
        {deviceId && <Text className="device-id">设备ID: {deviceId}</Text>}
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

            <View className="data-item">
              <Image className="data-icon light" src={ICONS.light} />
              <View className="data-content">
                <Text className="data-label">光照强度</Text>
                <Text className="data-value">
                  {environmentData.lightIntensity} Lux
                </Text>
              </View>
            </View>

            <View className="data-item">
              <Image className="data-icon air" src={ICONS.airQuality} />
              <View className="data-content">
                <Text className="data-label">空气质量 (PM2.5)</Text>
                <Text className="data-value">
                  {environmentData.airQuality} μg/m³
                </Text>
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
          <Text className="card-title">
            {autoMode ? "自动控制状态" : "手动控制"}
          </Text>

          <View className="control-items">
            <View className="control-item">
              <View className="control-info">
                <Image className="control-icon" src={ICONS.fan} />
                <Text className="control-name">智能风扇</Text>
              </View>
              {autoMode ? (
                <Text
                  className={`control-status ${controls.fan.active ? "active" : "inactive"}`}
                >
                  {controls.fan.active ? "自动开启" : "自动关闭"} (湿度{" "}
                  {controls.fan.active ? ">" : "<="} {controls.fan.threshold}%)
                </Text>
              ) : (
                <View className="control-button">
                  <View
                    className={`device-button ${controls.fan.active ? "active" : ""}`}
                    onClick={() => toggleDevice("fan", !controls.fan.active)}
                  >
                    <Text>{controls.fan.active ? "关闭" : "开启"}</Text>
                  </View>
                </View>
              )}
            </View>

            <View className="control-item">
              <View className="control-info">
                <Image className="control-icon" src={ICONS.led} />
                <Text className="control-name">LED 补光灯</Text>
              </View>
              {autoMode ? (
                <Text
                  className={`control-status ${controls.led.active ? "active" : "inactive"}`}
                >
                  {controls.led.active ? "自动开启" : "自动关闭"} (光照{" "}
                  {controls.led.active ? "<" : ">="} {controls.led.threshold}{" "}
                  Lux)
                </Text>
              ) : (
                <View className="control-button">
                  <View
                    className={`device-button ${controls.led.active ? "active" : ""}`}
                    onClick={() => toggleDevice("led", !controls.led.active)}
                  >
                    <Text>{controls.led.active ? "关闭" : "开启"}</Text>
                  </View>
                </View>
              )}
            </View>
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
