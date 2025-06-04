import { View, Text, Switch } from "@tarojs/components";
import { AtButton } from "taro-ui";
import Taro from "@tarojs/taro";
import "./index.scss";

export default function Scene() {
  const scenes = [
    {
      id: 1,
      name: "晚安模式",
      enabled: true,
      devices: ["客厅灯", "卧室"],
    },
    {
      id: 2,
      name: "起床模式",
      enabled: false,
      devices: ["窗帘", "咖啡机"],
    },
  ];

  const handleAddScene = () => {
    Taro.navigateTo({
      url: "/pages/scene/add/index",
    });
  };

  const handleSceneClick = (sceneId) => {
    Taro.navigateTo({
      url: `/pages/scene/detail/index?id=${sceneId}`,
    });
  };

  const handleSwitchChange = (e, sceneId) => {
    e.stopPropagation();
    // 这里添加启用/禁用场景的逻辑
    console.log(`Scene ${sceneId} switch changed`);
  };

  return (
    <View className="scene-page">
      <View className="section-title">常用场景</View>
      <View className="scene-list">
        {scenes.map((scene) => (
          <View key={scene.id} className="scene-card">
            <View className="scene-info">
              <Text
                className="scene-name"
                onClick={() => handleSceneClick(scene.id)}
              >
                {scene.name}
              </Text>
              <View className="device-list">
                {scene.devices.map((device, index) => (
                  <Text key={index} className="device-tag">
                    {device}
                  </Text>
                ))}
              </View>
            </View>
            <Switch
              className="scene-switch"
              checked={scene.enabled}
              onChange={(e) => handleSwitchChange(e, scene.id)}
              color="#6190E8"
            />
          </View>
        ))}
        <View className="scene-card add-card" onClick={handleAddScene}>
          <Text className="at-icon at-icon-add" />
          <Text>添加场景</Text>
        </View>
      </View>
    </View>
  );
}
