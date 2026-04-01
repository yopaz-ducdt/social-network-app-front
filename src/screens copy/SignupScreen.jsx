import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

const GoogleIcon = () => <View className="mr-2 h-5 w-5 rounded-full bg-gray-300" />;

const EyeIcon = ({ visible }) => (
  <Text className="text-base text-gray-400">{visible ? '⌣' : '👁'}</Text>
);

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('Nam');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // const [agreed, setAgreed] = useState(false);

  const handleRegister = () => {
    console.log('Đăng ký:', { username, gender, email, password, confirmPassword });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 pb-10 pt-12">
          {/* Header */}
          <View className="mb-6 flex-row items-center">
            <TouchableOpacity onPress={() => navigation?.goBack()} className="mr-4">
              <Text className="text-xl text-gray-900">‹</Text>
            </TouchableOpacity>
            <Text className="flex-1 text-center text-base font-bold uppercase tracking-widest text-gray-900">
              Đăng Kí
            </Text>
            {/* spacer để căn giữa chữ */}
            <View className="w-6" />
          </View>

          {/* Logo */}
          <View className="mb-4 items-center">
            <View className="h-16 w-16 items-center justify-center rounded-xl border border-gray-300">
              <Text className="text-2xl">✳️</Text>
            </View>
          </View>

          {/* Subtitle */}
          <Text className="pb-2 text-center text-xl font-bold text-gray-900">Chào mừng bạn</Text>

          {/* Google */}
          <TouchableOpacity className="mb-5 flex-row items-center justify-center rounded-lg border border-gray-200 py-3.5">
            <GoogleIcon />
            <Text className="text-base font-medium text-gray-700">Tiếp tục với Google</Text>
          </TouchableOpacity>

          {/* Hoặc */}
          <View className="mb-5 flex-row items-center">
            <View className="h-px flex-1 bg-gray-200" />
            <Text className="mx-4 text-xs uppercase tracking-widest text-gray-400">Hoặc</Text>
            <View className="h-px flex-1 bg-gray-200" />
          </View>

          {/* Tên đăng nhập */}
          <View className="mb-4">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Tên Đăng Nhập
            </Text>
            <TextInput
              className="rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900"
              placeholder="Username"
              placeholderTextColor="#9ca3af"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Giới tính */}
          <View className="mb-4">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Giới Tính
            </Text>
            <View className="flex-row gap-3">
              {/* Nam */}
              <TouchableOpacity
                className="flex-1 flex-row items-center rounded-lg border border-gray-300 px-4 py-3"
                onPress={() => setGender('Nam')}>
                <View
                  className={`mr-2 h-4 w-4 items-center justify-center rounded-full border-2 ${gender === 'Nam' ? 'border-black' : 'border-gray-400'}`}>
                  {gender === 'Nam' && <View className="h-2 w-2 rounded-full bg-black" />}
                </View>
                <Text className="text-base text-gray-900">Nam</Text>
              </TouchableOpacity>

              {/* Nữ */}
              <TouchableOpacity
                className="flex-1 flex-row items-center rounded-lg border border-gray-300 px-4 py-3"
                onPress={() => setGender('Nữ')}>
                <View
                  className={`mr-2 h-4 w-4 items-center justify-center rounded-full border-2 ${gender === 'Nữ' ? 'border-black' : 'border-gray-400'}`}>
                  {gender === 'Nữ' && <View className="h-2 w-2 rounded-full bg-black" />}
                </View>
                <Text className="text-base text-gray-900">Nữ</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Địa chỉ Email */}
          <View className="mb-4">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Địa Chỉ Email
            </Text>
            <TextInput
              className="rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900"
              placeholder="name@gmail.com"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Mật khẩu */}
          <View className="mb-4">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Mật Khẩu
            </Text>
            <View className="flex-row items-center rounded-lg border border-gray-300 px-4">
              <TextInput
                className="flex-1 py-3 text-base text-gray-900"
                placeholder="••••••••"
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

          {/* Xác nhận mật khẩu */}
          <View className="mb-5">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Xác Nhận Mật Khẩu
            </Text>
            <View className="flex-row items-center rounded-lg border border-gray-300 px-4">
              <TextInput
                className="flex-1 py-3 text-base text-gray-900"
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} className="p-1">
                <EyeIcon visible={showConfirm} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Checkbox đồng ý */}
          {/* <TouchableOpacity
            className="mb-8 flex-row items-start"
            onPress={() => setAgreed(!agreed)}
            activeOpacity={0.8}>
            <View
              className={`mr-2 mt-0.5 h-4 w-4 items-center justify-center rounded border ${agreed ? 'border-black bg-black' : 'border-gray-400'}`}>
              {agreed && <Text className="text-xs leading-none text-white">✓</Text>}
            </View>
            <Text className="flex-1 text-sm text-gray-500">
              Tôi đồng ý với{' '}
              <Text className="font-semibold text-black underline">
                chính sách và điều khoản của ứng dụng
              </Text>
            </Text>
          </TouchableOpacity> */}

          {/* Nút đăng ký */}
          <TouchableOpacity
            className="items-center rounded-lg bg-black py-4"
            onPress={handleRegister}
            activeOpacity={0.85}>
            <Text className="text-base font-bold uppercase text-white">Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
