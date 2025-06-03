import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AtButton } from "taro-ui";

import "./index.scss";

export default function Index() {
  const goToLogin = () => {
    Taro.navigateTo({
      url: "/pages/forgot-password/index",
    });
  };
  return (
    <View className="index">
      <Text className="title">Hello world!</Text>
      <AtButton onClick={goToLogin}>跳转到找回密码页面</AtButton>
    </View>
  );
}
