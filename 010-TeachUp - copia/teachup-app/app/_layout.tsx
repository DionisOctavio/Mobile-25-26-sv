import { Stack } from "expo-router";
import BottomNav from "../components/BottomNav";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <BottomNav />
    </SafeAreaView>
  );
}
