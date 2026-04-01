import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  ActionSheetIOS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { userService } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [posting, setPosting] = useState(false);

  const handleRemoveImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Ứng dụng cần quyền truy cập Camera để chụp ảnh.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];
      const newImage = {
        id: Date.now().toString(),
        uri: asset.uri,
        type: asset.mimeType ?? 'image/jpeg',
        name: asset.fileName ?? `image_${Date.now()}.jpg`,
      };
      setImages((prev) => [...prev, newImage]);
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Ứng dụng cần quyền truy cập Thư viện ảnh.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.length) {
      const newImages = result.assets.map((asset, index) => ({
        id: Date.now().toString() + index,
        uri: asset.uri,
        type: asset.mimeType ?? 'image/jpeg',
        name: asset.fileName ?? `image_${Date.now()}_${index}.jpg`,
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleAddImage = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Huỷ', 'Chụp ảnh', 'Chọn từ thư viện'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) openCamera();
          else if (buttonIndex === 2) openGallery();
        }
      );
    } else {
      Alert.alert('Thêm ảnh', '', [
        { text: 'Huỷ', style: 'cancel' },
        { text: 'Chụp ảnh', onPress: openCamera },
        { text: 'Chọn từ thư viện', onPress: openGallery },
      ]);
    }
  };

  const handlePost = async () => {
    try {
      setPosting(true);
      const postDTO = { title: title.trim(), content: content.trim() };
      await userService.createPost(postDTO, images);
      Alert.alert('Thành công', 'Đã đăng bài.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Thất bại', e.message);
    } finally {
      setPosting(false);
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
          <Text className="flex-1 text-center text-base font-bold text-gray-900">Tạo bài viết</Text>
          <TouchableOpacity
            onPress={handlePost}
            disabled={posting || (!title.trim() && !content.trim() && images.length === 0)}
            className={`rounded-lg px-4 py-1.5 ${title.trim() || content.trim() || images.length > 0 ? 'bg-black' : 'bg-gray-300'}`}
            activeOpacity={0.85}>
            {posting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-sm font-bold tracking-widest text-white">ĐĂNG</Text>
            )}
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
            placeholder="Tiêu đề bài viết"
            placeholderTextColor="#9ca3af"
            value={title}
            onChangeText={setTitle}
          />

          {/* ── Content input ── */}
          <TextInput
            className="min-h-20 px-4 text-base text-gray-900"
            placeholder="Bạn đang nghĩ gì thế?"
            placeholderTextColor="#9ca3af"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />

          {/* ── Image picker row ── */}
          <View className="mb-6 mt-4 px-4">
            <View className="flex-row flex-wrap">
              {[...images, { id: 'add' }].map((item) => {
                if (item.id === 'add') {
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={handleAddImage}
                      activeOpacity={0.8}
                      className="mb-2 mr-2 h-24 w-24 items-center justify-center rounded-xl border border-gray-200">
                      <Text style={{ fontSize: 20 }}>🖼️</Text>
                      <Text className="mt-1 text-xs text-gray-400">Thêm</Text>
                    </TouchableOpacity>
                  );
                }

                return (
                  <View key={item.id} className="relative mb-2 mr-2">
                    <Image
                      source={{ uri: item.uri }}
                      className="h-24 w-24 rounded-xl border border-gray-200"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => handleRemoveImage(item.id)}
                      className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-gray-800"
                      activeOpacity={0.8}>
                      <Text style={{ fontSize: 12, color: 'white', lineHeight: 14 }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
