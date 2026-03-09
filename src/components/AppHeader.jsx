import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * AppHeader — Header dùng chung toàn hệ thống
 *
 * Props (truyền qua route.params.headerOptions hoặc navigation.setOptions):
 * - title         (string)    : Tiêu đề ở giữa
 * - showBack      (boolean)   : Hiện nút back (mặc định: true nếu có thể goBack)
 * - onBack        (function)  : Override hành động back
 * - rightElement  (ReactNode) : Phần tử bên phải (icon, nút, ...)
 * - showBorder    (boolean)   : Hiện border bottom (mặc định: true)
 */
export default function AppHeader({ title, showBack, onBack, rightElement, showBorder = true }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const canGoBack = navigation.canGoBack();
  const shouldShowBack = showBack !== undefined ? showBack : canGoBack;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View
      style={{ paddingTop: insets.top }}
      className={`bg-white ${showBorder ? 'border-b border-gray-100' : ''}`}>
      <View className="h-12 flex-row items-center px-4">
        {/* Left — Back button */}
        <View className="w-10">
          {shouldShowBack && (
            <TouchableOpacity onPress={handleBack} activeOpacity={0.7} className="-ml-1 p-1">
              <Text style={{ fontSize: 28, lineHeight: 30, color: '#111' }}>‹</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Center — Title */}
        <Text className="flex-1 text-center text-base font-bold text-gray-900" numberOfLines={1}>
          {title ?? ''}
        </Text>

        {/* Right — custom element hoặc placeholder giữ layout */}
        <View className="w-10 items-end">{rightElement ?? null}</View>
      </View>
    </View>
  );
}
