import { View, Text, Swiper, SwiperItem, Image } from "@tarojs/components";
import Taro, {
  useLoad,
  useDidShow,
  usePullDownRefresh,
  useReachBottom,
} from "@tarojs/taro";
import { useState } from "react";
import { AtCard } from "taro-ui";
import { getNewsList } from "../../services/news";
import { getDeviceList } from "../../services/device";
import "./index.scss";

// 定义页面配置
export default function Index() {
  const [swiperData, setSwiperData] = useState([]);
  const [devices, setDevices] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  // 获取设备列表数据的函数
  const fetchDeviceList = (pageNum = 1, isLoadMore = false) => {
    if (loading || (!hasMore && isLoadMore)) return;

    setLoading(true);

    getDeviceList({
      page: pageNum,
      limit: pageSize,
    })
      .then((res) => {
        // 修改前: if (res && res.code === 0 && res.data && res.data.list)
        // 修改后: 直接使用返回的数据，因为 http.js 已经返回了 result.data
        if (res && res.list) {
          // 检查是否还有更多数据
          if (res.list.length < pageSize) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }

          if (isLoadMore) {
            // 加载更多时，将新数据追加到现有数据
            setDevices((prevDevices) => [...prevDevices, ...res.list]);
          } else {
            // 首次加载或刷新时，直接替换数据
            setDevices(res.list);
          }

          // 更新页码
          setPage(pageNum);
          console.log(res.list);
        } else {
          if (!isLoadMore) {
            setDevices([]);
          }
          setHasMore(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("获取设备列表失败:", error);
        setLoading(false);
      });
  };

  // 监听页面触底事件
  useReachBottom(() => {
    console.log("触发上拉加载");
    if (hasMore && !loading) {
      fetchDeviceList(page + 1, true);
    }
  });

  // 使用Taro的下拉刷新Hook
  usePullDownRefresh(() => {
    console.log("触发下拉刷新");
    setHasMore(true); // 重置hasMore状态
    fetchDeviceList(1, false);
    // 同时刷新轮播图
    getNewsList()
      .then((res) => {
        if (res) {
          setSwiperData(res);
        }
        Taro.stopPullDownRefresh();
      })
      .catch((error) => {
        console.error("获取新闻列表失败:", error);
        Taro.stopPullDownRefresh();
      });
  });

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
    fetchDeviceList(1, false);
  });

  // 每次页面显示时都重新获取设备列表和轮播图列表
  useDidShow(() => {
    // 重新获取设备列表
    fetchDeviceList(1, false);

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

  // 页面配置，支持下拉刷新
  Taro.config = {
    navigationBarTitleText: "首页",
    enablePullDownRefresh: true,
    backgroundTextStyle: "dark",
    onReachBottomDistance: 50, // 触发距离底部多远时（单位px）触发onReachBottom
  };

  const handleDeviceClick = (device) => {
    Taro.navigateTo({
      url: `/pages/device/index?deviceId=${device.deviceId}`,
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
          {devices.length > 0 ? (
            <>
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

              {/* 加载状态提示 - 放在grid内部以使用grid-column */}
              {loading && (
                <View className="loading-tip">
                  <Text>正在加载更多...</Text>
                </View>
              )}

              {/* 没有更多数据提示 - 放在grid内部以使用grid-column */}
              {!hasMore && devices.length > 0 && (
                <View className="no-more-tip">
                  <Text>— 没有更多设备了 —</Text>
                </View>
              )}
            </>
          ) : (
            <View className="empty-devices">
              <Text>暂无设备</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
