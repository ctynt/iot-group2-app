import { View, Text, Input, Button, Form, Image } from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";
import { useState } from "react";
import Taro from "@tarojs/taro";
import { register } from "@/service/user";
import { isPhoneAvailable, isValidPassword, isEmail } from "@/utils/validate";
import "./index.scss";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  // 表单错误信息
  const [errors, setErrors] = useState({
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

    // 清除对应字段的错误信息
    setErrors(prev => ({
      ...prev,
      [field]: ""
    }));

    // 实时验证输入
    validateField(field, value);
  };

  // 验证单个字段
  const validateField = (field, value) => {
    let errorMessage = "";

    switch (field) {
      case "username":
        if (!value.trim()) {
          errorMessage = "用户名不能为空";
        } else if (value.length < 3) {
          errorMessage = "用户名至少需要3个字符";
        }
        break;
      case "email":
        if (!value.trim()) {
          errorMessage = "邮箱不能为空";
        } else if (!isEmail(value)) {
          errorMessage = "邮箱格式不正确";
        }
        break;
      case "mobile":
        if (!value.trim()) {
          errorMessage = "手机号不能为空";
        } else if (!isPhoneAvailable(value)) {
          errorMessage = "手机号格式不正确";
        }
        break;
      case "password":
        if (!value) {
          errorMessage = "密码不能为空";
        } else if (!isValidPassword(value)) {
          errorMessage = "密码至少需要6位字母或数字";
        }
        break;
      case "confirmPassword":
        if (!value) {
          errorMessage = "请确认密码";
        } else if (value !== formData.password) {
          errorMessage = "两次输入的密码不一致";
        }
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: errorMessage
    }));

    return !errorMessage;
  };

  // 验证所有字段
  const validateForm = () => {
    let isValid = true;
    let newErrors = {...errors};

    // 验证用户名
    if (!formData.username.trim()) {
      newErrors.username = "用户名不能为空";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "用户名至少需要3个字符";
      isValid = false;
    }

    // 验证邮箱
    if (!formData.email.trim()) {
      newErrors.email = "邮箱不能为空";
      isValid = false;
    } else if (!isEmail(formData.email)) {
      newErrors.email = "邮箱格式不正确";
      isValid = false;
    }

    // 验证手机号
    if (!formData.mobile.trim()) {
      newErrors.mobile = "手机号不能为空";
      isValid = false;
    } else if (!isPhoneAvailable(formData.mobile)) {
      newErrors.mobile = "手机号格式不正确";
      isValid = false;
    }

    // 验证密码
    if (!formData.password) {
      newErrors.password = "密码不能为空";
      isValid = false;
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = "密码至少需要6位字母或数字";
      isValid = false;
    }

    // 验证确认密码
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "请确认密码";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "两次输入的密码不一致";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    // 验证表单
    if (!validateForm()) {
      Taro.showToast({
        title: "请检查表单填写是否正确",
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
            className={`input-field ${errors.username ? 'input-error' : ''}`}
            value={formData.username}
            onInput={(e) => handleInput("username", e.detail.value)}
          />
          {errors.username && <Text className="error-message">{errors.username}</Text>}
        </View>
        <View className="input-group">
          <Input
            type="email"
            placeholder="邮箱"
            className={`input-field ${errors.email ? 'input-error' : ''}`}
            value={formData.email}
            onInput={(e) => handleInput("email", e.detail.value)}
          />
          {errors.email && <Text className="error-message">{errors.email}</Text>}
        </View>
        <View className="input-group">
          <Input
            type="text"
            placeholder="手机号"
            className={`input-field ${errors.mobile ? 'input-error' : ''}`}
            value={formData.mobile}
            onInput={(e) => handleInput("mobile", e.detail.value)}
          />
          {errors.mobile && <Text className="error-message">{errors.mobile}</Text>}
        </View>
        <View className="input-group">
          <Input
            type="password"
            placeholder="密码"
            className={`input-field ${errors.password ? 'input-error' : ''}`}
            value={formData.password}
            onInput={(e) => handleInput("password", e.detail.value)}
          />
          {errors.password && <Text className="error-message">{errors.password}</Text>}
        </View>
        <View className="input-group">
          <Input
            type="password"
            placeholder="确认密码"
            className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
            value={formData.confirmPassword}
            onInput={(e) => handleInput("confirmPassword", e.detail.value)}
          />
          {errors.confirmPassword && <Text className="error-message">{errors.confirmPassword}</Text>}
        </View>
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
