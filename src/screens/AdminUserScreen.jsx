import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { adminService } from '@/services/adminService';

const TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'active', label: 'Hoạt động' },
  { key: 'blocked', label: 'Khoá' },
];

const UserItem = ({ user, onToggle, isToggling }) => {
  const isBlocked = user.status === 'blocked';

  return (
    <View className="flex-row items-center border-b border-gray-100 px-4 py-3">
      <View
        className={`mr-3 h-11 w-11 items-center justify-center overflow-hidden rounded-full ${isBlocked ? 'bg-gray-200' : 'bg-gray-100'}`}>
        {user.avatarUrl ? (
          <Image
            source={{ uri: user.avatarUrl }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <Text style={{ fontSize: 20, opacity: isBlocked ? 0.4 : 1 }}>👤</Text>
        )}
      </View>

      <View className="flex-1">
        <Text className={`text-sm font-semibold ${isBlocked ? 'text-gray-400' : 'text-gray-900'}`}>
          {user.fullName}
        </Text>
        <View className="flex-row items-center">
          <View
            className={`mr-1 h-1.5 w-1.5 rounded-full ${isBlocked ? 'bg-gray-400' : 'bg-gray-900'}`}
          />
          <Text className={`text-xs font-medium ${isBlocked ? 'text-gray-400' : 'text-gray-900'}`}>
            {isBlocked ? 'KHOÁ' : 'HOẠT ĐỘNG'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => onToggle(user.id)}
        disabled={isToggling}
        activeOpacity={0.8}
        className={`h-10 w-10 items-center justify-center rounded-full border-2 ${
          isBlocked ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
        }`}>
        {isToggling ? (
          <ActivityIndicator size="small" color={isBlocked ? '#fff' : '#000'} />
        ) : (
          <Text style={{ fontSize: 16 }}>{isBlocked ? '🔒' : '🔓'}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default function AdminUsersScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  const normalizeUsers = useCallback((payload) => {
    const items = payload?.content ?? payload?.items ?? payload ?? [];
    if (!Array.isArray(items)) return [];
    return items.map((u) => ({
      id: String(u?.id ?? ''),
      fullName: [u?.firstName, u?.lastName].filter(Boolean).join(' ') || 'unknown',
      avatarUrl: u?.image?.url ?? null,
      gender: u?.gender ?? '',
      enabled: Boolean(u?.enabled),
      status: u?.enabled === false ? 'blocked' : 'active',
    }));
  }, []);

  const loadUsers = useCallback(async () => {
    const payload = await adminService.getUsers('', 0, 200);
    setUsers(normalizeUsers(payload));
  }, [normalizeUsers]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        await loadUsers();
      } catch {
        if (mounted) setUsers([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [loadUsers]);

  const handleToggle = async (id) => {
    if (togglingId) return;
    setTogglingId(id);

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextBlocked = u.status !== 'blocked';
          return {
            ...u,
            enabled: !nextBlocked,
            status: nextBlocked ? 'blocked' : 'active',
          };
        }
        return u;
      })
    );

    try {
      await adminService.toggleUser(id);
    } catch (e) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === id) {
            const nextBlocked = u.status !== 'blocked';
            return {
              ...u,
              enabled: !nextBlocked,
              status: nextBlocked ? 'blocked' : 'active',
            };
          }
          return u;
        })
      );
      Alert.alert('Thất bại', e.message);
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((u) => {
      const matchSearch =
        !normalizedSearch ||
        u.fullName.toLowerCase().includes(normalizedSearch) ||
        u.id.toLowerCase().includes(normalizedSearch);
      const matchTab =
        activeTab === 'all' ||
        (activeTab === 'active' && u.status === 'active') ||
        (activeTab === 'blocked' && u.status === 'blocked');
      return matchSearch && matchTab;
    });
  }, [users, search, activeTab]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center border-b border-gray-100 px-4 py-3">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2 p-1">
          <Text style={{ fontSize: 28, lineHeight: 30, color: '#111' }}>‹</Text>
        </TouchableOpacity>
        <Text className="flex-1 text-center text-base font-bold text-gray-900">
          Quản lý người dùng
        </Text>
        <View className="w-8" />
      </View>

      <View className="px-4 py-3">
        <View className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
          <Text className="mr-2 text-gray-400">🔍</Text>
          <TextInput
            className="flex-1 text-sm text-gray-900"
            placeholder="Tìm bằng tên hoặc ID ..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text className="text-gray-400">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="mb-2 flex-row gap-2 px-4">
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.8}
            className={`rounded-full border px-4 py-1.5 ${
              activeTab === tab.key ? 'border-gray-900 bg-gray-900' : 'border-gray-200 bg-white'
            }`}>
            <Text
              className={`text-xs font-semibold ${
                activeTab === tab.key ? 'text-white' : 'text-gray-600'
              }`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserItem user={item} onToggle={handleToggle} isToggling={togglingId === item.id} />
        )}
        ListHeaderComponent={
          loading ? (
            <View className="items-center py-6">
              <ActivityIndicator color="#000" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View className="items-center py-16">
            <Text className="text-sm text-gray-400">Không tìm thấy người dùng</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
