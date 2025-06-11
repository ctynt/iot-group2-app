import { useState, useEffect } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import { sendCode, mobileLogin, getUserInfo } from '@/service/user'
import {  isPhoneAvailable, isCodeAvailable } from '@/utils/validate'
import Taro from '@tarojs/taro'
import { setUserInfo } from '@/store/user'
import './index.scss'
import { useAppDispatch } from '@/store'

const PhoneLogin = () => {
  // 倒计时
  const [count, setCount] = useState(60)
  const [timer, setTimer] = useState(false)
  // 登录表单
  const [form, setForm] = useState({
    mobile: '15896153901',
    code: '',
  })

  useEffect(() => {
    let interval
    if (timer) {
      interval = setInterval(() => {
        setCount(prevCount => {
          if (prevCount === 1) {
            clearInterval(interval)
            setTimer(false)
            return 60
          }
          return prevCount - 1
        })
      }, 1000)
    }
  }, [timer])

  // 发送手机验证码
  const sendMobileCode = async () => {
    if (form.mobile && isPhoneAvailable(form.mobile)) {
      try {
        setTimer(true);
        setCount(60);
        await sendCode(form.mobile);
        // sendCode 成功时不返回数据，只需处理成功情况
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
      })
    }
  }

  const dispatch = useAppDispatch()

  const getLoginUserInfo = async () => {
    try {
      const res = await getUserInfo()
      // 如果没有抛出异常，说明获取用户信息成功
      console.log('获取用户信息成功:', res) // 调试输出，查看实际返回的数据结构
      
      // http.js 已经返回了 result.data，所以 res 就是 UserVO 对象
      if (res) {
        dispatch(setUserInfo(res))
        console.log('用户信息:', res)
        Taro.setStorageSync('user', res)
      } else {
        console.error('获取用户信息返回数据格式不正确:', res)
        Taro.showToast({
          title: '获取用户信息失败',
          icon: 'none',
        })
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      Taro.showToast({
        title: error?.message || '获取用户信息失败',
        icon: 'none',
      })
    }
  }

  // 手机号验证码登录
  const handleLoginClick = async () => {
    // 短信登录逻辑
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
      const res = await mobileLogin(form);
      // http.js 已经返回了 result.data，所以 res 就是 MobileLoginVO 对象
      console.log('登录成功，返回数据:', res);
      
      // 直接使用返回的数据，不需要检查 res.code
      if (res && res.accessToken) {
        Taro.setStorageSync('token', res.accessToken);
        getLoginUserInfo();
        Taro.showModal({
          title: '登录成功',
          success: () => {
            Taro.switchTab({
              url: '/pages/index/index',
            });
          },
        });
      } else {
        console.error('登录返回数据格式不正确:', res);
        Taro.showToast({
          title: '登录数据格式错误',
          icon: 'none',
        });
      }
    } catch (error) {
      console.error('登录请求失败:', error);
      Taro.showToast({
        title: error?.message || '登录请求失败',
        icon: 'none',
      });
    }
  };
  
  const handleInputCode = e => {
    setForm({ ...form, code: e.detail.value })
    }
    const handleInputPhone = e => {
    setForm({ ...form, mobile: e.detail.value })
    }
  return (
    <View className="phone-login-container">
      <View className="header">
        <Text className="title">验证码登录</Text>
      </View>

      <View className="form">
        <View className="input-container">
          <Input
            className="input-field"
            type="text"
            placeholder="请输入手机号"
            value={form.mobile}
            onInput={e => handleInputPhone(e)}
          />
        </View>

        <View className="code-container">
          <Input
            className="input-field"
            type="text"
            placeholder="请输入验证码"
            value={form.code}
            onInput={e => handleInputCode(e)}
          />
          {!timer ? (
            <Text className="code-button" onClick={sendMobileCode} hidden={timer}>
              获取验证码
            </Text>
          ) : (
            <Text className="code-button disabled" hidden={!timer}>{count}秒后重发</Text>
          )}
        </View>

        <Button className="login-button" onClick={handleLoginClick}>
          登录
        </Button>

        <View className="other-login">
          <View className="divider">
            <Text className="divider-text">其他登录方式</Text>
          </View>
          <View className="login-options">
            <Text className="option-item">微信一键登录</Text>
          </View>
        </View>

        <View className="agreement">
          <Text className="agreement-text">
            登录/注册即视为同意《服务条款》和《隐私协议》
          </Text>
        </View>
      </View>
    </View>
  )
}

export default PhoneLogin
