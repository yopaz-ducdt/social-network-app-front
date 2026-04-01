import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTab from '../components/BottomTab';
import PostCard from '../components/PostCard';

// ─── Fake Data ───────────────────────────────────────────────
const STORIES = [
  { id: '0', username: 'Tin của tôi', isMe: true },
  { id: '1', username: 'phucnh' },
  { id: '2', username: 'namnd' },
  { id: '3', username: 'manhnd' },
  { id: '4', username: 'linhpv' },
  { id: '5', username: 'tuananh' },
];

const POSTS = [
  {
    id: '1',
    username: 'ducdt',
    location: 'Hà Đông, Hà Nội',
    likes: 1234,
    caption: 'Chúc mừng năm mới #happynewyear',
    time: '2 giờ trước',
    liked: false,
    saved: false,
  },
  {
    id: '2',
    username: 'manhnd',
    location: 'Hoàn Kiếm, Hà Nội',
    likes: 856,
    caption: 'Cuối tuần chill thôi 🌿 #weekend',
    time: '5 giờ trước',
    liked: true,
    saved: false,
  },
  {
    id: '3',
    username: 'linhpv',
    location: 'Đống Đa, Hà Nội',
    likes: 421,
    caption: 'Cà phê sáng ☕ ngon quá #coffee',
    time: '1 ngày trước',
    liked: false,
    saved: true,
  },
];

// ─── Icons ───────────────────────────────────────────────────
const IconBell = () => <Text style={{ fontSize: 22 }}>🔔</Text>;

// ─── Story Item ───────────────────────────────────────────────
const StoryItem = ({ item }) => (
  <TouchableOpacity className="mr-4 items-center" activeOpacity={0.8}>
    {item.isMe ? (
      <View className="mb-1 h-14 w-14 items-center justify-center rounded-full border border-dashed border-gray-400">
        <Text className="text-2xl leading-none text-gray-400">+</Text>
      </View>
    ) : (
      <View className="mb-1 h-14 w-14 rounded-full border-2 border-white bg-gray-200 shadow" />
    )}
    <Text className="text-center text-xs text-gray-600" numberOfLines={1} style={{ maxWidth: 56 }}>
      {item.username}
    </Text>
  </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────
export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center border-b border-gray-100 px-4 py-3">
        <View className="mr-2 h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
          <Text className="text-xs font-bold text-white">S</Text>
        </View>
        <Text className="flex-1 text-base font-bold text-gray-900">Social App</Text>
        <TouchableOpacity className="p-1" onPress={() => navigation.navigate('Notification')}>
          <IconBell />
        </TouchableOpacity>
      </View>

      {/* Feed */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stories */}
        <View className="border-b border-gray-100 py-4">
          <FlatList
            data={STORIES}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => <StoryItem item={item} />}
          />
        </View>

        {/* Posts */}
        <View className="pt-4">
          {POSTS.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-20 right-5 h-12 w-12 items-center justify-center rounded-full bg-black shadow-lg"
        activeOpacity={0.85}>
        <Text className="text-2xl leading-none text-white">+</Text>
      </TouchableOpacity>

      {/* Bottom Tab */}
      <BottomTab />
    </SafeAreaView>
  );
}
