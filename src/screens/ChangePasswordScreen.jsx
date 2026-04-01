import { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { userService } from '@/services/userService';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Thông báo', 'Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      setSaving(true);
      await userService.changePassword(oldPassword, newPassword);
      Alert.alert('Thành công', 'Đổi mật khẩu thành công.');
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
        <View className="flex-row items-center border-b border-gray-100 px-4 py-3">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-16">
            <Text className="text-sm text-gray-600">Quay lại</Text>
          </TouchableOpacity>
          <Text className="flex-1 text-center text-base font-bold text-gray-900">Đổi mật khẩu</Text>
          <TouchableOpacity onPress={handleSave} className="w-16 items-end" disabled={saving}>
            {saving ? (
              <ActivityIndicator />
            ) : (
              <Text className="text-sm font-semibold text-blue-500">Lưu</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 24 }}>
          <View className="mb-5">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Mật khẩu hiện tại
            </Text>
            <TextInput
              className="rounded-xl border border-gray-200 px-4 py-3 text-base text-gray-900"
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder="Nhập mật khẩu hiện tại"
              placeholderTextColor="#9ca3af"
              secureTextEntry
            />
          </View>

          <View className="mb-5">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Mật khẩu mới
            </Text>
            <TextInput
              className="rounded-xl border border-gray-200 px-4 py-3 text-base text-gray-900"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nhập mật khẩu mới"
              placeholderTextColor="#9ca3af"
              secureTextEntry
            />
          </View>

          <View>
            <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Xác nhận mật khẩu mới
            </Text>
            <TextInput
              className="rounded-xl border border-gray-200 px-4 py-3 text-base text-gray-900"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Nhập lại mật khẩu mới"
              placeholderTextColor="#9ca3af"
              secureTextEntry
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
