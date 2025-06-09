import { View, Text, Input, Form, Button, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState } from "react";
import { accountLogin } from "@/service/user";
import { useAppDispatch } from "@/store";
import { setUserInfo } from "@/store/user";
import "./index.scss";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInput = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const res = await accountLogin(formData);
      if (res?.accessToken) {
        // 存储token
        Taro.setStorageSync("token", res.accessToken);
        // 更新用户信息
        dispatch(setUserInfo(res));
        // 跳转到首页
        Taro.switchTab({
          url: "/pages/index/index",
        });
      }
    } catch (error) {
      Taro.showToast({
        title: error.message || "登录失败",
        icon: "none",
      });
    }
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
          <Input
            type="text"
            placeholder="用户名"
            className="input-field"
            value={formData.username}
            onInput={(e) => handleInput("username", e.detail.value)}
          />
        </View>
        <View className="input-container">
          <Input
            type="password"
            placeholder="密码"
            className="input-field"
            value={formData.password}
            onInput={(e) => handleInput("password", e.detail.value)}
          />
        </View>

        <View className="forgot-password" onClick={goToForgotPassword}>
          <Text className="link-text">忘记密码?</Text>
        </View>

        <Button
          formType="submit"
          className="login-button"
          onClick={handleLogin}
        >
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
