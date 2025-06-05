import { View, Text } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { useState, useEffect } from "react";
import "./index.scss";
import { getDeviceDetail } from "../../services/device";

// 将
const DeviceDetail = () => {
  const router = useRouter();
  const [device, setDevice] = useState({
    id: 0,
    deviceId: "",
    name: "",
    type: 0,
    status: 0,
    isSwitched: null,
    temperature: null,
    humidity: null,
    createTime: "",
  });

  useEffect(() => {
    const { deviceId } = router.params;
    if (deviceId) {
      getDeviceDetail(deviceId).then((res) => {
        if (res.code === 0 && res.data) {
          setDevice(res.data);
        } else {
          console.error("获取设备详情失败:", res);
          Taro.showToast({
            title: "获取设备详情失败",
            icon: "error",
          });
        }
      });
    }
  }, []);

  const getDeviceType = (type) => {
    switch (type) {
      case 1:
        return "灯";
      case 2:
        return "温湿度传感器";
      case 3:
        return "蜂鸣器";
      case 4:
        return "红外传感器";
      default:
        return "未知设备";
    }
  };

  return (
    <View className="device-detail">
      <View className="device-card">
        <View className="card-header">
          <Text className="device-name">{device.deviceId}</Text>
          <Text
            className={`device-status ${
              device.status === 1 ? "online" : "offline"
            }`}
          >
            {device.status === 1 ? "在线" : "离线"}
          </Text>
        </View>

        <View className="card-content">
          <View className="info-item">
            <Text className="label">设备类型</Text>
            <Text className="value">{getDeviceType(device.type)}</Text>
          </View>

          <View className="info-item">
            <Text className="label">开关状态</Text>
            <Text className="value">{device.switch === 1 ? "开" : "关"}</Text>
          </View>

          {device.type === 2 && (
            <>
              <View className="info-item">
                <Text className="label">温度</Text>
                <Text className="value">{device.temperature}°C</Text>
              </View>

              <View className="info-item">
                <Text className="label">湿度</Text>
                <Text className="value">{device.humidity}%</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

// 修改为
// 删除旧的声明，直接使用export default
export default function Index() {
  const router = useRouter();
  const [device, setDevice] = useState({
    id: 0,
    deviceId: "",
    name: "",
    type: 0,
    status: 0,
    isSwitched: null,
    temperature: null,
    humidity: null,
    createTime: "",
  });

  useEffect(() => {
    const { deviceId } = router.params;
    if (deviceId) {
      getDeviceDetail(deviceId).then((res) => {
        if (res.code === 0 && res.data) {
          setDevice(res.data);
        } else {
          console.error("获取设备详情失败:", res);
          Taro.showToast({
            title: "获取设备详情失败",
            icon: "error",
          });
        }
      });
    }
  }, []);

  const getDeviceType = (type) => {
    switch (type) {
      case 1:
        return "灯";
      case 2:
        return "温湿度传感器";
      case 3:
        return "蜂鸣器";
      case 4:
        return "红外传感器";
      default:
        return "未知设备";
    }
  };

  return (
    <View className="device-detail">
      <View className="device-card">
        <View className="card-header">
          <Text className="device-name">{device.deviceId}</Text>
          <Text
            className={`device-status ${
              device.status === 1 ? "online" : "offline"
            }`}
          >
            {device.status === 1 ? "在线" : "离线"}
          </Text>
        </View>

        <View className="card-content">
          <View className="info-item">
            <Text className="label">设备类型</Text>
            <Text className="value">{getDeviceType(device.type)}</Text>
          </View>

          <View className="info-item">
            <Text className="label">开关状态</Text>
            <Text className="value">{device.switch === 1 ? "开" : "关"}</Text>
          </View>

          {device.type === 2 && (
            <>
              <View className="info-item">
                <Text className="label">温度</Text>
                <Text className="value">{device.temperature}°C</Text>
              </View>

              <View className="info-item">
                <Text className="label">湿度</Text>
                <Text className="value">{device.humidity}%</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}
