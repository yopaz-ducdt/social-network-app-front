import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// ─── Fake Data ───────────────────────────────────────────────
const POST = {
  id: '1',
  username: 'phuc_nh',
  location: 'Hà Nội, Nghệ An',
  caption: 'Chúc mừng năm mới #happynewyear',
  likes: 1234,
  liked: false,
  saved: false,
  commentCount: 48,
};

const COMMENTS = [
  {
    id: 'c1',
    username: 'nam_nd',
    time: '27m',
    text: 'Chúc mừng năm mới!',
    likes: 5,
    liked: false,
    replies: [
      {
        id: 'r1',
        username: 'phuc_nh',
        mention: '@nam_nd',
        time: '20m',
        text: 'Chúc mừng năm mới',
        likes: 1,
        liked: false,
      },
    ],
  },
  {
    id: 'c2',
    username: 'manh_nd',
    time: '15m',
    text: 'Ảnh nào mà đẹp trai phong độ vậy',
    likes: 3,
    liked: false,
    replies: [],
  },
  {
    id: 'c3',
    username: 'duc_dd',
    time: '5m',
    text: 'Hello bạn nhé',
    likes: 0,
    liked: false,
    replies: [],
  },
];

// ─── Icons ───────────────────────────────────────────────────
const IconHeart = ({ filled, size = 22 }) => (
  <Text style={{ fontSize: size }}>{filled ? '❤️' : '🤍'}</Text>
);
const IconComment = () => <Text style={{ fontSize: 22 }}>💬</Text>;
const IconShare = () => <Text style={{ fontSize: 22 }}>➤</Text>;
const IconSave = ({ filled }) => <Text style={{ fontSize: 22 }}>{filled ? '🔖' : '🏷️'}</Text>;

// ─── Avatar placeholder ───────────────────────────────────────
const Avatar = ({ size = 10 }) => (
  <View
    className={`items-center justify-center rounded-full bg-gray-200`}
    style={{ width: size * 4, height: size * 4 }}>
    <Text style={{ fontSize: size * 1.6 }}>👤</Text>
  </View>
);

// ─── Comment Item ─────────────────────────────────────────────
const CommentItem = ({ comment, isReply = false }) => {
  const [liked, setLiked] = useState(comment.liked);
  const [likes, setLikes] = useState(comment.likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <View className={`mb-4 flex-row ${isReply ? 'ml-10 mt-3' : ''}`}>
      {/* Avatar */}
      <View className="mr-3">
        <Avatar size={isReply ? 8 : 9} />
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row flex-wrap items-baseline">
          <Text className="mr-1 text-sm font-semibold text-gray-900">{comment.username}</Text>
          <Text className="mr-2 text-xs text-gray-400">{comment.time}</Text>
        </View>

        <Text className="mt-0.5 text-sm leading-5 text-gray-800">
          {comment.mention && <Text className="font-medium text-blue-500">{comment.mention} </Text>}
          {comment.text}
        </Text>

        {/* Actions */}
        <View className="mt-2 flex-row items-center gap-4">
          <TouchableOpacity>
            <Text className="text-xs font-medium text-gray-400">Trả lời</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Like */}
      <TouchableOpacity onPress={toggleLike} className="ml-2 items-center">
        <IconHeart filled={liked} size={14} />
        {likes > 0 && <Text className="mt-0.5 text-xs text-gray-400">{likes}</Text>}
      </TouchableOpacity>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────
export default function PostDetailScreen({ navigation }) {
  const [liked, setLiked] = useState(POST.liked);
  const [likes, setLikes] = useState(POST.likes);
  const [saved, setSaved] = useState(POST.saved);
  const [comment, setComment] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const inputRef = useRef(null);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleSendComment = () => {
    if (comment.trim()) {
      console.log('Gửi bình luận:', comment);
      setComment('');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* ── Post Header ── */}
          <View className="flex-row items-center px-4 py-3">
            <Avatar size={10} />
            <View className="ml-3 flex-1">
              <Text className="text-sm font-semibold text-gray-900">{POST.username}</Text>
              <Text className="text-xs text-gray-400">{POST.location}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsFollowing(!isFollowing)}
              className={`rounded-lg border px-4 py-1.5 ${
                isFollowing ? 'border-gray-300' : 'border-gray-900 bg-gray-900'
              }`}
              activeOpacity={0.8}>
              <Text className={`text-xs font-bold ${isFollowing ? 'text-gray-600' : 'text-white'}`}>
                {isFollowing ? 'Đã theo dõi' : 'THEO DÕI'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Caption */}
          <Text className="mb-3 px-4 text-sm text-gray-900">{POST.caption}</Text>

          {/* ── Post Image ── */}
          <View
            style={{ width, height: width }}
            className="items-center justify-center border-b border-t border-gray-100 bg-gray-100">
            <View className="h-16 w-16 items-center justify-center rounded-xl border border-gray-300">
              <Text style={{ fontSize: 32 }}>🖼️</Text>
            </View>
          </View>

          {/* ── Actions ── */}
          <View className="flex-row items-center px-4 pb-2 pt-3">
            <TouchableOpacity onPress={toggleLike} className="mr-1" activeOpacity={0.8}>
              <IconHeart filled={liked} />
            </TouchableOpacity>
            <Text className="mr-4 text-sm font-semibold text-gray-900">
              {likes.toLocaleString()}
            </Text>

            <TouchableOpacity
              className="mr-1"
              onPress={() => inputRef.current?.focus()}
              activeOpacity={0.8}>
              <IconComment />
            </TouchableOpacity>
            <Text className="mr-4 text-sm font-semibold text-gray-900">{POST.commentCount}</Text>

            <TouchableOpacity activeOpacity={0.8}>
              <IconShare />
            </TouchableOpacity>

            <View className="flex-1" />

            <TouchableOpacity onPress={() => setSaved(!saved)} activeOpacity={0.8}>
              <IconSave filled={saved} />
            </TouchableOpacity>
          </View>

          {/* ── Comments Section ── */}
          <View className="px-4 pb-6 pt-2">
            <Text className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-900">
              Comments ({POST.commentCount})
            </Text>

            {COMMENTS.map((c) => (
              <View key={c.id}>
                <CommentItem comment={c} />
                {/* Replies */}
                {c.replies?.map((r) => (
                  <CommentItem key={r.id} comment={r} isReply />
                ))}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* ── Comment Input ── */}
        <View className="flex-row items-center border-t border-gray-100 bg-white px-4 py-3">
          <View className="mr-3">
            <Avatar size={8} />
          </View>
          <View className="flex-1 flex-row items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
            <TextInput
              ref={inputRef}
              className="flex-1 text-sm text-gray-900"
              placeholder="Nhập bình luận của bạn ..."
              placeholderTextColor="#9ca3af"
              value={comment}
              onChangeText={setComment}
              multiline
              returnKeyType="send"
              onSubmitEditing={handleSendComment}
            />
          </View>
          <TouchableOpacity
            onPress={handleSendComment}
            className="ml-3"
            activeOpacity={0.8}
            disabled={!comment.trim()}>
            <Text
              className={`text-sm font-bold ${comment.trim() ? 'text-blue-500' : 'text-gray-300'}`}>
              ĐĂNG
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
