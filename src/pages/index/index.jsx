import { View, Text } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import { AtButton } from "taro-ui";
import "./index.scss";

export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  return (
    <View className="index">
      <Text className="title">Hello world!</Text>
      <AtButton>点击我</AtButton>
    </View>
  );
}
