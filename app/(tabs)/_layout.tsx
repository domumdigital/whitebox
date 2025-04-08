import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: Platform.OS === 'web' ? 'none' : 'flex',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: '/',
        }}
      />
    </Tabs>
  );
}