import { Stack } from "expo-router";
import { WalletUiDropdown } from "@/components/solana/wallet-ui-dropdown";

const data = Array.from({ length: 20 }, (_, i) => ({
  id: i.toString(),
  title: `Item ${i + 1}`,
}));

export default function ScrollLayout() {
    return <Stack screenOptions={{headerTitle: "Scroll", headerRight: () => <WalletUiDropdown />}}>
        <Stack.Screen name="index" />
    </Stack>
}
