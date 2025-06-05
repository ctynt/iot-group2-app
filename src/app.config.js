export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/login/index",
    "pages/register/index",
    "pages/forgot-password/index",
    "pages/my/index",
    "pages/editUser/index",
    "pages/scene/index",
    "pages/device/index",
    "pages/scene/add/index",
    "pages/scene/detail/index",
    "pages/device/add/index", 
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#4594D5",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "white",
  },
  tabBar: {
    color: "#999",
    selectedColor: "#4594D5",
    backgroundColor: "#fff",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "./assets/tabs/home.png",
        selectedIconPath: "./assets/tabs/home-active.png",
      },
      {
        pagePath: "pages/scene/index",
        text: "场景",
        iconPath: "./assets/tabs/scene.png",
        selectedIconPath: "./assets/tabs/scene-active.png",
      },
      {
        pagePath: "pages/my/index",
        text: "我的",
        iconPath: "./assets/tabs/my.png",
        selectedIconPath: "./assets/tabs/my-active.png",
      },
    ],
  },
});
