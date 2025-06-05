import { View, Text, Input, Form, Button, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

const LoginPage = () => {
  const handleLogin = () => {
    console.log("登录");
  };

  const goToRegister = () => {
    Taro.navigateTo({
      url: "/pages/register/index",
    });
  };

  const goToForgotPassword = () => {
    Taro.navigateTo({
      url: "/pages/forgot-password/index",
    });
  };

  return (
    <View className="login-container">
      <View className="icon-container">
        <Image
          src="https://hyzhu-oss.oss-cn-hangzhou.aliyuncs.com/community/community.png"
          alt="App Logo"
          className="app-icon"
        />
      </View>
      <View className="header">
        <Text className="title">欢迎回来</Text>
        <Text className="subtitle">登录以继续</Text>
      </View>

      <Form onSubmit={handleLogin} className="login-form">
        <View className="input-container">
          <Input type="text" placeholder="用户名" className="input-field" />
        </View>
        <View className="input-container">
          <Input type="password" placeholder="密码" className="input-field" />
        </View>

        <View className="forgot-password" onClick={goToForgotPassword}>
          <Text className="link-text">忘记密码?</Text>
        </View>

        <Button formType="submit" className="login-button">
          登录
        </Button>
      </Form>

      <View className="divider">
        <Text className="divider-text">或其他方式登录</Text>
      </View>

      <View className="social-login">
        <View className="social-icon">f</View>
        <View className="social-icon">t</View>
        <View className="social-icon">m</View>
      </View>

      <View className="register-link">
        <Text className="register-text">还没有账户? </Text>
        <Text className="link-text" onClick={goToRegister}>
          注册
        </Text>
      </View>
    </View>
  );
};

export default LoginPage;
