import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import {
  AtIcon,
  AtAvatar,
  AtList,
  AtListItem,
  AtGrid,
  AtButton,
} from "taro-ui";
import { useAppSelector, useAppDispatch } from "@/store";
import { useEffect } from "react";
import { getUserInfo } from "@/service/user";
import { setUserInfo, clearUserInfo } from "@/store/user";
import "./index.scss";

export default function My() {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.user);

  useEffect(() => {
    if (Taro.getStorageSync("token")) {
      fetchUserInfo();
    }
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo();
      if (res) {
        dispatch(setUserInfo(res));
      }
    } catch (error) {
      console.error("获取用户信息失败:", error);
    }
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
          // 跳转到登录页
          Taro.navigateTo({
            url: "/pages/login/index",
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
              <View className="edit-profile">
                <AtIcon value="edit" size="15" color="#4594D5"></AtIcon>
                <Text className="edit-text">编辑资料</Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="user-info">
            <AtAvatar circle image="https://jdc.jd.com/img/200" size="large" />
            <View className="user-detail">
              <Text className="username">未登录</Text>
              <AtButton onClick={handleClickLogin} type="primary" size="small">
                前往登录
              </AtButton>
            </View>
          </View>
        )}
      </View>

      {userInfo && userInfo.id > 0 && (
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
      )}
    </View>
  );
}
