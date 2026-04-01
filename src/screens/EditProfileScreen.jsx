import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  ActionSheetIOS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { userService } from '@/services/userService';

export default function EditProfileScreen() {
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('male');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ── Avatar state ──
  const [avatarUri, setAvatarUri] = useState(null); // preview URI (local or remote)
  const [imageFile, setImageFile] = useState(null); // file to upload

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await userService.getProfile();

        if (!mounted) return;

        const p = res?.data ?? res?.result ?? res;

        setFirstName(p?.firstName ?? '');
        setLastName(p?.lastName ?? '');
        setGender(p?.gender ?? 'male');

        const avatar = p?.image?.url ?? p?.avatarUrl ?? p?.imageUrl ?? p?.avatar ?? null;
        if (avatar) {
          setAvatarUri(avatar);
        }
      } catch (error) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ── Image picker helpers ──
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Ứng dụng cần quyền truy cập Camera để chụp ảnh.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];
      setAvatarUri(asset.uri);
      setImageFile({
        uri: asset.uri,
        type: asset.mimeType ?? 'image/jpeg',
        name: asset.fileName ?? `avatar_${Date.now()}.jpg`,
      });
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
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];
      setAvatarUri(asset.uri);
      setImageFile({
        uri: asset.uri,
        type: asset.mimeType ?? 'image/jpeg',
        name: asset.fileName ?? `avatar_${Date.now()}.jpg`,
      });
    }
  };

  const handlePickImage = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Huỷ', 'Chụp ảnh', 'Chọn từ thư viện'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) openCamera();
          else if (buttonIndex === 2) openGallery();
        },
      );
    } else {
      // Android: simple Alert-based menu
      Alert.alert('Chọn ảnh đại diện', '', [
        { text: 'Huỷ', style: 'cancel' },
        { text: 'Chụp ảnh', onPress: openCamera },
        { text: 'Chọn từ thư viện', onPress: openGallery },
      ]);
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Thông báo', 'Họ và Tên không được để trống.');
      return;
    }

    try {
      setSaving(true);

      await userService.updateProfile(
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          gender,
        },
        imageFile,
      );

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
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-16">
            <Text className="text-sm text-gray-600">Quay lại</Text>
          </TouchableOpacity>
          <Text className="flex-1 text-center text-base font-bold text-gray-900">Hồ sơ</Text>
          <TouchableOpacity onPress={handleSave} className="w-16 items-end" disabled={saving}>
            {saving ? (
              <ActivityIndicator />
            ) : (
              <Text className="text-sm font-semibold text-blue-500">Xác nhận</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}>
          {loading && (
            <View className="items-center py-6">
              <ActivityIndicator color="#000" />
            </View>
          )}
          <View className="flex-1 px-6 pb-10 pt-8">
            {/* ── Avatar ── */}
            <View className="mb-8 items-center">
              <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
                <View className="relative">
                  {avatarUri ? (
                    <Image
                      source={{ uri: avatarUri }}
                      style={{ width: 96, height: 96, borderRadius: 48 }}
                    />
                  ) : (
                    <View className="h-24 w-24 items-center justify-center rounded-full border border-dashed border-gray-300">
                      <Text style={{ fontSize: 40, color: '#d1d5db' }}>👤</Text>
                    </View>
                  )}
                  {/* Camera badge */}
                  <View
                    className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-900">
                    <Text style={{ fontSize: 14 }}>📷</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity className="mt-3" onPress={handlePickImage}>
                <Text className="text-sm font-medium text-blue-500">Chỉnh ảnh hồ sơ</Text>
              </TouchableOpacity>
            </View>

            {/* ── Họ ── */}
            <View className="mb-5">
              <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
                Họ
              </Text>
              <TextInput
                className="rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Họ"
                placeholderTextColor="#9ca3af"
                editable={!saving}
              />
            </View>

            {/* ── Tên ── */}
            <View className="mb-5">
              <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
                Tên
              </Text>
              <TextInput
                className="rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Tên"
                placeholderTextColor="#9ca3af"
                editable={!saving}
              />
            </View>

            {/* ── Giới tính ── */}
            <View className="mb-10">
              <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
                Giới Tính
              </Text>
              <View className="flex-row gap-3">
                {[
                  { label: 'Nam', value: 'male' },
                  { label: 'Nữ', value: 'female' },
                ].map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    className="flex-1 flex-row items-center rounded-lg border border-gray-300 px-4 py-3"
                    onPress={() => setGender(opt.value)}
                    disabled={saving}>
                    <View
                      className={`mr-2 h-4 w-4 items-center justify-center rounded-full border-2 ${gender === opt.value ? 'border-black' : 'border-gray-400'}`}>
                      {gender === opt.value && <View className="h-2 w-2 rounded-full bg-black" />}
                    </View>
                    <Text className="text-base text-gray-900">{opt.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ── Save Button ── */}
            <TouchableOpacity
              className="items-center rounded-xl bg-black py-4"
              onPress={handleSave}
              activeOpacity={0.85}
              disabled={saving}>
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-base font-bold text-white">Lưu thay đổi</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

