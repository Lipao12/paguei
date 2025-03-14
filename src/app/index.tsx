import { Button } from "@/components/button";
import { Steps } from "@/components/steps";
import { Welcome } from "@/components/welcome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export default function Index() {
  console.log("Página - Intex");

  const { t } = useTranslation("onboard");

  useEffect(() => {
    const checkFirstAccess = async () => {
      try {
        const first = await AsyncStorage.getItem("first");
        if (first) {
          router.navigate("/home");
        }
      } catch (error) {
        console.error("Erro ao acessar o AsyncStorage:", error);
      }
    };

    checkFirstAccess();
  }, []);

  return (
    <View style={{ flex: 1, padding: 40, gap: 40 }}>
      <Welcome />
      <Steps />
      <Button
        onPress={async () => {
          try {
            await AsyncStorage.setItem(
              "first",
              JSON.stringify({ first: true })
            );
            router.navigate("/home");
          } catch (error) {
            console.error("Erro ao salvar no AsyncStorage:", error);
          }
        }}
      >
        <Button.Title>{t("button")}</Button.Title>
      </Button>
    </View>
  );
}
