import Taro from "@tarojs/taro";

// 模拟设备数据
const mockDevices = [
  {
    id: "1",
    name: "客厅灯",
    type: 1,
    switch: 1,
    status: 1,
  },
  {
    id: "2",
    name: "卧室温湿度传感器",
    type: 2,
    switch: 1,
    status: 1,
    temperature: 25,
    humidity: 60,
  },
  {
    id: "3",
    name: "门铃",
    type: 3,
    switch: 0,
    status: 1,
  },
  {
    id: "4",
    name: "走廊红外传感器",
    type: 4,
    switch: 1,
    status: 0,
  },
];

// 获取设备详情
export const getDeviceDetail = (deviceId) => {
  return new Promise((resolve) => {
    // 模拟API请求延迟
    setTimeout(() => {
      const device = mockDevices.find((item) => item.id === deviceId);
      resolve(device || null);
    }, 500);
  });
};
