import { View, Text, Input, Button, Form, Image } from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";
import { useState } from "react";
import Taro from "@tarojs/taro";
import { register } from "@/service/user";
import "./index.scss";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  // 已移除服务条款同意状态

  const handleInput = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      Taro.showToast({
        title: "两次输入的密码不一致",
        icon: "none",
      });
      return;
    }

    try {
      const registerData = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        mobile: formData.mobile,
      };

      await register(registerData);
      Taro.showToast({
        title: "注册成功",
        icon: "success",
      });
      setTimeout(() => {
        goToLogin();
      }, 1500);
    } catch (error) {
      Taro.showToast({
        title: error.message || "注册失败",
        icon: "none",
      });
    }
  };

  const goToLogin = () => {
    navigateTo({
      url: "/pages/login/index",
    });
  };

  return (
    <View className="register-container">
      <View className="icon-container">
        <Image
          src="https://unpkg.com/lucide-static@latest/icons/user-plus.svg"
          alt="App Logo"
          className="app-icon"
        />
      </View>
      <View className="header">
        <Text className="title">创建账户</Text>
        <Text className="subtitle">加入我们，体验智能生活</Text>
      </View>
      <Form className="form">
        <View className="input-group">
          <Input
            type="text"
            placeholder="用户名"
            className="input-field"
            value={formData.username}
            onInput={(e) => handleInput("username", e.detail.value)}
          />
        </View>
        <View className="input-group">
          <Input
            type="email"
            placeholder="邮箱"
            className="input-field"
            value={formData.email}
            onInput={(e) => handleInput("email", e.detail.value)}
          />
        </View>
        <View className="input-group">
          <Input
            type="text"
            placeholder="手机号"
            className="input-field"
            value={formData.mobile}
            onInput={(e) => handleInput("mobile", e.detail.value)}
          />
        </View>
        <View className="input-group">
          <Input
            type="password"
            placeholder="密码"
            className="input-field"
            value={formData.password}
            onInput={(e) => handleInput("password", e.detail.value)}
          />
        </View>
        <View className="input-group">
          <Input
            type="password"
            placeholder="确认密码"
            className="input-field"
            value={formData.confirmPassword}
            onInput={(e) => handleInput("confirmPassword", e.detail.value)}
          />
        </View>
        {/* <View className="agreement">
          <Label>
            <Checkbox
              className="checkbox"
              checked={agreed}
              onClick={handleAgreeChange} // 改为 onClick
            />
            <Text className="agreement-text">我同意</Text>
            <Text className="link-text">服务条款</Text>
            <Text className="agreement-text">和</Text>
            <Text className="link-text">隐私政策</Text>
          </Label>
        </View> */}
        <Button className="register-button" onClick={handleRegister}>
          注册
        </Button>
      </Form>
      <View className="login-link">
        <Text className="text">已有账户?</Text>
        <Text className="link-text" onClick={goToLogin}>
          登录
        </Text>
      </View>
    </View>
  );
};

export default RegisterPage;
