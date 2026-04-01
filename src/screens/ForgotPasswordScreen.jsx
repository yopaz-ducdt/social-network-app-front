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
import { authService } from '@/services/authService';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) return;
    try {
      setLoading(true);
      await authService.forgotPassword(email.trim());
      Alert.alert('Thành công', 'Nếu email tồn tại, hệ thống sẽ gửi hướng dẫn đặt lại mật khẩu.');
    } catch (e) {
      Alert.alert('Thất bại', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Back button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="px-4 pb-4 pt-2"
            activeOpacity={0.7}>
            <Text style={{ fontSize: 28, color: '#111' }}>‹</Text>
          </TouchableOpacity>

          <View className="flex-1 px-6 pt-8">
            {/* Icon */}
            <View className="mb-8 items-center">
              <View className="h-24 w-24 items-center justify-center rounded-full border border-dashed border-gray-300">
                <Text style={{ fontSize: 36 }}>🔄</Text>
              </View>
            </View>

            {/* Title */}
            <Text className="mb-3 text-center text-2xl font-bold text-gray-900">Quên mật khẩu</Text>
            <Text className="mb-10 px-4 text-center text-sm leading-6 text-gray-400">
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi đường dẫn để bạn có thể đổi lại mật
              khẩu
            </Text>

            {/* Email input */}
            <View className="mb-8">
              <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
                Địa Chỉ Email
              </Text>
              <View className="flex-row items-center rounded-lg border border-gray-300 px-4 py-3">
                <Text className="mr-2 text-gray-400">✉️</Text>
                <TextInput
                  className="flex-1 text-base text-gray-900"
                  placeholder="name@gmail.com"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Submit button */}
            <TouchableOpacity
              className={`mb-6 items-center rounded-lg py-4 ${email.trim() ? 'bg-black' : 'bg-gray-300'}`}
              onPress={handleSend}
              disabled={!email.trim() || loading}
              activeOpacity={0.85}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-base font-bold uppercase tracking-widest text-white">
                  Gửi Link
                </Text>
              )}
            </TouchableOpacity>

            {/* Back to login */}
            <TouchableOpacity
              className="flex-row items-center justify-center"
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}>
              <Text className="mr-1 text-gray-500">‹</Text>
              <Text className="text-sm text-gray-500">Quay lại đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
