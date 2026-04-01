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
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    try {
      setLoading(true);
      const data = await authService.login(username.trim(), password);

      await login(data);

      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Đăng nhập thất bại', error.message);
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
          <View className="flex-1 px-6 pb-10 pt-16">
            <View className="mb-8 items-center">
              <View className="h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-gray-300">
                <Text className="text-2xl text-gray-300">🖼️</Text>
              </View>
            </View>

            <Text className="mb-10 text-center text-2xl font-bold text-gray-900">
              Chào mừng trở lại
            </Text>

            <View className="mb-5">
              <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
                Tên đăng nhập (Username/Email)
              </Text>
              <TextInput
                className="rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900"
                placeholder="Nhập username"
                placeholderTextColor="#9ca3af"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View className="mb-2">
              <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
                Mật khẩu
              </Text>
              <View className="flex-row items-center rounded-lg border border-gray-300 px-4">
                <TextInput
                  className="flex-1 py-3 text-base text-gray-900"
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-1">
                  <Text className="text-base text-gray-400">{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              className="mb-8 items-end"
              onPress={() => navigation.navigate('ForgotPassword')}>
              <Text className="text-sm text-gray-500">Quên mật khẩu ?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`mb-6 items-center rounded-lg py-4 ${loading ? 'bg-gray-400' : 'bg-black'}`}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-base font-bold uppercase tracking-widest text-white">
                  Đăng nhập
                </Text>
              )}
            </TouchableOpacity>

            <View className="mb-6 flex-row items-center">
              <View className="h-px flex-1 bg-gray-200" />
              <Text className="mx-4 text-xs uppercase tracking-widest text-gray-400">Hoặc</Text>
              <View className="h-px flex-1 bg-gray-200" />
            </View>

            <TouchableOpacity
              className="mb-10 flex-row items-center justify-center rounded-lg border border-gray-200 py-3.5"
              activeOpacity={0.85}
              disabled={loading}>
              <View className="mr-2 h-5 w-5 rounded-full bg-gray-300" />
              <Text className="text-base font-medium text-gray-700">Đăng nhập với Google</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center">
              <Text className="text-sm text-gray-500">Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text className="text-sm font-semibold text-black underline">Nhấn vào đây</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
