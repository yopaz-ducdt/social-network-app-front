import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';

const SettingItem = ({ item, isLast }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(item.screen)}
      activeOpacity={0.7}
      className={`flex-row items-center bg-white px-4 py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}>
      <Text style={{ fontSize: 18, width: 28 }}>{item.icon}</Text>
      <Text className="flex-1 text-sm text-gray-900">{item.label}</Text>
      <Text className="text-sm text-gray-400">›</Text>
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { logout, user } = useAuth();
  const settings = user?.isAdmin
    ? [
        {
          id: 'password',
          icon: '🔒',
          label: 'Đổi mật khẩu',
          screen: 'ChangePassword',
        },
      ]
    : [
        {
          id: 'profile',
          icon: '👤',
          label: 'Thông tin cá nhân',
          screen: 'EditProfile',
        },
        {
          id: 'password',
          icon: '🔒',
          label: 'Đổi mật khẩu',
          screen: 'ChangePassword',
        },
      ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center border-b border-gray-100 bg-white px-4 py-3">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 p-1">
          <Text style={{ fontSize: 28, lineHeight: 30, color: '#111' }}>‹</Text>
        </TouchableOpacity>
        <Text className="flex-1 text-center text-base font-bold text-gray-900">Cài đặt</Text>
        <View className="w-8" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="mb-5 pt-4">
          <Text className="px-4 pb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            QUẢN LÝ TÀI KHOẢN
          </Text>
          <View className="mx-4 overflow-hidden rounded-xl border border-gray-100">
            {settings.map((item, index) => (
              <SettingItem key={item.id} item={item} isLast={index === settings.length - 1} />
            ))}
          </View>
        </View>

        <View className="mt-2 px-4">
          <TouchableOpacity
            onPress={logout}
            activeOpacity={0.8}
            className="flex-row items-center justify-center rounded-xl border border-red-400 py-4">
            <Text className="mr-2 text-red-500">↪</Text>
            <Text className="text-sm font-bold uppercase tracking-widest text-red-500">
              Đăng Xuất
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
