import { useState, useEffect } from 'react';
import { View, Text, Input, Form, Button, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { sendCode, mobileLogin, updateUser } from "@/service/user";
import { isPhoneAvailable, isCodeAvailable, isValidPassword } from "@/utils/validate";
import "./index.scss";

const ForgotPasswordPage = () => {
  // 倒计时
  const [count, setCount] = useState(60);
  const [timer, setTimer] = useState(false);
  // 表单数据
  const [form, setForm] = useState({
    mobile: '15896153901',
    code: '',
    password: '',
    confirmPassword: ''
  });
  // 步骤控制
  const [step, setStep] = useState(1); // 1: 手机验证, 2: 密码重置
  // 用户信息
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    let interval;
    if (timer) {
      interval = setInterval(() => {
        setCount(prevCount => {
          if (prevCount === 1) {
            clearInterval(interval);
            setTimer(false);
            return 60;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
  }, [timer]);

  // 发送手机验证码
  const sendMobileCode = async () => {
    if (form.mobile && isPhoneAvailable(form.mobile)) {
      try {
        setTimer(true);
        setCount(60);
        await sendCode(form.mobile);
        Taro.showToast({
          title: '验证码发送成功',
          icon: 'success',
        });
      } catch (error) {
        console.error('发送验证码失败:', error);
        Taro.showToast({
          title: error?.message || '验证码发送失败',
          icon: 'error',
        });
        // 发送失败时重置计时器
        setTimer(false);
        setCount(60);
      }
    } else {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
      });
    }
  };

  // 验证手机号和验证码
  const verifyMobile = async () => {
    if (!form.mobile || !isPhoneAvailable(form.mobile)) {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
      });
      return;
    }
    if (!form.code || !isCodeAvailable(form.code)) {
      Taro.showToast({
        title: '请输入正确的验证码',
        icon: 'none',
      });
      return;
    }

    try {
      // 使用手机号和验证码登录，验证身份
      const res = await mobileLogin({
        mobile: form.mobile,
        code: form.code
      });
      
      if (res && res.accessToken) {
        // 保存token和用户信息
        Taro.setStorageSync('token', res.accessToken);
        setUserInfo(res);
        // 进入下一步
        setStep(2);
        Taro.showToast({
          title: '验证成功，请设置新密码',
          icon: 'success',
        });
      } else {
        Taro.showToast({
          title: '验证失败，请重试',
          icon: 'none',
        });
      }
    } catch (error) {
      console.error('验证失败:', error);
      Taro.showToast({
        title: error?.message || '验证失败，请重试',
        icon: 'none',
      });
    }
  };

  // 重置密码
  const resetPassword = async () => {
    if (!form.password || !isValidPassword(form.password)) {
      Taro.showToast({
        title: '密码必须为数字或字母,长度不少于6位',
        icon: 'none',
      });
      return;
    }
    if (form.password !== form.confirmPassword) {
      Taro.showToast({
        title: '两次输入的密码不一致',
        icon: 'none',
      });
      return;
    }

    try {
      // 更新用户密码
      await updateUser({
        id: userInfo.id,
        mobile: form.mobile,
        password: form.password
      });
      
      Taro.showModal({
        title: '密码重置成功',
        content: '请使用新密码登录',
        showCancel: false,
        success: () => {
          Taro.navigateTo({
            url: '/pages/login/index',
          });
        }
      });
    } catch (error) {
      console.error('密码重置失败:', error);
      Taro.showToast({
        title: error?.message || '密码重置失败，请重试',
        icon: 'none',
      });
    }
  };

  const goToLogin = () => {
    Taro.navigateTo({
      url: "/pages/login/index",
    });
  };

  const handleInputChange = (field, e) => {
    setForm({ ...form, [field]: e.detail.value });
  };

  return (
    <View className="forgot-password-container">

      <View className="header">
        <Text className="title">找回密码</Text>
        <Text className="subtitle">
          {step === 1 ? '请输入手机号和验证码进行身份验证' : '请设置新密码'}
        </Text>
      </View>

      {step === 1 ? (
        <View className="forgot-password-form">
          <View className="input-container">
            <Input 
              type="text" 
              placeholder="手机号" 
              className="input-field" 
              value={form.mobile}
              onInput={(e) => handleInputChange('mobile', e)}
            />
          </View>

          <View className="code-container">
            <Input 
              type="text" 
              placeholder="验证码" 
              className="input-field code-input" 
              value={form.code}
              onInput={(e) => handleInputChange('code', e)}
            />
            {!timer ? (
              <Text className="code-button" onClick={sendMobileCode} hidden={timer}>
                获取验证码
              </Text>
            ) : (
              <Text className="code-button disabled" hidden={!timer}>{count}秒后重发</Text>
            )}
          </View>

          <Button className="submit-button" onClick={verifyMobile}>
            验证身份
          </Button>
        </View>
      ) : (
        <View className="forgot-password-form">
          <View className="input-container">
            <Input 
              type="password" 
              placeholder="新密码" 
              className="input-field" 
              value={form.password}
              onInput={(e) => handleInputChange('password', e)}
            />
          </View>

          <View className="input-container">
            <Input 
              type="password" 
              placeholder="确认新密码" 
              className="input-field" 
              value={form.confirmPassword}
              onInput={(e) => handleInputChange('confirmPassword', e)}
            />
          </View>

          <Button className="submit-button" onClick={resetPassword}>
            重置密码
          </Button>
        </View>
      )}

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
