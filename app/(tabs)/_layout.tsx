import LogoIcon from '@/components/logo'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {
  // check for the user is present or not
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* The index redirects to the account screen */}
      <Tabs.Screen name="index" options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="wallet.pass.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="scroll"
        options={{
          title: 'Scroll',
          // tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="scroll.fill" color={color} />,
          tabBarIcon: () => <LogoIcon />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
      <Tabs.Screen name="debug" options={{ title: 'Debug', tabBarIcon: ({color}) => <UiIconSymbol size={28} name="building.2.fill" color={color} /> }} />
    </Tabs>
  )
}
