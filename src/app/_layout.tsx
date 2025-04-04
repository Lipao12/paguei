import { Loading } from "@/components/loading";
import {
  configureNotifications,
  scheduleBillNotifications,
} from "@/services/not";
import { colors } from "@/styles/colors";
import { Bill } from "@/types";
import {
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
  useFonts,
} from "@expo-google-fonts/rubik";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  console.log("Página - Layout");
  const [fontsLoaded] = useFonts({
    Rubik_600SemiBold,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold,
  });

  useEffect(() => {
    configureNotifications();
  }, []);

  useEffect(() => {
    if (__DEV__) {
      console.log("Teste");
      const testBill: Bill = {
        id: "test",
        name: "Conta Teste",
        category: "Teste",
        amount: 100,
        dueDate: new Date(Date.now() + 60 * 1000).toISOString(), // 1 minuto
        paid: false,
        createdAt: new Date().toISOString(),
        recurring: false,
        status: "overdue",
        isNotifing: true,
      };

      scheduleBillNotifications(testBill);
    }
  }, []);

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      ></Stack>
    </GestureHandlerRootView>
  );
}
