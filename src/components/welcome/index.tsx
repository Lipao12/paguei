import "@/locales/i18n";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";
import { s } from "./style";

export function Welcome() {
  const { t } = useTranslation("onboarding");
  return (
    <View>
      <Image source={require("@/assets/logo2.png")} style={s.logo} />
      <Text style={s.title}>{t("header.title")}</Text>
      <Text style={s.subtitle}>{t("header.subtitle")}</Text>
    </View>
  );
}
