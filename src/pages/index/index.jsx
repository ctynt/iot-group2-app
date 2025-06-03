import { View, Text, Swiper, SwiperItem } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { AtCard } from "taro-ui";
import "./index.scss";

export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  // 轮播图数据
  const swiperData = [
    { id: 1, title: "智能家居", desc: "打造智能生活" },
    { id: 2, title: "节能环保", desc: "绿色智能家居" },
    { id: 3, title: "安全防护", desc: "守护家庭安全" },
  ];

  // 设备列表数据
  const devices = [
    { id: 1, name: "客厅灯", status: "开启" },
    { id: 2, name: "空调", status: "关闭" },
    { id: 3, name: "窗帘", status: "开启" },
    { id: 4, name: "电视", status: "关闭" },
  ];

  const handleDeviceClick = (deviceId) => {
    Taro.navigateTo({
      url: `/pages/device/index?deviceId=${deviceId}`,
    });
  };

  return (
    <View className="index">
      {/* 轮播图部分 */}
      <View className="swiper-container">
        <Swiper
          className="swiper"
          indicatorDots
          circular
          autoplay
          indicatorColor="#999"
          indicatorActiveColor="#4594D5"
        >
          {swiperData.map((item) => (
            <SwiperItem key={item.id} className="swiper-item">
              <View className="swiper-card">
                <Text className="card-title">{item.title}</Text>
                <Text className="card-desc">{item.desc}</Text>
              </View>
            </SwiperItem>
          ))}
        </Swiper>
      </View>

      {/* 设备列表部分 */}
      <View className="devices-section">
        <Text className="section-title">我的设备</Text>
        <View className="devices-grid">
          {devices.map((device) => (
            <View
              key={device.id}
              className="device-item"
              onClick={() => handleDeviceClick(device.id)}
            >
              <AtCard title={device.name} className="device-card">
                <Text className="device-status">{device.status}</Text>
              </AtCard>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
