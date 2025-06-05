import { View, Text, Swiper, SwiperItem } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import React, { useState } from "react";
import { AtCard } from "taro-ui";
import { getNewsList } from "../../services/news";
import "./index.scss";

export default function Index() {
  const [swiperData, setSwiperData] = useState([]);

  useLoad(() => {
    // 获取新闻列表数据
    getNewsList().then((res) => {
      if (res && res.data) {
        setSwiperData(res.data);
      }
    });
  });

  // 设备列表数据
  const devices = [
    {
      id: 1,
      device_id: 101,
      name: "客厅灯",
      type: 1,
      switch: 1,
      status: 1,
      temperature: null,
      humidity: null,
    },
    {
      id: 2,
      device_id: 102,
      name: "卧室温湿度计",
      type: 2,
      switch: 1,
      status: 1,
      temperature: 25.5,
      humidity: 60.0,
    },
    {
      id: 3,
      device_id: 103,
      name: "门禁蜂鸣器",
      type: 3,
      switch: 0,
      status: 1,
      temperature: null,
      humidity: null,
    },
    {
      id: 4,
      device_id: 104,
      name: "走廊红外探测器",
      type: 4,
      switch: 1,
      status: 0,
      temperature: null,
      humidity: null,
    },
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
                <Text className="card-desc">{item.content}</Text>
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
