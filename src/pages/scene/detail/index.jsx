import { View, Text } from "@tarojs/components";
import { AtButton, AtInput, AtTextarea, AtForm } from "taro-ui";
import Taro, { useDidShow } from "@tarojs/taro";
import { useState, useEffect } from "react";
import {
  getSceneDetail,
  deleteScene,
  editScene,
} from "../../../services/scene";
import { getDeviceList } from "../../../services/device";
import { useAppSelector } from "@/store";
import SmartLighting from "../../../components/SmartLighting";
import "./index.scss";

export default function SceneDetail() {
  const [scene, setScene] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [devices, setDevices] = useState([]);

  // 编辑表单数据
  const [editForm, setEditForm] = useState({
    id: 0,
    name: "",
    description: "",
    type: "",
    deviceIds: [],
  });

  // 从Redux获取用户ID
  const userInfo = useAppSelector((state) => state.user);
  const userId = userInfo.id;

  const sceneId = Taro.getCurrentInstance().router.params.id;

  // 场景类型定义
  const sceneTypes = [
    { id: "1", name: "环境检测", icon: "environment" },
    { id: "2", name: "智能安防", icon: "shield" },
    { id: "3", name: "智能照明", icon: "bulb" },
    { id: "4", name: "智能节能风扇", icon: "fan" },
  ];

  useEffect(() => {
    if (sceneId) {
      fetchSceneDetail();
      fetchDevices();
    } else {
      setError("场景ID不存在");
      setLoading(false);
    }
  }, []);

  // 添加useDidShow钩子，每次页面显示时重新获取场景详情
  useDidShow(() => {
    if (sceneId) {
      // 先清空当前场景数据，强制UI刷新
      setScene(null);
      setLoading(true);
      // 短暂延迟后重新获取数据
      setTimeout(() => {
        fetchSceneDetail();
      }, 100);
    }
  });

  const fetchSceneDetail = async () => {
    try {
      setLoading(true);
      const response = await getSceneDetail(sceneId);
      console.log("场景详情响应:", response);

      // 直接检查response是否为场景对象（包含id、name等字段）
      if (response && response.id) {
        setScene(response);
        // 同时更新编辑表单数据
        setEditForm({
          id: response.id,
          name: response.name || "",
          description: response.description || "",
          type: response.type || "",
          deviceIds: response.devices
            ? response.devices.map((device) => device.deviceId || device.id)
            : [],
        });
        setError(null);
      } else {
        console.error("API返回错误:", response);
        setError(`获取场景详情失败: ${response?.msg || "未知错误"}`);
      }
    } catch (err) {
      console.error("获取场景详情出错:", err);
      setError(`获取场景详情出错: ${err.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // 获取设备列表
  const fetchDevices = async () => {
    try {
      const result = await getDeviceList({
        page: 1,
        limit: 100,
      });

      if (result && result.list) {
        console.log("设备列表:", result.list);
        setDevices(result.list);
      }
    } catch (error) {
      console.error("获取设备列表失败:", error);
      Taro.showToast({
        title: "获取设备列表失败",
        icon: "none",
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // 重置编辑表单数据
    if (scene) {
      setEditForm({
        id: scene.id,
        name: scene.name || "",
        description: scene.description || "",
        type: scene.type || "",
        deviceIds: scene.devices
          ? scene.devices.map((device) => device.deviceId || device.id)
          : [],
      });
    }
  };

  const handleSave = async () => {
    // 表单验证
    if (!editForm.name) {
      Taro.showToast({
        title: "请输入场景名称",
        icon: "none",
      });
      return;
    }

    if (!editForm.type) {
      Taro.showToast({
        title: "请选择场景类型",
        icon: "none",
      });
      return;
    }

    if (editForm.deviceIds.length === 0) {
      Taro.showToast({
        title: "请至少选择一个设备",
        icon: "none",
      });
      return;
    }

    try {
      setSubmitting(true);

      // 准备提交的数据
      const sceneData = {
        id: sceneId,
        userId: userId,
        name: editForm.name,
        description: editForm.description,
        type: editForm.type,
        deviceIds: editForm.deviceIds,
        tenantId: 0, // 根据实际情况设置
      };

      console.log("提交修改场景数据:", sceneData);

      // 调用修改场景接口
      await editScene(sceneData);

      Taro.showToast({
        title: "修改场景成功",
        icon: "success",
      });

      setIsEditing(false);
      // 刷新场景信息
      fetchSceneDetail();
    } catch (error) {
      console.error("修改场景失败:", error);
      Taro.showToast({
        title: "修改场景失败: " + (error.message || "未知错误"),
        icon: "none",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    Taro.showModal({
      title: "确认删除",
      content: "确定要删除该场景吗？",
      success: async function (res) {
        if (res.confirm) {
          try {
            const response = await deleteScene(sceneId);
            console.log("删除场景响应:", response);

            // 增加对 null 响应的处理
            if (
              response === null ||
              (response &&
                (response.code === 0 || response.id || response === "success"))
            ) {
              Taro.showToast({
                title: "删除成功",
                icon: "success",
                duration: 2000,
              });
              setTimeout(() => {
                Taro.navigateBack();
              }, 1500);
            } else {
              Taro.showToast({
                title: `删除失败: ${response?.msg || "未知错误"}`,
                icon: "error",
                duration: 2000,
              });
            }
          } catch (err) {
            console.error("删除场景出错:", err);
            Taro.showToast({
              title: `删除失败: ${err.message || String(err)}`,
              icon: "error",
              duration: 2000,
            });
          }
        }
      },
    });
  };

  if (loading) {
    return (
      <View className="scene-detail loading-container">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (error || !scene) {
    return (
      <View className="scene-detail error-container">
        <Text>{error || "未找到场景信息"}</Text>
        <AtButton onClick={() => Taro.navigateBack()}>返回</AtButton>
      </View>
    );
  }

  // 如果是智能照明场景，显示SmartLighting组件
  if (scene.type === "3" && !isEditing) {
    // 获取场景关联的设备ID列表
    const deviceIds =
      scene.devices && Array.isArray(scene.devices)
        ? scene.devices.map((device) => device.deviceId || device.id)
        : [];

    // 传递第一个设备ID（如果存在）给SmartLighting组件
    const primaryDeviceId = deviceIds.length > 0 ? deviceIds[0] : "";

    return (
      <SmartLighting
        sceneId={sceneId}
        sceneName={scene.name}
        deviceId={primaryDeviceId}
      />
    );
  }

  return (
    <View className="scene-detail">
      {isEditing ? (
        // 编辑模式
        <View className="edit-form">
          <AtForm>
            <View className="form-card">
              <View className="input-group">
                <Text className="label">场景名称</Text>
                <AtInput
                  className="input"
                  type="text"
                  placeholder="给场景起个名字"
                  value={editForm.name}
                  onChange={(value) =>
                    setEditForm({ ...editForm, name: value })
                  }
                />
              </View>

              <View className="input-group">
                <Text className="label">场景类型</Text>
                <View className="type-grid">
                  {sceneTypes.map((type) => (
                    <View
                      key={type.id}
                      className={`type-item ${editForm.type === type.id ? "selected" : ""}`}
                      onClick={() =>
                        setEditForm({ ...editForm, type: type.id })
                      }
                    >
                      <Text className={`at-icon at-icon-${type.icon}`} />
                      <Text className="type-name">{type.name}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className="input-group">
                <Text className="label">选择设备</Text>
                {devices.length > 0 ? (
                  <View className="device-list">
                    {devices.map((device) => (
                      <View
                        key={device.deviceId || device.id}
                        className={`device-item ${editForm.deviceIds.includes(device.deviceId || device.id) ? "selected" : ""}`}
                        onClick={() => {
                          const deviceIdentifier = device.deviceId || device.id;
                          const newSelected = editForm.deviceIds.includes(
                            deviceIdentifier,
                          )
                            ? editForm.deviceIds.filter(
                                (id) => id !== deviceIdentifier,
                              )
                            : [...editForm.deviceIds, deviceIdentifier];
                          setEditForm({ ...editForm, deviceIds: newSelected });
                        }}
                      >
                        <Text className="device-name">{device.name}</Text>
                        <Text
                          className={`status ${device.status === 1 ? "online" : "offline"}`}
                        >
                          {device.status === 1 ? "在线" : "离线"}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View className="empty-devices">暂无可用设备</View>
                )}
              </View>

              <View className="input-group">
                <Text className="label">场景描述</Text>
                <AtTextarea
                  className="textarea"
                  value={editForm.description}
                  onChange={(value) =>
                    setEditForm({ ...editForm, description: value })
                  }
                  maxLength={200}
                  placeholder="描述一下这个场景的用途"
                />
              </View>
            </View>

            <View className="button-group">
              <AtButton onClick={handleCancel}>取消</AtButton>
              <AtButton
                type="primary"
                onClick={handleSave}
                loading={submitting}
              >
                保存
              </AtButton>
            </View>
          </AtForm>
        </View>
      ) : (
        // 查看模式
        <>
          <View className="header">
            <Text className="title">{scene.name || "未命名场景"}</Text>
            <Text className="description">{scene.description || "无描述"}</Text>
          </View>

          <View className="section">
            <Text className="section-title">关联设备</Text>
            <View className="device-list">
              {scene.devices &&
              Array.isArray(scene.devices) &&
              scene.devices.length > 0 ? (
                scene.devices.map((device, index) => (
                  <View key={device.deviceId || index} className="device-item">
                    <View className="device-info">
                      <Text className="device-name">
                        {device.name || device.deviceName || "未命名设备"}
                      </Text>
                      <View
                        className={`device-status ${device.status === 1 || device.deviceStatus === 1 ? "online" : "offline"}`}
                      >
                        <Text>
                          {device.status === 1 || device.deviceStatus === 1
                            ? "在线"
                            : "离线"}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View className="empty-devices">
                  <Text>暂无关联设备</Text>
                </View>
              )}
            </View>
          </View>

          <View className="actions">
            <AtButton type="primary" onClick={handleEdit}>
              编辑场景
            </AtButton>
            <AtButton type="secondary" onClick={handleDelete}>
              删除场景
            </AtButton>
          </View>
        </>
      )}
    </View>
  );
}
