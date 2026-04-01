import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Icon mắt
const EyeIcon = ({ visible }) => (
  <Text className="text-base text-gray-400">{visible ? '⌣' : '👁'}</Text>
);

// Icon Google
const GoogleIcon = () => <View className="mr-2 h-5 w-5 rounded-full bg-gray-300" />;

export default function LoginScreen() {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log('Đăng nhập:', { username, password });
  };

  const handleGoogleLogin = () => {
    console.log('Đăng nhập Google');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 pb-10 pt-16">
          {/* Logo */}
          <View className="mb-8 items-center">
            <View className="h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-gray-300">
              <Text className="text-2xl">✳️</Text>
            </View>
          </View>

          {/* Tiêu đề */}
          <Text className="mb-10 text-center text-2xl font-bold text-gray-900">
            Chào mừng trở lại
          </Text>

          {/* Username */}
          <View className="mb-5">
            <Text className="mb-2 text-xs font-semibold tracking-widest text-gray-500">
              TÊN ĐĂNG NHẬP
            </Text>

            <TextInput
              className="rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900"
              placeholder="Nhập username/email"
              placeholderTextColor="#9ca3af"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <View className="mb-2">
            <Text className="mb-2 text-xs font-semibold tracking-widest text-gray-500">
              MẬT KHẨU
            </Text>

            <View className="flex-row items-center rounded-lg border border-gray-300 px-4">
              <TextInput
                className="flex-1 py-3 text-base text-gray-900"
                placeholder="Nhập mật khẩu"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-1">
                <EyeIcon visible={showPassword} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quên mật khẩu */}
          <TouchableOpacity className="mb-8 items-end">
            <Text className="text-sm text-gray-500">Quên mật khẩu ?</Text>
          </TouchableOpacity>

          {/* Button login */}
          <TouchableOpacity
            className="mb-6 items-center rounded-lg bg-black py-4"
            onPress={handleLogin}
            activeOpacity={0.85}>
            <Text className="text-base font-bold uppercase tracking-widest text-white">
              Đăng nhập
            </Text>
          </TouchableOpacity>

          {/* Hoặc */}
          <View className="mb-6 flex-row items-center">
            <View className="h-px flex-1 bg-gray-200" />
            <Text className="mx-4 text-xs uppercase tracking-widest text-gray-400">Hoặc</Text>
            <View className="h-px flex-1 bg-gray-200" />
          </View>

          {/* Google login */}
          <TouchableOpacity
            className="mb-10 flex-row items-center justify-center rounded-lg border border-gray-200 py-3.5"
            onPress={handleGoogleLogin}
            activeOpacity={0.85}>
            <GoogleIcon />
            <Text className="text-base font-medium text-gray-700">Đăng nhập với Google</Text>
          </TouchableOpacity>

          {/* Signup */}
          <View className="flex-row justify-center">
            <Text className="text-sm text-gray-500">Chưa có tài khoản?</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text className="ml-1 text-sm underline">Nhấn vào đây</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
