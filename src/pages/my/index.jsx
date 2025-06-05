import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtButton, AtCard, AtList, AtListItem } from 'taro-ui'
import { useAppSelector, useAppDispatch } from '@/store'
import { useEffect } from 'react'
import { getUserInfo } from '@/service/user'
import { setUserInfo, clearUserInfo } from '@/store/user'
import Nav from './components/Nav'
import './index.scss'

export default function My() {
  const dispatch = useAppDispatch()
  const userInfo = useAppSelector(state => state.user)

  useEffect(() => {
    if (Taro.getStorageSync('token')) {
      fetchUserInfo()
    }
  }, [])

  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo()
      if (res) {
        dispatch(setUserInfo(res))
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  const handleClickLogin = () => {
    Taro.navigateTo({
      url: '/pages/login/index',
    })
  }

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          // 清除token
          Taro.removeStorageSync('token')
          // 清除用户信息
          dispatch(clearUserInfo())
          // 跳转到登录页
          Taro.navigateTo({
            url: '/pages/login/index'
          })
        }
      }
    })
  }

  return (
    <>
      <Nav />
      <View className="my">
        {userInfo && userInfo.id > 0 ? (
          <View className="user-info">
            <AtCard title={userInfo.nickname || '未设置昵称'}>
              <Image src={userInfo.avatar || 'https://img.yzcdn.cn/vant/cat.jpeg'} className="avatar" />
              <AtList>
                <AtListItem title="用户名" extraText={userInfo.username} />
                <AtListItem title="手机号" extraText={userInfo.mobile || '未绑定'} />
                <AtListItem title="邮箱" extraText={userInfo.email || '未绑定'} />
              </AtList>
              <View className="logout-btn">
                <AtButton type="secondary" onClick={handleLogout}>退出登录</AtButton>
              </View>
            </AtCard>
          </View>
        ) : (
          <AtButton onClick={handleClickLogin} type="primary">
            前往登录
          </AtButton>
        )}
      </View>
    </>
  )
}
