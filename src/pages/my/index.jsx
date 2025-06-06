import { View, Text, Image } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import {
  AtIcon,
  AtAvatar,
  AtList,
  AtListItem,
  AtGrid,
  AtButton,
  AtMessage,
} from "taro-ui";
import { useAppSelector, useAppDispatch } from "@/store";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/service/user";
import { setUserInfo, clearUserInfo } from "@/store/user";
import "./index.scss";

export default function My() {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // 用于强制刷新

  // 获取用户信息的函数
  const fetchUserInfo = async () => {
    if (!Taro.getStorageSync("token")) return;

    setLoading(true);
    try {
      const res = await getUserInfo();
      if (res) {
        // 确保avatar字段有值，避免显示问题
        if (!res.avatar) {
          res.avatar = "https://img.yzcdn.cn/vant/cat.jpeg";
        }
        // 确保所有必要字段都有值
        const updatedInfo = {
          ...res,
          // 保留accessToken，避免被覆盖
          accessToken: userInfo.accessToken || Taro.getStorageSync("token"),
        };
        dispatch(setUserInfo(updatedInfo));
      }
    } catch (error) {
      console.error("获取用户信息失败:", error);
      Taro.showToast({
        title: "获取用户信息失败",
        icon: "none",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  // 首次加载时获取用户信息
  useEffect(() => {
    if (Taro.getStorageSync("token")) {
      fetchUserInfo();
    }
  }, [refreshKey]); // 添加refreshKey依赖，支持手动刷新

  // 每次页面显示时获取最新用户信息
  useDidShow(() => {
    if (Taro.getStorageSync("token")) {
      fetchUserInfo();
    }
  });

  // 手动刷新
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    Taro.showToast({
      title: "刷新中...",
      icon: "loading",
      duration: 1000,
    });
  };

  // 处理编辑资料点击事件
  const handleEditProfile = () => {
    Taro.navigateTo({
      url: "/pages/editUser/index",
    });
  };

  const handleClickLogin = () => {
    Taro.navigateTo({
      url: "/pages/login/index",
    });
  };

  const handleLogout = () => {
    Taro.showModal({
      title: "提示",
      content: "确定要退出登录吗？",
      success: function (res) {
        if (res.confirm) {
          // 清除token
          Taro.removeStorageSync("token");
          // 清除用户信息
          dispatch(clearUserInfo());
          // 显示提示
          Taro.showToast({
            title: "已退出登录",
            icon: "success",
            duration: 2000,
          });
        }
      },
    });
  };

  const serviceItems = [
    {
      image:
        "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png",
      value: "收藏",
    },
    {
      image:
        "https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png",
      value: "历史",
    },
    {
      image:
        "https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png",
      value: "反馈",
    },
    {
      image:
        "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png",
      value: "帮助",
    },
  ];

  return (
    <View className="my-container">
      {/* 顶部刷新按钮 */}
      <View className="header-actions">
        <AtIcon
          value="refresh"
          size="24"
          color="#4594D5"
          onClick={handleRefresh}
        ></AtIcon>
      </View>

      {/* 用户信息卡片 */}
      <View className="user-card">
        {userInfo && userInfo.id > 0 ? (
          <View className="user-info">
            <AtAvatar
              circle
              image={userInfo.avatar || "https://img.yzcdn.cn/vant/cat.jpeg"}
              size="large"
            />
            <View className="user-detail">
              <Text className="username">
                {userInfo.nickname || "未设置昵称"}
              </Text>
              <Text className="user-desc">智能家居爱好者</Text>
              <View className="edit-profile" onClick={handleEditProfile}>
                <AtIcon value="edit" size="15" color="#4594D5"></AtIcon>
                <Text className="edit-text">编辑资料</Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="user-info-not-logged">
            <View className="not-logged-content">
              <AtAvatar
                circle
                image="https://img.yzcdn.cn/vant/cat.jpeg"
                size="large"
              />
              <View className="user-detail">
                <Text className="username">欢迎使用智能家居</Text>
                <Text className="login-tip">登录后体验更多功能</Text>
              </View>
            </View>
            <View className="login-actions">
              <AtButton onClick={handleClickLogin} type="primary" size="normal">
                登录/注册
              </AtButton>
            </View>
          </View>
        )}
      </View>

      {userInfo && userInfo.id > 0 ? (
        <>
          {/* 账号与安全 */}
          <View className="section-card">
            <Text className="section-title">账号与安全</Text>
            <AtList>
              <AtListItem
                title="用户名"
                extraText={userInfo.username}
                iconInfo={{ size: 25, color: "#4594D5", value: "user" }}
              />
              <AtListItem
                title="手机号"
                extraText={userInfo.mobile || "未绑定"}
                iconInfo={{ size: 25, color: "#4594D5", value: "phone" }}
              />
              <AtListItem
                title="邮箱"
                extraText={userInfo.email || "未绑定"}
                iconInfo={{ size: 25, color: "#4594D5", value: "mail" }}
              />
            </AtList>
          </View>

          {/* 我的服务 */}
          <View className="section-card">
            <Text className="section-title">我的服务</Text>
            <AtGrid data={serviceItems} hasBorder={false} />
          </View>

          {/* 设置 */}
          <View className="section-card">
            <Text className="section-title">设置</Text>
            <AtList>
              <AtListItem
                title="语言"
                extraText="简体中文"
                arrow="right"
                iconInfo={{ size: 25, color: "#4594D5", value: "repeat-play" }}
              />
              <AtListItem
                title="通知设置"
                arrow="right"
                iconInfo={{ size: 25, color: "#4594D5", value: "bell" }}
              />
              <AtListItem
                title="关于"
                extraText="v1.0.0"
                arrow="right"
                iconInfo={{ size: 25, color: "#4594D5", value: "help" }}
              />
            </AtList>
          </View>

          <View className="section-card">
            <View className="logout-btn">
              <AtButton type="secondary" onClick={handleLogout}>
                退出登录
              </AtButton>
            </View>
          </View>
        </>
      ) : (
        <View className="not-logged-features">
          <View className="section-card">
            <Text className="section-title">登录后可使用的功能</Text>
            <View className="feature-grid">
              <View className="feature-item">
                <AtIcon value="home" size="30" color="#4594D5"></AtIcon>
                <Text className="feature-text">智能家居控制</Text>
              </View>
              <View className="feature-item">
                <AtIcon value="settings" size="30" color="#4594D5"></AtIcon>
                <Text className="feature-text">设备管理</Text>
              </View>
              <View className="feature-item">
                <AtIcon
                  value="lightning-bolt"
                  size="30"
                  color="#4594D5"
                ></AtIcon>
                <Text className="feature-text">场景自动化</Text>
              </View>
              <View className="feature-item">
                <AtIcon value="analytics" size="30" color="#4594D5"></AtIcon>
                <Text className="feature-text">数据分析</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
