import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { adminService } from '@/services/adminService';

const MODULES = [
  {
    id: 'users',
    icon: '👥',
    label: 'Quản lý người dùng',
    desc: 'Khoá/mở khoá người dùng',
    screen: 'AdminUsers',
  },
  {
    id: 'content',
    icon: '🚫',
    label: 'Kiểm duyệt nội dung',
    desc: 'Xem xét báo cáo, xoá bài viết vi phạm',
    screen: 'AdminContent',
  },
];
export default function AdminDashboardScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalWarningPosts, setTotalWarningPosts] = useState(0);
  const [totalReports, setTotalReports] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!isFocused) return;

    (async () => {
      try {
        setLoading(true);
        const [usersPayload, warningPostsPayload, reportsPayload] = await Promise.all([
          adminService.getUsers('', 0, 1),
          adminService.getWarningPosts(0, 1),
          adminService.getAllReports(0, 1),
        ]);
        if (!mounted) return;
        setTotalUsers(
          usersPayload?.totalElements ?? usersPayload?.content?.length ?? usersPayload?.length ?? 0
        );
        setTotalWarningPosts(
          warningPostsPayload?.totalElements ??
            warningPostsPayload?.content?.length ??
            warningPostsPayload?.length ??
            0
        );
        setTotalReports(
          reportsPayload?.totalElements ??
            reportsPayload?.content?.length ??
            reportsPayload?.length ??
            0
        );
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isFocused]);

  const STATS = [
    {
      id: 'users',
      icon: '👥',
      value: loading ? '...' : totalUsers.toLocaleString(),
      label: 'Tổng users',
    },
    {
      id: 'warning-posts',
      icon: '🚫',
      value: loading ? '...' : totalWarningPosts.toLocaleString(),
      label: 'Bài bị cảnh báo',
    },
    {
      id: 'reports',
      icon: 'ℹ️',
      value: loading ? '...' : totalReports.toLocaleString(),
      label: 'Phiếu tố cáo',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-3">
        <Text className="flex-1 text-lg font-bold text-gray-900">Bảng điều khiển Admin</Text>
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full border border-gray-200"
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Settings')}>
          <Text style={{ fontSize: 18 }}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}>
        <View className="mb-6 px-4">
          <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Tổng Quan
          </Text>
          <View className="flex-row gap-3">
            {STATS.map((stat) => (
              <View key={stat.id} className="flex-1 rounded-xl border border-gray-200 p-4">
                <Text style={{ fontSize: 22, marginBottom: 8 }}>{stat.icon}</Text>
                <Text className="text-xl font-bold text-gray-900">{stat.value}</Text>
                <Text className="mt-1 text-xs text-gray-400">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="px-4">
          <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Management Modules
          </Text>
          <View className="overflow-hidden rounded-xl border border-gray-200">
            {MODULES.map((mod, index) => (
              <TouchableOpacity
                key={mod.id}
                onPress={() => navigation.navigate(mod.screen)}
                activeOpacity={0.7}
                className={`flex-row items-center bg-white px-4 py-4 ${
                  index < MODULES.length - 1 ? 'border-b border-gray-100' : ''
                }`}>
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <Text style={{ fontSize: 18 }}>{mod.icon}</Text>
                </View>

                <View className="flex-1">
                  <Text className="mb-0.5 text-sm font-semibold text-gray-900">{mod.label}</Text>
                  <Text className="text-xs leading-4 text-gray-400">{mod.desc}</Text>
                </View>

                <Text className="ml-2 text-lg text-gray-400">›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
