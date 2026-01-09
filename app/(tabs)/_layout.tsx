import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#7CB342',
        tabBarInactiveTintColor: isDark ? '#9BA1A6' : '#687076',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: isDark ? 'rgba(21, 23, 24, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 30 : 26} 
              name="house.fill" 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 30 : 26} 
              name="map.fill" 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Recorridos',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 30 : 26} 
              name="paperplane.fill" 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
