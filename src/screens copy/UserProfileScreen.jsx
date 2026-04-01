import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { userService } from '@/services/userService';
import BottomTab from '@/components/BottomTab';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 4) / 3;

// ─── Grid Item ────────────────────────────────────────────────
const GridItem = ({ post, onPress }) => (
  <TouchableOpacity
    style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
    className="items-center justify-center border border-white bg-gray-100"
    onPress={() => onPress(post)}
    activeOpacity={0.8}>
    {post.images?.[0]?.url ? (
      <Image
        source={{ uri: post.images[0].url }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
    ) : (
      <Text style={{ fontSize: 24, color: '#d1d5db' }}>🖼️</Text>
    )}
  </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────
export default function UserProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user: currentUser } = useAuth();
  const { userId } = route.params;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setFollowing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingFollow, setLoadingFollow] = useState(false);

  // ── Fetch profile + posts ─────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      setLoadingProfile(true);

      // Lấy profile, posts và danh sách user mà mình đang theo dõi
      const [profileRes, postsRes, followersRes] = await Promise.all([
        userService.getUserById(userId),
        userService.getUserPostsById(userId),
        userService.getFollowers().catch(() => []),
      ]);

      setProfile(profileRes);
      setPosts(postsRes?.content ?? postsRes?.items ?? postsRes ?? []);

      const followingList =
        followersRes?.content ??
        followersRes?.items ??
        followersRes?.data?.content ??
        followersRes?.data?.items ??
        followersRes ??
        [];

      const followingIds = Array.isArray(followingList)
        ? followingList.map((item) => String(item?.id ?? item?.userId ?? item))
        : [];

      setFollowing(followingIds.includes(String(userId)));
    } catch (e) {
      Alert.alert('Lỗi', e.message);
    } finally {
      setLoadingProfile(false);
    }
  }, [userId]);

  useEffect(() => {
    const normalizedUserId = String(userId ?? '');
    const myId = String(currentUser?.id ?? currentUser?.userId ?? '');

    if (normalizedUserId && myId && normalizedUserId === myId) {
      navigation.replace('Profile');
      return;
    }

    fetchData();
  }, [currentUser?.id, currentUser?.userId, fetchData, navigation, userId]);

  // ── Follow / Unfollow ─────────────────────────────────────
  const handleFollow = async () => {
    try {
      setLoadingFollow(true);
      await userService.follow(userId);
      setFollowing((prev) => !prev);
    } catch (e) {
      Alert.alert('Lỗi', e.message);
    } finally {
      setLoadingFollow(false);
    }
  };

  if (loadingProfile) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  const fullName = profile
    ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim().toUpperCase()
    : userId;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* ── Header ── */}
      <View className="flex-row items-center border-b border-gray-100 px-4 py-3">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
          <Text style={{ fontSize: 28, lineHeight: 30, color: '#111' }}>‹</Text>
        </TouchableOpacity>
        <Text className="-ml-6 flex-1 text-center text-sm font-bold uppercase tracking-wider text-gray-900">
          {fullName ?? userId}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="items-center px-6 pb-4 pt-6">
          {/* Avatar */}
          <View className="mb-4 h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-dashed border-gray-300 bg-gray-50">
            {profile?.image?.url ? (
              <Image
                source={{ uri: profile.image.url }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <Text style={{ fontSize: 40, color: '#d1d5db' }}>👤</Text>
            )}
          </View>

          {/* Tên */}
          <Text className="mb-1 text-xl font-bold tracking-wide text-gray-900">
            {fullName || '—'}
          </Text>

          {/* Username */}
          {profile?.username && (
            <Text className="mb-2 text-sm text-gray-400">@{profile.username}</Text>
          )}

          {/* Bio (nếu BE có) */}
          {profile?.bio && (
            <Text className="mb-4 text-center text-sm text-gray-600">{profile.bio}</Text>
          )}

          {/* Action buttons */}
          <View className="mb-6 mt-3 w-full flex-row gap-3">
            <TouchableOpacity
              onPress={handleFollow}
              disabled={loadingFollow}
              activeOpacity={0.85}
              className={`flex-1 items-center rounded-xl border py-3 ${
                isFollowing ? 'border-gray-300 bg-white' : 'border-black bg-black'
              }`}>
              {loadingFollow ? (
                <ActivityIndicator size="small" color={isFollowing ? '#000' : '#fff'} />
              ) : (
                <Text
                  className={`text-sm font-bold uppercase tracking-widest ${
                    isFollowing ? 'text-gray-700' : 'text-white'
                  }`}>
                  {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

        </View>

        {/* ── Grid posts ── */}
        {posts.length === 0 ? (
          <View className="items-center py-16">
            <Text className="text-sm text-gray-400">Chưa có bài đăng nào</Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <GridItem
                post={item}
                onPress={(post) => navigation.navigate('PostDetail', { post })}
              />
            )}
          />
        )}
      </ScrollView>

      <BottomTab activeTab="home" onTabPress={(key) => navigation.navigate(key)} />
    </SafeAreaView>
  );
}
