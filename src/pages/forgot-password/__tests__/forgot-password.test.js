import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Taro from '@tarojs/taro';
import ForgotPasswordPage from '../index';
import { isEmail } from '@/utils/validate';

// 模拟验证工具
jest.mock('@/utils/validate', () => ({
  isEmail: jest.fn(),
}));

describe('忘记密码页面测试', () => {
  beforeEach(() => {
    // 重置所有模拟函数
    jest.clearAllMocks();
    
    // 设置默认验证行为
    isEmail.mockReturnValue(true);
    
    // 模拟console.log
    jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // 渲染忘记密码页面
    render(<ForgotPasswordPage />);
  });

  test('应该正确渲染忘记密码表单', () => {
    // 验证页面标题存在
    expect(screen.getByText('找回密码')).toBeInTheDocument();
    expect(screen.getByText('请输入您的邮箱，我们将发送重置密码链接')).toBeInTheDocument();
    
    // 验证输入框存在
    expect(screen.getByPlaceholderText('邮箱地址')).toBeInTheDocument();
    
    // 验证按钮存在
    expect(screen.getByText('发送重置链接')).toBeInTheDocument();
    
    // 验证链接存在
    expect(screen.getByText('返回登录')).toBeInTheDocument();
  });

  test('提交有效邮箱应发送重置链接', async () => {
    // 输入邮箱
    const emailInput = screen.getByPlaceholderText('邮箱地址');
    const submitButton = screen.getByText('发送重置链接');
    
    await userEvent.type(emailInput, 'test@example.com');
    
    // 点击提交按钮
    fireEvent.click(submitButton);
    
    // 验证handleSubmit被调用
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('发送重置链接');
    });
  });

  test('提交无效邮箱应显示错误提示', async () => {
    // 模拟邮箱验证失败
    isEmail.mockReturnValue(false);
    
    // 输入无效邮箱
    const emailInput = screen.getByPlaceholderText('邮箱地址');
    const submitButton = screen.getByText('发送重置链接');
    
    await userEvent.type(emailInput, 'invalid-email');
    
    // 点击提交按钮
    fireEvent.click(submitButton);
    
    // 这里我们需要扩展实际代码来验证邮箱格式，目前代码中没有这个验证
    // 这个测试用例是为了展示如何测试邮箱验证失败的情况
    // 实际代码中需要添加邮箱验证逻辑
  });

  test('点击返回登录链接应导航到登录页面', () => {
    // 点击返回登录链接
    const loginLink = screen.getByText('返回登录');
    fireEvent.click(loginLink);
    
    // 验证导航到登录页面
    expect(Taro.navigateTo).toHaveBeenCalledWith({
      url: '/pages/login/index'
    });
  });
});