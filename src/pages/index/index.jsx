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
      // 修改前: if (res && res.code === 0 && res.data && res.data.list)
      // 修改后: 直接使用返回的数据，因为 http.js 已经返回了 result.data
      if (res && res.list) {
        setDevices(res.list);
        console.log(res.list);
      } else {
        setDevices([]);
      }
    });
  };

  useLoad(() => {
    // 获取新闻列表数据
    getNewsList().then((res) => {
      // 修改前: if (res && res.data)
      // 修改后: 直接使用返回的数据
      if (res) {
        setSwiperData(res);
      }
    });

    // 初始加载设备列表
    fetchDeviceList();
  });

  // 每次页面显示时都重新获取设备列表和轮播图列表
  useDidShow(() => {
    // 重新获取设备列表
    fetchDeviceList();

    // 重新获取新闻列表数据
    getNewsList()
      .then((res) => {
        if (res) {
          setSwiperData(res);
        }
      })
      .catch((error) => {
        console.error("获取新闻列表失败:", error);
      });
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
            .then(() => {
              // 如果代码执行到这里，说明请求成功
              Taro.showToast({
                title: "删除成功",
                icon: "success",
              });
              // 重新获取设备列表
              fetchDeviceList();
            })
            .catch((error) => {
              Taro.showToast({
                title: error.message || "删除失败",
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
          {/* <View>
            <AtButton
              type="primary"
              size="small"
              onClick={() =>
                Taro.navigateTo({ url: "/pages/device/add/index" })
              }
            >
              添加设备
            </AtButton>
          </View> */}
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
                  {/* <AtButton
                    type="secondary"
                    size="small"
                    className="delete-btn"
                    onClick={(e) => handleDeleteDevice(e, device)}
                  >
                    删除
                  </AtButton> */}
                </View>
              </AtCard>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
