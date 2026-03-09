import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/screens/HomeScreen';
import LoginScreen from '@/screens/LoginScreen';
import SignupScreen from '@/screens/SignupScreen';
import PostDetailScreen from '@/screens/PostDetailScreen';
import AppHeader from '@/components/AppHeader';
import { TouchableOpacity, Text } from 'react-native';
import NotificationScreen from '@/screens/Notificationscreen';

const Stack = createNativeStackNavigator();

const makeHeader = ({ title, showBack, rightElement, showBorder } = {}) => ({
  header: () => (
    <AppHeader
      title={title}
      showBack={showBack}
      rightElement={rightElement}
      showBorder={showBorder}
    />
  ),
});

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />

      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          headerShown: true,
          ...makeHeader({ title: 'Thông báo', showBack: true }),
        }}
      />

      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{
          headerShown: true,
          ...makeHeader({
            title: 'Bài đăng',
            showBack: true,
            rightElement: (
              <TouchableOpacity>
                <Text style={{ fontSize: 16, color: '#555' }}>•••</Text>
              </TouchableOpacity>
            ),
          }),
        }}
      />
    </Stack.Navigator>
  );
}
