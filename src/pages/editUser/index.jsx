import React, { useState, useEffect } from "react";
import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import {
  AtForm,
  AtInput,
  AtButton,
  AtImagePicker,
  AtMessage,
  AtSelector,
} from "taro-ui";
import { useAppSelector, useAppDispatch } from "@/store";
import { updateUser, getUserInfo, accountLogin } from "@/service/user";
import { uploadFile } from "@/service/file";
import { setUserInfo } from "@/store/user";

import "./index.scss";

const EditUser = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // 添加上传状态

  // 表单数据
  const [formData, setFormData] = useState({
    id: 0,
    username: "",
    nickname: "",
    avatar: "",
    mobile: "",
    email: "",
    gender: 0,
  });

  // 性别选项
  const genderOptions = [
    { label: "男", value: 1 },
    { label: "女", value: 2 },
    { label: "保密", value: 0 },
  ];

  // 头像文件列表
  const [files, setFiles] = useState([]);

  // 表单错误信息
  const [errors, setErrors] = useState({
    mobile: "",
    email: "",
  });

  // 初始化表单数据
  useEffect(() => {
    if (userInfo && userInfo.id > 0) {
      setFormData({
        id: userInfo.id,
        username: userInfo.username || "",
        nickname: userInfo.nickname || "",
        avatar: userInfo.avatar || "",
        mobile: userInfo.mobile || "",
        email: userInfo.email || "",
        gender: userInfo.gender || 0,
      });

      // 如果有头像，初始化头像预览
      if (userInfo.avatar) {
        setFiles([
          {
            url: userInfo.avatar,
          },
        ]);
      }
    } else {
      // 如果没有用户信息，获取最新用户信息
      fetchUserInfo();
    }
  }, [userInfo]);

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo();
      if (res) {
        dispatch(setUserInfo(res));
      }
    } catch (error) {
      console.error("获取用户信息失败:", error);
      Taro.showToast({
        title: "获取用户信息失败",
        icon: "none",
        duration: 2000,
      });
    }
  };

  // 处理输入变化
  const handleInputChange = (value, event) => {
    const { id } = event.target;
    setFormData({
      ...formData,
      [id]: value,
    });

    // 验证手机号和邮箱
    if (id === "mobile") {
      validateMobile(value);
    } else if (id === "email") {
      validateEmail(value);
    }

    return value;
  };

  // 验证手机号
  const validateMobile = (mobile) => {
    if (mobile && !/^1[3-9]\d{9}$/.test(mobile)) {
      setErrors((prev) => ({ ...prev, mobile: "请输入正确的手机号码" }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, mobile: "" }));
      return true;
    }
  };

  // 验证邮箱
  const validateEmail = (email) => {
    if (
      email &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      setErrors((prev) => ({ ...prev, email: "请输入正确的邮箱地址" }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
      return true;
    }
  };

  // 处理性别选择
  const handleGenderChange = (value) => {
    setFormData({
      ...formData,
      gender: value,
    });
  };

  // 处理头像选择和上传
  const handleAvatarChange = async (files) => {
    setFiles(files);

    // 如果选择了新头像，上传到服务器
    if (files.length > 0 && files[0].url) {
      try {
        setUploading(true); // 设置上传状态

        // 获取文件路径
        const filePath = files[0].url;

        // 直接使用文件路径上传
        const fileUrl = await uploadFile(filePath);

        // 更新表单数据中的头像URL
        setFormData({
          ...formData,
          avatar: fileUrl,
        });

        Taro.atMessage({
          message: "头像上传成功",
          type: "success",
        });
      } catch (error) {
        console.error("头像上传失败:", error);
        Taro.atMessage({
          message: error.message || "头像上传失败",
          type: "error",
        });

        // 上传失败时，恢复之前的头像
        if (userInfo.avatar) {
          setFiles([
            {
              url: userInfo.avatar,
            },
          ]);
        } else {
          setFiles([]);
        }
      } finally {
        setUploading(false); // 重置上传状态
      }
    } else {
      setFormData({
        ...formData,
        avatar: "",
      });
    }
  };

  // 处理头像上传失败
  const handleAvatarFail = (mes) => {
    console.log("头像上传失败", mes);
    Taro.atMessage({
      message: "头像上传失败",
      type: "error",
    });
  };

  // 提交表单
  const handleSubmit = async () => {
    // 表单验证
    if (!formData.nickname) {
      Taro.atMessage({
        message: "昵称不能为空",
        type: "error",
      });
      return;
    }

    // 验证手机号和邮箱
    const isMobileValid = !formData.mobile || validateMobile(formData.mobile);
    const isEmailValid = !formData.email || validateEmail(formData.email);

    if (!isMobileValid || !isEmailValid) {
      Taro.atMessage({
        message: "请检查表单填写是否正确",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      // 保存当前用户名，用于后续重新登录
      const currentUsername = formData.username;
      // 获取当前密码（需要用户输入）
      const password = await getPassword();

      if (!password) {
        setLoading(false);
        return; // 用户取消了密码输入
      }

      // 调用更新用户信息接口
      await updateUser(formData);

      Taro.atMessage({
        message: "更新成功",
        type: "success",
      });

      // 使用当前用户名和密码重新登录
      try {
        const loginRes = await accountLogin({
          username: currentUsername,
          password: password,
        });

        if (loginRes?.accessToken) {
          // 更新存储的token
          Taro.setStorageSync("token", loginRes.accessToken);
          // 更新Redux中的用户信息
          dispatch(setUserInfo(loginRes));

          // 重新获取完整的用户信息
          const userInfoRes = await getUserInfo();
          if (userInfoRes) {
            dispatch(setUserInfo(userInfoRes));
          }
        }
      } catch (loginError) {
        console.error("重新登录失败:", loginError);
        // 登录失败时仍然尝试获取最新用户信息
        try {
          const res = await getUserInfo();
          if (res) {
            dispatch(setUserInfo(res));
          }
        } catch (error) {
          console.error("获取用户信息失败:", error);
        }
      }
    } catch (error) {
      console.error("更新用户信息失败:", error);
      Taro.atMessage({
        message: error.message || "更新失败",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // 获取用户密码的函数
  const getPassword = () => {
    return new Promise((resolve) => {
      Taro.showModal({
        title: "请输入密码",
        content: "",
        editable: true,
        placeholderText: "请输入密码",
        success: function (res) {
          if (res.confirm && res.content) {
            resolve(res.content);
          } else {
            resolve(null); // 用户取消或未输入密码
          }
        },
        fail: function () {
          resolve(null);
        },
      });
    });
  };

  // 返回上一页
  const handleBack = () => {
    Taro.navigateBack();
  };

  // 获取当前选择的性别标签
  const getGenderLabel = () => {
    const option = genderOptions.find((item) => item.value === formData.gender);
    return option ? option.label : "请选择";
  };

  // 打开性别选择器
  const handleSelectGender = () => {
    Taro.showActionSheet({
      itemList: genderOptions.map((item) => item.label),
      success: function (res) {
        const selectedOption = genderOptions[res.tapIndex];
        handleGenderChange(selectedOption.value);
      },
      fail: function (res) {
        console.log(res.errMsg);
      },
    });
  };

  return (
    <View className="edit-user-container">
      <AtMessage />
      <View className="avatar-section">
        <Text className="section-title">头像</Text>
        <View className="avatar-upload">
          {files.length > 0 ? (
            <View
              className="avatar-preview"
              onClick={() => {
                if (uploading) return; // 如果正在上传，不允许再次选择

                Taro.chooseImage({
                  count: 1,
                  sizeType: ["compressed"],
                  sourceType: ["album", "camera"],
                  success: function (res) {
                    const tempFiles = res.tempFiles.map((file) => ({
                      url: file.path,
                    }));
                    handleAvatarChange(tempFiles);
                  },
                });
              }}
            >
              <Image
                className="avatar-image"
                src={files[0].url}
                mode="aspectFill"
              />
              <View className="avatar-overlay">
                <Text className="avatar-text">
                  {uploading ? "上传中..." : "点击更换"}
                </Text>
              </View>
            </View>
          ) : (
            <View
              className="avatar-placeholder"
              onClick={() => {
                if (uploading) return; // 如果正在上传，不允许选择

                Taro.chooseImage({
                  count: 1,
                  sizeType: ["compressed"],
                  sourceType: ["album", "camera"],
                  success: function (res) {
                    const tempFiles = res.tempFiles.map((file) => ({
                      url: file.path,
                    }));
                    handleAvatarChange(tempFiles);
                  },
                });
              }}
            >
              <Text className="avatar-text">
                {uploading ? "上传中..." : "点击上传头像"}
              </Text>
            </View>
          )}
        </View>
      </View>

      <AtForm>
        <View className="form-section">
          <Text className="section-title">基本信息</Text>

          <AtInput
            name="username"
            title="用户名"
            type="text"
            placeholder="请输入用户名"
            value={formData.username}
            onChange={(value) =>
              handleInputChange(value, { target: { id: "username" } })
            }
            disabled
          />

          <AtInput
            name="nickname"
            title="昵称"
            type="text"
            placeholder="请输入昵称"
            value={formData.nickname}
            onChange={(value) =>
              handleInputChange(value, { target: { id: "nickname" } })
            }
            required
          />

          <View className="gender-selector" onClick={handleSelectGender}>
            <Text className="gender-label">性别</Text>
            <View className="gender-value">
              <Text>{getGenderLabel()}</Text>
              <Text className="gender-arrow">›</Text>
            </View>
          </View>
        </View>

        <View className="form-section">
          <Text className="section-title">联系方式</Text>

          <AtInput
            name="mobile"
            title="手机号"
            type="phone"
            placeholder="请输入手机号"
            value={formData.mobile}
            onChange={(value) =>
              handleInputChange(value, { target: { id: "mobile" } })
            }
            error={!!errors.mobile}
          />
          {errors.mobile && (
            <Text className="error-message">{errors.mobile}</Text>
          )}

          <AtInput
            name="email"
            title="邮箱"
            type="email"
            placeholder="请输入邮箱"
            value={formData.email}
            onChange={(value) =>
              handleInputChange(value, { target: { id: "email" } })
            }
            error={!!errors.email}
          />
          {errors.email && (
            <Text className="error-message">{errors.email}</Text>
          )}
        </View>

        <View className="button-group">
          <AtButton type="secondary" onClick={handleBack}>
            取消
          </AtButton>
          <AtButton
            type="primary"
            onClick={handleSubmit}
            loading={loading || uploading}
          >
            保存
          </AtButton>
        </View>
      </AtForm>
    </View>
  );
};

export default EditUser;
