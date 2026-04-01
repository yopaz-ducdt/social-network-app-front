import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTab from '../components/BottomTab';

// ─── Fake Data ───────────────────────────────────────────────
const NOTIFICATIONS = [
  {
    id: '1',
    type: 'follow',
    avatar: null,
    title: 'Nguyễn Văn A đã bắt đầu theo dõi bạn.',
    time: '2 phút trước',
    action: 'follow', // hiện nút "Theo dõi lại"
    isFollowing: false,
  },
  {
    id: '2',
    type: 'security',
    avatar: 'security',
    title: 'Cảnh báo bảo mật',
    subtitle: 'Phát hiện đăng nhập mới trên thiết bị lạ.',
    time: '15 phút trước',
    action: 'more',
    unread: true,
  },
  {
    id: '3',
    type: 'like',
    avatar: null,
    title: 'Trần Thị B đã thích bài viết của bạn.',
    time: '1 giờ trước',
    action: 'thumbnail',
  },
  {
    id: '4',
    type: 'comment',
    avatar: null,
    title: 'Le Van C đã bình luận: "Bài viết rất hữu ích!"',
    time: '3 giờ trước',
    action: 'thumbnail',
  },
  {
    id: '5',
    type: 'mention',
    avatar: null,
    title: 'Hoàng D đã nhắc đến bạn trong một bình luận.',
    time: 'Hôm qua',
    action: 'more',
  },
];

// ─── Icons ───────────────────────────────────────────────────
const IconUser = () => <Text style={{ fontSize: 20 }}>👤</Text>;
const IconShield = () => <Text style={{ fontSize: 18 }}>🛡️</Text>;
const IconHeart = () => <Text style={{ fontSize: 14, color: '#ef4444' }}>♥</Text>;
const IconComment = () => <Text style={{ fontSize: 14, color: '#6b7280' }}>💬</Text>;
const IconMention = () => <Text style={{ fontSize: 14, color: '#6b7280' }}>@</Text>;
const IconMore = () => <Text style={{ fontWeight: 500, color: '#9ca3af' }}>•••</Text>;

// Badge icon tuỳ type
const TypeBadge = ({ type }) => {
  const map = {
    like: { bg: 'bg-red-100', icon: <IconHeart /> },
    comment: { bg: 'bg-gray-100', icon: <IconComment /> },
    mention: { bg: 'bg-blue-100', icon: <IconMention /> },
  };
  const config = map[type];
  if (!config) return null;
  return (
    <View
      className={`absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full ${config.bg} items-center justify-center border border-white`}>
      {config.icon}
    </View>
  );
};

// ─── Avatar ──────────────────────────────────────────────────
const Avatar = ({ type }) => {
  if (type === 'security') {
    return (
      <View className="h-11 w-11 items-center justify-center rounded-full bg-gray-900">
        <IconShield />
      </View>
    );
  }
  return (
    <View className="relative">
      <View className="h-11 w-11 items-center justify-center rounded-full bg-gray-200">
        <IconUser />
      </View>
      <TypeBadge type={type} />
    </View>
  );
};

// ─── Follow Button ────────────────────────────────────────────
const FollowButton = ({ isFollowing, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`rounded-lg border px-4 py-1.5 ${
        isFollowing ? 'border-gray-300 bg-white' : 'border-gray-900 bg-white'
      }`}>
      <Text className={`text-sm font-semibold ${isFollowing ? 'text-gray-500' : 'text-gray-900'}`}>
        {isFollowing ? 'Đã theo dõi' : 'Theo dõi lại'}
      </Text>
    </TouchableOpacity>
  );
};

// ─── Thumbnail placeholder ────────────────────────────────────
const Thumbnail = () => (
  <View className="h-11 w-11 items-center justify-center rounded-md border border-gray-200 bg-gray-100">
    <Text style={{ fontSize: 18 }}>🖼️</Text>
  </View>
);

// ─── Notification Item ────────────────────────────────────────
const NotifItem = ({ item }) => {
  const [isFollowing, setIsFollowing] = useState(item.isFollowing || false);

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      className={`flex-row items-center px-4 py-3 ${item.unread ? 'bg-gray-50' : 'bg-white'}`}>
      {/* Avatar */}
      <View className="mr-3">
        <Avatar type={item.type} />
      </View>

      {/* Content */}
      <View className="mr-2 flex-1">
        <Text className="text-sm leading-5 text-gray-900" numberOfLines={2}>
          {item.title}
        </Text>
        {item.subtitle && (
          <Text className="mt-0.5 text-sm text-gray-500" numberOfLines={1}>
            {item.subtitle}
          </Text>
        )}
        <Text className="mt-1 text-xs text-gray-400">{item.time}</Text>
      </View>

      {/* Right action */}
      {item.action === 'follow' && (
        <FollowButton isFollowing={isFollowing} onPress={() => setIsFollowing(!isFollowing)} />
      )}
      {item.action === 'thumbnail' && <Thumbnail />}
      {item.action === 'more' && (
        <TouchableOpacity className="p-1">
          <IconMore />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────
export default function NotificationScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS.map((item, index) => (
          <View key={item.id}>
            <NotifItem item={item} />
            {/* Divider */}
            {index < NOTIFICATIONS.length - 1 && <View className="mx-4 h-px bg-gray-100" />}
          </View>
        ))}
      </ScrollView>

      {/* Bottom Tab */}
      <BottomTab />
    </SafeAreaView>
  );
}
