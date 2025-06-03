import {
  View,
  Text,
  Input,
  Button,
  Form,
  Label,
  Checkbox,
  Image,
} from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";
import "./index.scss";

const RegisterPage = () => {
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
          <Input type="text" placeholder="用户名" className="input-field" />
        </View>
        <View className="input-group">
          <Input type="email" placeholder="邮箱" className="input-field" />
        </View>
        <View className="input-group">
          <Input type="password" placeholder="密码" className="input-field" />
        </View>
        <View className="input-group">
          <Input
            type="password"
            placeholder="确认密码"
            className="input-field"
          />
        </View>
        <View className="agreement">
          <Label>
            <Checkbox className="checkbox" />
            <Text className="agreement-text">我同意</Text>
            <Text className="link-text">服务条款</Text>
            <Text className="agreement-text">和</Text>
            <Text className="link-text">隐私政策</Text>
          </Label>
        </View>
        <Button formType="submit" className="register-button">
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
