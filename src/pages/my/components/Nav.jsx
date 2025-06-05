import { useAppSelector } from '@/store'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './nav.scss'

const Nav = () => {
  const userInfo = useAppSelector(state => state.user.userInfo)
  const { safeArea = { top: 0 } } = Taro.getWindowInfo()

  const handleClick = () => {
    if (userInfo.id > 0) {
      Taro.navigateTo({ url: '/pageUser/userInfo/index' })
    }
    return
  }

  return (
    <View className="navbar" style={{ paddingTop: (safeArea.top + 10) + 'px' }}>
      <View className="text" onClick={handleClick}>
        <Text className="logo-text">个人中心</Text>
      </View>
    </View>
  )
}

export default Nav
