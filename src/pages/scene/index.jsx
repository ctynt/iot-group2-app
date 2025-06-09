import { View, Text, Switch } from "@tarojs/components";
import { AtButton } from "taro-ui";
import Taro, { useDidShow } from "@tarojs/taro";
import { useState, useEffect } from "react";
import { getSceneList } from "../../services/scene";
import { getUserInfo } from "@/service/user";
import { useAppSelector, useAppDispatch } from "@/store";
import { setUserInfo } from "@/store/user";
import "./index.scss";

export default function Scene() {
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localUserId, setLocalUserId] = useState(null); // 本地userId状态
  const [loginRequired, setLoginRequired] = useState(false); // 新增：标记是否需要登录
  const userInfo = useAppSelector((state) => state.user);
  const userId = userInfo.id || localUserId; // 优先使用Redux中的userId，其次使用本地状态
  const dispatch = useAppDispatch();

  // 获取用户信息的函数
  const fetchUserInfo = async () => {
    const token = Taro.getStorageSync("token");
    if (!token) {
      console.log("场景页面 - 未找到token");
      setLoginRequired(true); // 设置需要登录标记
      return false; // 返回false表示获取失败
    }

    setLoading(true);
    try {
      console.log("场景页面 - 开始获取用户信息");
      const res = await getUserInfo();
      if (res) {
        console.log("场景页面 - 获取用户信息成功:", res);
        // 同时更新Redux和本地状态
        if (res.id) {
          setLocalUserId(res.id);
          setLoginRequired(false); // 重置登录标记
        }
        // 确保所有必要字段都有值
        const updatedInfo = {
          ...res,
          // 保留accessToken，避免被覆盖
          accessToken: token,
        };
        dispatch(setUserInfo(updatedInfo));
        return true; // 返回true表示获取成功
      }
    } catch (error) {
      console.error("获取用户信息失败:", error);
      // 检查是否是未授权错误(401)
      if (error.message && error.message.includes("401")) {
        setLoginRequired(true);
        // 清除无效token
        Taro.removeStorageSync("token");
      }
    } finally {
      setLoading(false);
    }
    return false; // 默认返回false
  };

  // 获取场景列表
  const fetchScenes = async () => {
    // 如果没有userId，先尝试获取用户信息
    if (!userId) {
      console.log("场景页面 - userId为空，尝试获取用户信息");
      const success = await fetchUserInfo();
      if (!success) {
        console.log("场景页面 - 获取用户信息失败，无法获取场景列表");
        return;
      }
    }

    // 再次检查userId（可能已经通过fetchUserInfo更新）
    const currentUserId = userInfo.id || localUserId;

    if (!currentUserId) {
      console.log("场景页面 - 获取用户信息后仍无userId，无法获取场景列表");
      return;
    }

    try {
      setLoading(true);
      console.log("正在获取场景列表，userId:", currentUserId);
      const data = await getSceneList({
        page: 1,
        limit: 10,
        userId: currentUserId,
      });

      // 根据API返回结构处理数据
      if (data && data.list) {
        setScenes(data.list);
      } else {
        setScenes([]);
      }
    } catch (error) {
      console.error("获取场景列表失败:", error);
      Taro.showToast({
        title: "获取场景列表失败",
        icon: "none",
      });
    } finally {
      setLoading(false);
    }
  };

  // 跳转到登录页面
  const goToLogin = () => {
    Taro.navigateTo({
      url: "/pages/login/index",
    });
  };

  // 组件挂载时立即获取用户信息
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // 每次页面显示时获取最新用户信息
  useDidShow(() => {
    fetchUserInfo().then((success) => {
      if (success && userId) {
        fetchScenes();
      }
    });
  });

  // 当userId变化时获取场景列表
  useEffect(() => {
    console.log("场景页面 - 当前userId:", userId);
    if (userId) {
      fetchScenes();
    }
  }, [userId]);

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
      {loginRequired ? (
        <View className="login-required">
          <Text className="login-message">请先登录以查看您的场景</Text>
          <AtButton type="primary" onClick={goToLogin}>
            去登录
          </AtButton>
        </View>
      ) : (
        <View>
          {/* 添加场景按钮 - 始终显示（只要已登录） */}
          <View className="add-scene-button-container">
            <AtButton type="primary" onClick={handleAddScene}>
              添加场景
            </AtButton>
          </View>

          {loading ? (
            <View className="loading">加载中...</View>
          ) : (
            <View className="scene-list">
              {scenes.length > 0 ? (
                scenes.map((scene) => (
                  <View
                    key={scene.id}
                    className="scene-card"
                    onClick={() => handleSceneClick(scene.id)}
                  >
                    <View className="scene-info">
                      <Text className="scene-name">{scene.name}</Text>
                      <Text className="scene-desc">
                        {scene.description || "无描述"}
                      </Text>
                    </View>
                    <Switch
                      checked={scene.enabled}
                      onChange={(e) => handleSwitchChange(e, scene.id)}
                      className="scene-switch"
                    />
                  </View>
                ))
              ) : (
                <View className="empty-state">
                  <Text className="empty-text">暂无场景</Text>
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
