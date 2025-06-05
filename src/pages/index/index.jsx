import { View, Text, Swiper, SwiperItem, Image } from "@tarojs/components";
import Taro, { useLoad, useDidShow } from "@tarojs/taro";
import React, { useState } from "react";
import { AtCard, AtButton } from "taro-ui";
import { getNewsList } from "../../services/news";
import { getDeviceList, deleteDevice } from "../../services/device";
import "./index.scss";

export default function Index() {
  const [swiperData, setSwiperData] = useState([]);
  const [devices, setDevices] = useState([]);

  // 获取设备列表数据的函数
  const fetchDeviceList = () => {
    getDeviceList({
      page: 1,
      limit: 10,
    }).then((res) => {
      if (res && res.code === 0 && res.data && res.data.list) {
        setDevices(res.data.list);
      } else {
        setDevices([]);
      }
    });
  };

  useLoad(() => {
    // 获取新闻列表数据
    getNewsList().then((res) => {
      if (res && res.data) {
        setSwiperData(res.data);
      }
    });

    // 初始加载设备列表
    fetchDeviceList();
  });

  // 每次页面显示时都重新获取设备列表
  useDidShow(() => {
    fetchDeviceList();
  });

  const handleDeviceClick = (device) => {
    Taro.navigateTo({
      url: `/pages/device/index?deviceId=${device.deviceId}`,
    });
  };

  const handleDeleteDevice = (e, device) => {
    // 阻止事件冒泡，避免触发卡片点击事件
    e.stopPropagation();

    Taro.showModal({
      title: "确认删除",
      content: `确定要删除设备「${device.name}」吗？`,
      success: function (res) {
        if (res.confirm) {
          deleteDevice(device.id)
            .then((res) => {
              if (res && res.code === 0) {
                Taro.showToast({
                  title: "删除成功",
                  icon: "success",
                });
                // 重新获取设备列表
                fetchDeviceList();
              } else {
                Taro.showToast({
                  title: "删除失败",
                  icon: "error",
                });
              }
            })
            .catch(() => {
              Taro.showToast({
                title: "删除失败",
                icon: "error",
              });
            });
        }
      },
    });
  };

  return (
    <View className="index">
      {/* 轮播图部分 */}
      <View className="swiper-container">
        <Swiper
          className="swiper"
          circular
          autoplay
          indicatorColor="#999"
          indicatorActiveColor="#4594D5"
        >
          {swiperData.map((item) => (
            <SwiperItem key={item.id} className="swiper-item">
              <View className="swiper-card">
                <Image
                  className="card-cover"
                  src={item.cover}
                  mode="aspectFill"
                />
                <View className="card-content">
                  <Text className="card-title">{item.title}</Text>
                  <Text className="card-desc">{item.content}</Text>
                </View>
              </View>
            </SwiperItem>
          ))}
        </Swiper>
      </View>

      {/* 设备列表部分 */}
      <View className="devices-section">
        <View className="section-header">
          <View>
            <Text className="section-title">我的设备</Text>
          </View>
          <View>
            <AtButton
              type="primary"
              size="small"
              onClick={() =>
                Taro.navigateTo({ url: "/pages/device/add/index" })
              }
            >
              添加设备
            </AtButton>
          </View>
        </View>
        <View className="devices-grid">
          {devices.map((device) => (
            <View
              key={device.id}
              className="device-item"
              onClick={() => handleDeviceClick(device)}
            >
              <AtCard title={device.name} className="device-card">
                <View className="device-info">
                  <Text className="device-status">
                    {device.status === 1 ? "在线" : "离线"}
                  </Text>
                  <AtButton
                    type="secondary"
                    size="small"
                    className="delete-btn"
                    onClick={(e) => handleDeleteDevice(e, device)}
                  >
                    删除
                  </AtButton>
                </View>
              </AtCard>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
