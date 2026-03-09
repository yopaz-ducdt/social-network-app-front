import { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const IconHeart = ({ filled }) => <Text style={{ fontSize: 22 }}>{filled ? '❤️' : '🤍'}</Text>;
const IconComment = () => <Text style={{ fontSize: 22 }}>💬</Text>;
const IconShare = () => <Text style={{ fontSize: 22 }}>➤</Text>;
const IconBookmark = ({ filled }) => <Text style={{ fontSize: 22 }}>{filled ? '🔖' : '🏷️'}</Text>;
const IconMore = () => <Text style={{ fontWeight: '500', color: '#555' }}>•••</Text>;

export default function PostCard({ post }) {
  const navigation = useNavigation();
  const [liked, setLiked] = useState(post.liked);
  const [saved, setSaved] = useState(post.saved);
  const [likes, setLikes] = useState(post.likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <View className="mb-6">
      {/* Header — nhấn để vào PostDetail */}
      <TouchableOpacity
        className="mb-3 flex-row items-center px-4"
        activeOpacity={0.8}
        onPress={() => navigation.navigate('PostDetail', { post })}>
        <View className="mr-3 h-9 w-9 rounded-full bg-gray-300" />
        <View className="flex-1">
          <Text className="text-sm font-semibold text-gray-900">{post.username}</Text>
          <Text className="text-xs text-gray-400">{post.location}</Text>
        </View>
        <TouchableOpacity className="px-1" onPress={(e) => e.stopPropagation()}>
          <IconMore />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Image placeholder */}
      <View style={{ width, height: width }} className="items-center justify-center bg-gray-100">
        <View className="h-16 w-16 items-center justify-center rounded-xl border border-gray-300">
          <Text className="text-3xl text-gray-300">🖼️</Text>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row items-center px-4 pb-1 pt-3">
        <TouchableOpacity onPress={toggleLike} className="mr-4" activeOpacity={0.8}>
          <IconHeart filled={liked} />
        </TouchableOpacity>
        <TouchableOpacity className="mr-4" activeOpacity={0.8}>
          <IconComment />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8}>
          <IconShare />
        </TouchableOpacity>
        <View className="flex-1" />
        <TouchableOpacity onPress={() => setSaved(!saved)} activeOpacity={0.8}>
          <IconBookmark filled={saved} />
        </TouchableOpacity>
      </View>

      {/* Likes */}
      <Text className="mb-1 px-4 text-sm font-semibold text-gray-900">
        {likes.toLocaleString()} like
      </Text>

      {/* Caption */}
      <View className="px-4">
        <Text className="text-sm text-gray-900">
          <Text className="font-semibold">{post.username} </Text>
          {post.caption}
        </Text>
      </View>

      {/* Time */}
      <Text className="mt-1 px-4 text-xs text-gray-400">{post.time}</Text>
    </View>
  );
}
