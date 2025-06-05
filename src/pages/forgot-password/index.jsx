import { View, Text, Input, Form, Button, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

const ForgotPasswordPage = () => {
  const handleSubmit = () => {
    console.log("发送重置链接");
  };

  const goToLogin = () => {
    Taro.navigateTo({
      url: "/pages/login/index",
    });
  };

  return (
    <View className="forgot-password-container">
      <View className="icon-container">
        <Image
          src="https://unpkg.com/lucide-static@latest/icons/key.svg"
          alt="App Logo"
          className="app-icon"
        />
      </View>
      <View className="header">
        <Text className="title">找回密码</Text>
        <Text className="subtitle">请输入您的邮箱，我们将发送重置密码链接</Text>
      </View>

      <Form onSubmit={handleSubmit} className="forgot-password-form">
        <View className="input-container">
          <Input type="text" placeholder="邮箱地址" className="input-field" />
        </View>

        <Button formType="submit" className="submit-button">
          发送重置链接
        </Button>
      </Form>

      <View className="login-link">
        <Text className="login-text">记起密码了? </Text>
        <Text className="link-text" onClick={goToLogin}>
          返回登录
        </Text>
      </View>
    </View>
  );
};

export default ForgotPasswordPage;
