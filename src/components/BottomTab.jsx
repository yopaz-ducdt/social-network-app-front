import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Thay bằng vector-icons nếu có (ví dụ: react-native-vector-icons/Ionicons)
const Icons = {
  Home: { active: '🏠', inactive: '🏡' },
  search: { active: '🔍', inactive: '🔍' },
  add: { active: '➕', inactive: '➕' },
  reels: { active: '🎬', inactive: '🎬' },
  profile: { active: '👤', inactive: '👤' },
};

const TAB_ITEMS = [
  { key: 'Home', label: 'Trang chủ' },
  { key: 'search', label: 'Tìm kiếm' },
  { key: 'add', label: 'Đăng bài' },
  { key: 'reels', label: 'Reels' },
  { key: 'profile', label: 'Cá nhân' },
];

/**
 * BottomTab component
 *
 * Props:
 * - activeTab (string): key của tab đang active, ví dụ "home"
 * - onTabPress (function): callback khi nhấn tab, nhận vào key (string)
 *
 * Cách dùng:
 * <BottomTab activeTab={activeTab} onTabPress={(key) => setActiveTab(key)} />
 */
export default function BottomTab() {
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState('Home');

  const handlePressTab = (key) => {
    navigation.navigate(key);
    setActiveTab(key);
  };

  return (
    <View className="flex-row border-t border-gray-100 bg-white px-2 pb-4 pt-2">
      {TAB_ITEMS.map(({ key, label }) => {
        const isActive = activeTab === key;
        const icon = isActive ? Icons[key].active : Icons[key].inactive;

        return (
          <TouchableOpacity
            key={key}
            className="flex-1 items-center gap-0.5 py-1"
            onPress={() => handlePressTab(key)}
            activeOpacity={0.7}>
            <Text style={{ fontSize: 22 }}>{icon}</Text>
            <Text
              className={`text-xs ${isActive ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
