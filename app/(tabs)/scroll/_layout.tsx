import { Stack } from 'expo-router'

const data = Array.from({ length: 20 }, (_, i) => ({
  id: i.toString(),
  title: `Item ${i + 1}`,
}))

export default function ScrollLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  )
}
