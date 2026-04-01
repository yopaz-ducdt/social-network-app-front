import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { userService } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';

export default function EditPostScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();

  // Nhận post data từ navigation params
  const post = route.params?.post ?? {
    title: '',
    content: '',
  };

  const [title, setTitle] = useState(post.title ?? '');
  const [content, setContent] = useState(post.content ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await userService.updatePost(post.id, title.trim(), content.trim());
      Alert.alert('Thành công', 'Đã lưu thay đổi.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Thất bại', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* ── Header ── */}
        <View className="flex-row items-center border-b border-gray-100 px-4 py-3">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-12">
            <Text className="text-sm text-gray-600">Huỷ</Text>
          </TouchableOpacity>
          <Text className="flex-1 text-center text-base font-bold text-gray-900">
            Chỉnh sửa bài viết
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            className="rounded-lg bg-black px-4 py-1.5"
            activeOpacity={0.85}
            disabled={saving}>
            <Text className="text-sm font-bold tracking-widest text-white">SỬA</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* ── User info ── */}
          <View className="flex-row items-center px-4 py-4">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-200">
              <Text style={{ fontSize: 20 }}>👤</Text>
            </View>
            <Text className="text-sm font-semibold text-gray-900">{user?.username ?? 'Bạn'}</Text>
          </View>

          {/* ── Title input ── */}
          <TextInput
            className="px-4 py-2 text-lg font-bold text-gray-900"
            value={title}
            onChangeText={setTitle}
            placeholder="Tiêu đề bài viết"
            placeholderTextColor="#9ca3af"
          />

          {/* ── Content input ── */}
          <TextInput
            className="min-h-20 px-4 text-base text-gray-900"
            value={content}
            onChangeText={setContent}
            placeholder="Bạn đang nghĩ gì thế?"
            placeholderTextColor="#9ca3af"
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
