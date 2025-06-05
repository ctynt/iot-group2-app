import React from "react";
import { View, Text, Image } from "@tarojs/components";
import { AtIcon, AtAvatar, AtList, AtListItem, AtGrid } from "taro-ui";

import "./index.scss";

const My = () => {
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
        <View className="user-info">
          <AtAvatar circle image="https://jdc.jd.com/img/200" size="large" />
          <View className="user-detail">
            <Text className="username">张小明</Text>
            <Text className="user-desc">智能家居爱好者</Text>
            <View className="edit-profile">
              <AtIcon value="edit" size="15" color="#4594D5"></AtIcon>
              <Text className="edit-text">编辑资料</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 账号与安全 */}
      <View className="section-card">
        <Text className="section-title">账号与安全</Text>
        <AtList>
          <AtListItem
            title="账号安全"
            arrow="right"
            iconInfo={{ size: 25, color: "#4594D5", value: "menu" }}
          />
          <AtListItem
            title="隐私设置"
            arrow="right"
            iconInfo={{ size: 25, color: "#4594D5", value: "lock" }}
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
    </View>
  );
};

export default My;