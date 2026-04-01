import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { userService } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';

const UserItem = ({ user, onPress }) => (
  <TouchableOpacity
    className="flex-row items-center border-b border-gray-100 px-4 py-3"
    activeOpacity={0.7}
    onPress={() => onPress(user)}>
    {/* Avatar */}
    <View className="mr-3 h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100">
      {user.image?.url ? (
        <Image
          source={{ uri: user.image.url }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      ) : (
        <Text style={{ fontSize: 20 }}>👤</Text>
      )}
    </View>

    {/* Info */}
    <View className="flex-1">
      <Text className="text-sm font-semibold text-gray-900">{user.username}</Text>
      <Text className="mt-0.5 text-xs text-gray-400">
        {[user.firstName, user.lastName].filter(Boolean).join(' ') || user.username}
      </Text>
    </View>

    {/* View Profile Icon */}
    <Text className="text-lg text-gray-300">›</Text>
  </TouchableOpacity>
);

export default function SearchScreen() {
  const navigation = useNavigation();
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!debouncedSearch) {
        if (mounted) {
          setUsers([]);
          setLoading(false);
        }
        return;
      }
      try {
        setLoading(true);
        const payload = await userService.findUsers(debouncedSearch, 0, 50);
        if (!mounted) return;
        const items = payload?.content ?? payload?.items ?? payload ?? [];
        setUsers(Array.isArray(items) ? items : []);
      } catch {
        if (mounted) setUsers([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [debouncedSearch]);

  const handleUserPress = (user) => {
    if (currentUser?.id === user.id || currentUser?.userId === user.id) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('UserProfile', { userId: user.id });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* ── Search Header ── */}
      <View className="flex-row items-center border-b border-gray-100 px-3 py-2">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Text style={{ fontSize: 26, lineHeight: 28, color: '#111' }}>‹</Text>
        </TouchableOpacity>

        <View className="ml-1 h-10 flex-1 flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-3">
          <Text className="mr-2 opacity-50">🔍</Text>
          <TextInput
            className="flex-1 py-0 text-sm text-gray-900"
            style={{ textAlignVertical: 'center', includeFontPadding: false }}
            placeholder="Tìm kiếm người dùng..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
            autoFocus
            autoCapitalize="none"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} className="p-1">
              <View className="h-4 w-4 items-center justify-center rounded-full bg-gray-300">
                <Text style={{ fontSize: 10, color: 'white', fontWeight: 'bold' }}>✕</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View className="w-2" />
      </View>

      {/* ── Search Results ── */}
      <FlatList
        data={users}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <UserItem user={item} onPress={handleUserPress} />}
        ListHeaderComponent={
          loading ? (
            <View className="items-center py-8">
              <ActivityIndicator color="#000" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading && debouncedSearch ? (
            <View className="items-center py-16">
              <Text className="text-sm text-gray-400">
                Không tìm thấy &quot;{debouncedSearch}&quot;
              </Text>
            </View>
          ) : !debouncedSearch ? (
            <View className="items-center px-6 py-16">
              <Text style={{ fontSize: 48, marginBottom: 12 }}>🔍</Text>
              <Text className="mb-2 text-base font-semibold text-gray-800">Tìm kiếm mọi người</Text>
              <Text className="text-center text-sm text-gray-400">
                Nhập tên hoặc email để tìm kiếm người dùng khác trên nền tảng.
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
