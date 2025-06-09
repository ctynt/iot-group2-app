import { View, Text, Picker } from "@tarojs/components";
import { AtForm, AtInput, AtButton } from "taro-ui";
import Taro from "@tarojs/taro";
import { useState } from "react";
import { addDevice } from "../../../services/device";
import "./index.scss";

export default function Index() {
  const deviceTypes = [
    { label: "灯", value: 1 },
    { label: "温湿度传感器", value: 2 },
    { label: "蜂鸣器", value: 3 },
    { label: "红外传感器", value: 4 },
    { label: "光敏传感器", value: 5 },
    { label: "触摸传感器", value: 6 },
    { label: "风扇", value: 7 },
  ];

  const [deviceInfo, setDeviceInfo] = useState({
    deviceId: "",
    name: "",
    type: "",
  });

  const handleChange = (value, field) => {
    setDeviceInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
    return value;
  };

  const handleScanCode = async () => {
    try {
      const { result } = await Taro.scanCode({
        onlyFromCamera: true,
        scanType: ["qrCode"],
      });

      try {
        const qrData = JSON.parse(result);
        if (qrData.deviceId && qrData.name && qrData.type) {
          // 验证设备类型是否有效
          const isValidType = deviceTypes.some(
            (t) => t.value === Number(qrData.type),
          );
          if (!isValidType) {
            Taro.showToast({
              title: "无效的设备类型",
              icon: "none",
            });
            return;
          }

          setDeviceInfo({
            deviceId: qrData.deviceId,
            name: qrData.name,
            type: Number(qrData.type),
          });

          Taro.showToast({
            title: "扫描成功",
            icon: "success",
          });
        } else {
          Taro.showToast({
            title: "二维码格式错误",
            icon: "none",
          });
        }
      } catch (error) {
        Taro.showToast({
          title: "二维码格式错误",
          icon: "none",
        });
      }
    } catch (error) {
      if (error.errMsg.includes("cancel")) {
        return;
      }
      Taro.showToast({
        title: "扫描失败",
        icon: "none",
      });
    }
  };

  const handleSubmit = async () => {
    if (!deviceInfo.deviceId || !deviceInfo.name || !deviceInfo.type) {
      Taro.showToast({
        title: "请填写完整信息",
        icon: "none",
      });
      return;
    }

    try {
      const res = await addDevice(deviceInfo);
      // 如果代码执行到这里，说明请求成功
      Taro.showToast({
        title: "添加成功",
        icon: "success",
      });
      Taro.navigateBack();
    } catch (error) {
      // 捕获并处理异常
      Taro.showToast({
        title: error.message || "添加失败",
        icon: "error",
      });
    }
  };

  const isFormValid = deviceInfo.deviceId && deviceInfo.name && deviceInfo.type;

  return (
    <View className="add-device">
      <AtForm>
        <View className="form-header">
          <AtButton className="scan-button" onClick={handleScanCode}>
            扫描二维码
          </AtButton>
        </View>
        <AtInput
          name="deviceId"
          title="设备ID"
          type="text"
          placeholder="请输入设备ID"
          value={deviceInfo.deviceId}
          onChange={(value) => handleChange(value, "deviceId")}
        />
        <AtInput
          name="name"
          title="设备名称"
          type="text"
          placeholder="请输入设备名称"
          value={deviceInfo.name}
          onChange={(value) => handleChange(value, "name")}
        />
        <View className="device-type-picker picker">
          <Picker
            mode="selector"
            range={deviceTypes}
            rangeKey="label"
            onChange={(e) => {
              const selectedType = deviceTypes[e.detail.value].value;
              handleChange(selectedType, "type");
            }}
          >
            <View className="picker-view">
              <View className="picker-label">设备类型</View>
              <View className="picker-value">
                {deviceInfo.type
                  ? deviceTypes.find((t) => t.value === Number(deviceInfo.type))
                      ?.label || "请选择设备类型"
                  : "请选择设备类型"}
              </View>
            </View>
          </Picker>
        </View>
        <AtButton type="primary" disabled={!isFormValid} onClick={handleSubmit}>
          确认添加
        </AtButton>
      </AtForm>
    </View>
  );
}
