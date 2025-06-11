import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Taro from '@tarojs/taro';
import RegisterPage from '../index';
import { register } from '@/service/user';
import { isEmail, isMobile, isValidPassword } from '@/utils/validate';

// 模拟用户服务
jest.mock('@/service/user', () => ({
  register: jest.fn(),
}));

// 模拟验证工具
jest.mock('@/utils/validate', () => ({
  isEmail: jest.fn(),
  isMobile: jest.fn(),
  isValidPassword: jest.fn(),
}));

describe('注册页面测试', () => {
  beforeEach(() => {
    // 重置所有模拟函数
    jest.clearAllMocks();
    
    // 设置默认验证行为
    isEmail.mockReturnValue(true);
    isMobile.mockReturnValue(true);
    isValidPassword.mockReturnValue(true);
    
    // 渲染注册页面
    render(<RegisterPage />);
  });

  test('应该正确渲染注册表单', () => {
    // 验证页面标题存在
    expect(screen.getByText('创建账户')).toBeInTheDocument();
    expect(screen.getByText('加入我们，体验智能生活')).toBeInTheDocument();
    
    // 验证输入框存在
    expect(screen.getByPlaceholderText('用户名')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('邮箱')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('手机号')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('密码')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('确认密码')).toBeInTheDocument();
    
    // 验证按钮存在
    expect(screen.getByText('注册')).toBeInTheDocument();
    
    // 验证链接存在
    expect(screen.getByText('登录')).toBeInTheDocument();
  });

  test('密码不一致时应显示错误提示', async () => {
    // 输入表单数据
    const usernameInput = screen.getByPlaceholderText('用户名');
    const emailInput = screen.getByPlaceholderText('邮箱');
    const mobileInput = screen.getByPlaceholderText('手机号');
    const passwordInput = screen.getByPlaceholderText('密码');
    const confirmPasswordInput = screen.getByPlaceholderText('确认密码');
    const registerButton = screen.getByText('注册');
    
    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(mobileInput, '13800138000');
    await userEvent.type(passwordInput, 'Password123');
    await userEvent.type(confirmPasswordInput, 'DifferentPassword123');
    
    // 点击注册按钮
    fireEvent.click(registerButton);
    
    // 验证错误提示被显示
    await waitFor(() => {
      expect(Taro.showToast).toHaveBeenCalledWith({
        title: '两次输入的密码不一致',
        icon: 'none'
      });
    });
    
    // 验证注册函数未被调用
    expect(register).not.toHaveBeenCalled();
  });

  test('使用有效信息应成功注册', async () => {
    // 模拟注册成功
    register.mockResolvedValueOnce({});
    
    // 输入表单数据
    const usernameInput = screen.getByPlaceholderText('用户名');
    const emailInput = screen.getByPlaceholderText('邮箱');
    const mobileInput = screen.getByPlaceholderText('手机号');
    const passwordInput = screen.getByPlaceholderText('密码');
    const confirmPasswordInput = screen.getByPlaceholderText('确认密码');
    const registerButton = screen.getByText('注册');
    
    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(mobileInput, '13800138000');
    await userEvent.type(passwordInput, 'Password123');
    await userEvent.type(confirmPasswordInput, 'Password123');
    
    // 点击注册按钮
    fireEvent.click(registerButton);
    
    // 验证注册函数被调用
    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        mobile: '13800138000',
        password: 'Password123'
      });
    });
    
    // 验证成功提示被显示
    await waitFor(() => {
      expect(Taro.showToast).toHaveBeenCalledWith({
        title: '注册成功',
        icon: 'success'
      });
    });
    
    // 验证导航到登录页面
    jest.advanceTimersByTime(1500);
    await waitFor(() => {
      expect(Taro.navigateTo).toHaveBeenCalledWith({
        url: '/pages/login/index'
      });
    });
  });

  test('注册失败时应显示错误信息', async () => {
    // 模拟注册失败
    register.mockRejectedValueOnce(new Error('用户名已存在'));
    
    // 输入表单数据
    const usernameInput = screen.getByPlaceholderText('用户名');
    const emailInput = screen.getByPlaceholderText('邮箱');
    const mobileInput = screen.getByPlaceholderText('手机号');
    const passwordInput = screen.getByPlaceholderText('密码');
    const confirmPasswordInput = screen.getByPlaceholderText('确认密码');
    const registerButton = screen.getByText('注册');
    
    await userEvent.type(usernameInput, 'existinguser');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(mobileInput, '13800138000');
    await userEvent.type(passwordInput, 'Password123');
    await userEvent.type(confirmPasswordInput, 'Password123');
    
    // 点击注册按钮
    fireEvent.click(registerButton);
    
    // 验证注册函数被调用
    await waitFor(() => {
      expect(register).toHaveBeenCalled();
    });
    
    // 验证错误提示被显示
    await waitFor(() => {
      expect(Taro.showToast).toHaveBeenCalledWith({
        title: '用户名已存在',
        icon: 'none'
      });
    });
  });

  test('点击登录链接应导航到登录页面', () => {
    // 点击登录链接
    const loginLink = screen.getByText('登录');
    fireEvent.click(loginLink);
    
    // 验证导航到登录页面
    expect(Taro.navigateTo).toHaveBeenCalledWith({
      url: '/pages/login/index'
    });
  });
});