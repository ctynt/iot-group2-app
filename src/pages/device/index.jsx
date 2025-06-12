import { View, Text, Picker } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { useState, useEffect } from "react";
import { AtButton, AtForm, AtInput } from "taro-ui";
import "./index.scss";
import { getDeviceDetail, editDevice } from "../../services/device";

export default function Index() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [device, setDevice] = useState({
    id: 0,
    deviceId: "",
    name: "",
    type: 0,
    status: 0,
    isSwitched: null,
    temperature: null,
    humidity: null,
    createTime: "",
  });

  const [editForm, setEditForm] = useState({
    id: 0,
    deviceId: "",
    name: "",
    type: 0,
  });

  useEffect(() => {
    const { deviceId } = router.params;
    if (deviceId) {
      getDeviceDetail(deviceId).then((res) => {
        // 修改前: if (res.code === 0 && res.data)
        // 修改后: 直接使用返回的数据
        if (res) {
          setDevice(res);
          setEditForm({
            id: res.id,
            deviceId: res.deviceId,
            name: res.name,
            type: res.type,
          });
        } else {
          console.error("获取设备详情失败:", res);
          Taro.showToast({
            title: "获取设备详情失败",
            icon: "error",
          });
        }
      });
    }
  }, []);

  const getDeviceType = (type) => {
    switch (type) {
      case 1:
        return "灯";
      case 2:
        return "温湿度传感器";
      case 3:
        return "蜂鸣器";
      case 4:
        return "红外传感器";
      case 5:
        return "光敏传感器";
      case 6:
        return "触摸传感器";
      case 7:
        return "风扇";
      default:
        return "未知设备";
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      id: device.id,
      deviceId: device.deviceId,
      name: device.name,
      type: device.type,
    });
  };

  const handleSave = async () => {
    try {
      await editDevice(editForm);
      Taro.showToast({
        title: "修改成功",
        icon: "success",
      });
      setIsEditing(false);
      // 刷新设备信息
      const detailRes = await getDeviceDetail(device.deviceId);
      if (detailRes) {
        setDevice(detailRes);
      }
    } catch (error) {
      // 添加错误处理，显示错误提示
      Taro.showToast({
        title: error.message || "修改失败",
        icon: "error",
      });
    }
  };

  const handleChange = (value, field) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    return value;
  };

  const deviceTypes = [
    { label: "灯", value: 1 },
    { label: "温湿度传感器", value: 2 },
    { label: "蜂鸣器", value: 3 },
    { label: "红外传感器", value: 4 },
    { label: "光敏传感器", value: 5 },
    { label: "触摸传感器", value: 6 },
    { label: "风扇", value: 7 },
  ];

  return (
    <View className='device-detail'>
      {isEditing ? (
        <AtForm>
          <AtInput
            name='deviceId'
            title='设备ID'
            type='text'
            value={editForm.deviceId}
            onChange={(value) => setEditForm({ ...editForm, deviceId: value })}
          />
          <AtInput
            name='name'
            title='设备名称'
            type='text'
            value={editForm.name}
            onChange={(value) => setEditForm({ ...editForm, name: value })}
          />
          <View className='device-type-picker picker'>
            <Picker
              mode='selector'
              range={deviceTypes}
              rangeKey='label'
              onChange={(e) => {
                const selectedType = deviceTypes[e.detail.value].value;
                setEditForm({ ...editForm, type: selectedType });
              }}
            >
              <View className='picker-view'>
                <View className='picker-label'>设备类型</View>
                <View className='picker-value'>
                  {deviceTypes.find((t) => t.value === editForm.type)?.label ||
                    "请选择设备类型"}
                </View>
              </View>
            </Picker>
          </View>
          <View className='button-group'>
            <AtButton onClick={handleCancel}>取消</AtButton>
            <AtButton type='primary' onClick={handleSave}>
              保存
            </AtButton>
          </View>
        </AtForm>
      ) : (
        <View className='device-card'>
          {!isEditing ? (
            // 查看模式
            <>
              {device.type === 1 && (
                <View className='show-card'>
                  <image src='https://unpkg.com/lucide-static@latest/icons/lightbulb.svg' />
                  <h2>已开启</h2>
                </View>
              )}

              <View className='card-header'>
                <Text className='device-name'>{device.name}</Text>
                <Text
                  className={`device-status ${
                    device.status === 1 ? "online" : "offline"
                  }`}
                >
                  {device.status === 1 ? "在线" : "离线"}
                </Text>
              </View>

              <View className='card-content'>
                <h2>设备信息</h2>
                <View className='info-item'>
                  <Text className='label'>设备ID</Text>
                  <Text className='value'>{device.deviceId}</Text>
                </View>

                <View className='info-item'>
                  <Text className='label'>设备类型</Text>
                  <Text className='value'>{getDeviceType(device.type)}</Text>
                </View>

                <View className='info-item'>
                  <Text className='label'>开关状态</Text>
                  <Text className='value'>
                    {device.isSwitched === 0 ? "开" : "关"}
                  </Text>
                </View>

                {device.type === 2 && (
                  <>
                    <View className='info-item'>
                      <Text className='label'>温度</Text>
                      <Text className='value'>{device.temperature}°C</Text>
                    </View>

                    <View className='info-item'>
                      <Text className='label'>湿度</Text>
                      <Text className='value'>{device.humidity}%</Text>
                    </View>
                  </>
                )}
              </View>

              {/* <View className="card-footer">
                <AtButton type="primary" onClick={handleEdit}>
                  修改设备
                </AtButton>
              </View> */}
            </>
          ) : (
            // 编辑模式
            <AtForm>
              <AtInput
                name='deviceId'
                title='设备ID'
                type='text'
                placeholder='请输入设备ID'
                value={editForm.deviceId}
                onChange={(value) => handleChange(value, "deviceId")}
              />
              <AtInput
                name='name'
                title='设备名称'
                type='text'
                placeholder='请输入设备名称'
                value={editForm.name}
                onChange={(value) => handleChange(value, "name")}
              />
              <View className='form-buttons'>
                <AtButton type='secondary' onClick={handleCancel}>
                  取消
                </AtButton>
                <AtButton type='primary' onClick={handleSave}>
                  保存
                </AtButton>
              </View>
            </AtForm>
          )}
        </View>
      )}
    </View>
  );
}
