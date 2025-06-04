import { View, Text } from "@tarojs/components";
import { AtButton } from "taro-ui";
import Taro from "@tarojs/taro";
import "./index.scss";

export default function SceneDetail() {
  const scene = {
    id: Taro.getCurrentInstance().router.params.id,
    name: "晚安模式",
    enabled: true,
    devices: ["客厅灯", "卧室"],
    description: "睡前自动关闭灯光",
  };

  const handleEdit = () => {
    Taro.navigateTo({
      url: `/pages/scene/add/index?id=${scene.id}`,
    });
  };

  const handleDelete = () => {
    Taro.showModal({
      title: "确认删除",
      content: "确定要删除该场景吗？",
      success: function (res) {
        if (res.confirm) {
          // 这里添加删除场景的逻辑
          console.log("Delete scene", scene.id);
          Taro.navigateBack();
        }
      },
    });
  };

  return (
    <View className="scene-detail">
      <View className="header">
        <Text className="title">{scene.name}</Text>
        <Text className="description">{scene.description}</Text>
      </View>

      <View className="section">
        <Text className="section-title">关联设备</Text>
        <View className="device-list">
          {scene.devices.map((device, index) => (
            <View key={index} className="device-item">
              <Text>{device}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="actions">
        <AtButton type="primary" onClick={handleEdit}>
          编辑场景
        </AtButton>
        <AtButton type="secondary" onClick={handleDelete}>
          删除场景
        </AtButton>
      </View>
    </View>
  );
}
