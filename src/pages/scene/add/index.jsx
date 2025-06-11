import { View, Text } from "@tarojs/components";
import { AtInput, AtTextarea, AtButton, AtForm } from "taro-ui";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/store";
import Taro from "@tarojs/taro";
import { addScene } from "../../../services/scene";
import { getDeviceList } from "../../../services/device";

import "./index.scss";

export default function AddScene() {
  const [sceneName, setSceneName] = useState("");
  const [sceneDesc, setSceneDesc] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 从Redux获取用户ID
  const userInfo = useAppSelector((state) => state.user);
  const userId = userInfo.id;

  // 场景类型定义
  const sceneTypes = [
    { id: "1", name: "环境检测", icon: "environment" },
    { id: "2", name: "智能安防", icon: "shield" },
    { id: "3", name: "智能照明", icon: "bulb" },
    { id: "4", name: "智能节能风扇", icon: "fan" },
  ];

  // 获取设备列表
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const result = await getDeviceList({
        page: 1,
        limit: 100,
      });

      if (result && result.list) {
        // 打印设备列表，查看设备对象结构
        console.log("设备列表:", result.list);
        setDevices(result.list);
      }
    } catch (error) {
      console.error("获取设备列表失败:", error);
      Taro.showToast({
        title: "获取设备列表失败",
        icon: "none",
      });
    } finally {
      setLoading(false);
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    // 表单验证
    if (!sceneName) {
      Taro.showToast({
        title: "请输入场景名称",
        icon: "none",
      });
      return;
    }

    if (!selectedType) {
      Taro.showToast({
        title: "请选择场景类型",
        icon: "none",
      });
      return;
    }

    if (selectedDevices.length === 0) {
      Taro.showToast({
        title: "请至少选择一个设备",
        icon: "none",
      });
      return;
    }

    try {
      setSubmitting(true);

      // 准备提交的数据
      const sceneData = {
        userId: userId,
        name: sceneName,
        description: sceneDesc,
        type: selectedType,
        deviceIds: selectedDevices.map((id) => id),
      };

      console.log("提交场景数据:", sceneData);

      // 调用添加场景接口
      const result = await addScene(sceneData);

      Taro.showToast({
        title: "添加场景成功",
        icon: "success",
      });

      // 返回场景列表页面
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } catch (error) {
      console.error("添加场景失败:", error);
      Taro.showToast({
        title: "添加场景失败: " + (error.message || "未知错误"),
        icon: "none",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className='add-scene-page'>
      <AtForm>
        <View className='form-card'>
          <View className='input-group'>
            <Text className='label'>场景名称</Text>
            <AtInput
              className='input'
              type='text'
              placeholder='给场景起个名字'
              value={sceneName}
              onChange={(value) => setSceneName(value)}
            />
          </View>

          <View className='input-group'>
            <Text className='label'>场景类型</Text>
            <View className='type-grid'>
              {sceneTypes.map((type) => (
                <View
                  key={type.id}
                  className={`type-item ${selectedType === type.id ? "selected" : ""}`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <Text className={`at-icon at-icon-${type.icon}`} />
                  <Text className='type-name'>{type.name}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className='input-group'>
            <Text className='label'>选择设备</Text>
            {loading ? (
              <View className='loading'>加载设备列表中...</View>
            ) : devices.length > 0 ? (
              <View className='device-list'>
                {devices.map((device) => (
                  <View
                    key={device.deviceId || device.id}
                    className={`device-item ${
                      selectedDevices.includes(device.deviceId || device.id)
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => {
                      const deviceIdentifier = device.deviceId || device.id;
                      const newSelected = selectedDevices.includes(
                        deviceIdentifier,
                      )
                        ? selectedDevices.filter(
                            (id) => id !== deviceIdentifier,
                          )
                        : [...selectedDevices, deviceIdentifier];
                      setSelectedDevices(newSelected);
                    }}
                  >
                    <Text className='device-name'>{device.name}</Text>
                    <Text
                      className={`status ${device.status === 1 ? "online" : "offline"}`}
                    >
                      {device.status === 1 ? "在线" : "离线"}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className='empty-devices'>暂无可用设备</View>
            )}
          </View>

          <View className='input-group'>
            <Text className='label'>场景描述</Text>
            <AtTextarea
              className='textarea'
              value={sceneDesc}
              onChange={(value) => setSceneDesc(value)}
              maxLength={200}
              placeholder='描述一下这个场景的用途'
            />
          </View>
        </View>

        <View className='button-group'>
          <AtButton
            type='primary'
            onClick={handleSubmit}
            loading={submitting}
            disabled={submitting}
          >
            保存场景
          </AtButton>
        </View>
      </AtForm>
    </View>
  );
}
