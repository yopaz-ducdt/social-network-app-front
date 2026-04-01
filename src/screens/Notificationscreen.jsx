import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTab from '../components/BottomTab';
import { userService } from '@/services/userService';

const formatNotificationTime = (value) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const now = new Date();
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const detectType = (content = '') => {
  if (content.includes('follow')) return 'follow';
  if (content.includes('liked')) return 'like';
  if (content.includes('commented')) return 'comment';
  return 'system';
};

const normalizeNotification = (raw) => {
  const content = raw?.content ?? '';
  const createdAt = raw?.createdAt ?? '';
  return {
    id: String(raw?.id ?? Math.random()),
    senderId: raw?.targetId ? String(raw.targetId) : null,
    senderName: raw?.sender ?? 'Hệ thống',
    title: raw?.sender ? `${raw.sender} ${content}` : content || 'Thông báo hệ thống',
    createdAt,
    time: formatNotificationTime(createdAt),
    unread: Boolean(raw?.isRead === false),
    type: detectType(content),
    avatarUrl: null,
  };
};

const sortNotificationsByTime = (items) =>
  [...items].sort((a, b) => {
    const timeA = new Date(a?.createdAt ?? 0).getTime();
    const timeB = new Date(b?.createdAt ?? 0).getTime();
    return timeB - timeA;
  });

const IconUser = () => <Text style={{ fontSize: 20 }}>👤</Text>;
const IconShield = () => <Text style={{ fontSize: 18 }}>🛡️</Text>;
const IconHeart = () => <Text style={{ fontSize: 14, color: '#ef4444' }}>♥</Text>;
const IconComment = () => <Text style={{ fontSize: 14, color: '#6b7280' }}>💬</Text>;

const TypeIcon = ({ type }) => {
  const map = {
    like: ['bg-red-100', <IconHeart key="heart" />],
    comment: ['bg-gray-100', <IconComment key="comment" />],
    follow: [
      'bg-emerald-100',
      <Text key="follow" style={{ fontSize: 13, color: '#059669' }}>
        +
      </Text>,
    ],
  };

  const config = map[type];
  if (!config) return null;

  return (
    <View
      className={`h-7 w-7 items-center justify-center rounded-full border border-white ${config[0]}`}>
      {config[1]}
    </View>
  );
};

const Avatar = ({ type, uri, label }) => {
  if (type === 'system') {
    return (
      <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-900">
        <IconShield />
      </View>
    );
  }

  return (
    <View className="h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-200">
      {uri ? (
        <Image source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      ) : label ? (
        <Text className="text-sm font-semibold text-gray-700">
          {label.slice(0, 1).toUpperCase()}
        </Text>
      ) : (
        <IconUser />
      )}
    </View>
  );
};

const Toast = ({ visible, message }) => {
  if (!visible) return null;

  return (
    <View className="absolute left-4 right-4 top-3 z-20 rounded-2xl bg-gray-900/95 px-4 py-3 shadow-lg">
      <Text className="text-center text-sm font-medium text-white">{message}</Text>
    </View>
  );
};

const NotifItem = ({ item, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.78}
    onPress={() => onPress?.(item)}
    className={`mx-4 mb-3 flex-row items-center rounded-2xl border px-4 py-3 ${
      item.unread ? 'border-blue-100 bg-blue-50' : 'border-gray-100 bg-white'
    }`}>
    <View className="mr-3">
      <Avatar type={item.type} uri={item.avatarUrl} label={item.senderName} />
    </View>

    <View className="flex-1">
      <Text className="mb-1 text-sm leading-5 text-gray-900" numberOfLines={2}>
        {item.title}
      </Text>
      <Text className={`text-xs ${item.unread ? 'text-blue-500' : 'text-gray-400'}`}>
        {item.time}
      </Text>
    </View>

    <View className="ml-3 items-center">
      <TypeIcon type={item.type} />
      {item.unread && <View className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-500" />}
    </View>
  </TouchableOpacity>
);

const enrichNotificationsWithAvatar = async (items) => {
  const normalized = sortNotificationsByTime(
    (Array.isArray(items) ? items : []).map(normalizeNotification)
  );
  const senderIds = [...new Set(normalized.map((item) => item.senderId).filter(Boolean))];

  if (senderIds.length === 0) return normalized;

  const avatarEntries = await Promise.all(
    senderIds.map(async (id) => {
      try {
        const user = await userService.getUserById(id);
        return [id, user?.image?.url ?? null];
      } catch {
        return [id, null];
      }
    })
  );

  const avatarMap = Object.fromEntries(avatarEntries);

  return normalized.map((item) => ({
    ...item,
    avatarUrl: item.senderId ? (avatarMap[item.senderId] ?? null) : null,
  }));
};

export default function NotificationScreen() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastTimerRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const response = await userService.getNotifications(0, 20);
        const items =
          response?.content ??
          response?.data?.content ??
          response?.items ??
          response?.data ??
          (Array.isArray(response) ? response : []);

        if (!mounted) return;

        const enriched = await enrichNotificationsWithAvatar(items);
        if (!mounted) return;
        setNotifications(enriched);
      } catch {
        if (mounted) setNotifications([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showReadToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
    }, 1000);
  };

  const handleReadNotification = async (item) => {
    if (!item?.id) return;

    try {
      await userService.readNotification(item.id);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === item.id ? { ...notif, unread: false } : notif))
      );
      showReadToast(item.unread ? 'Đã đánh dấu là đã đọc' : 'Thông báo đã được mở');
    } catch {}
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      <Toast visible={showToast} message={toastMessage} />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 18, paddingBottom: 100 }}
        renderItem={({ item }) => <NotifItem item={item} onPress={handleReadNotification} />}
        ListEmptyComponent={
          <View className="items-center px-6 py-16">
            <Text style={{ fontSize: 42, marginBottom: 12 }}>🔔</Text>
            <Text className="mb-2 text-base font-semibold text-gray-800">Chưa có thông báo</Text>
            <Text className="text-center text-sm text-gray-400">
              Các cập nhật mới từ hệ thống và người dùng khác sẽ xuất hiện tại đây.
            </Text>
          </View>
        }
      />

      <BottomTab />
    </SafeAreaView>
  );
}
