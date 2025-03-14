import "@/locales/i18n";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";
import { ButtonLocale } from "../button_locale";
import { s } from "./style";

export function Welcome() {
  const { t, i18n } = useTranslation("onboarding");
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "pt" : "en";
    i18n.changeLanguage(newLang);
  };
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Image source={require("@/assets/logo2.png")} style={s.logo} />
        <ButtonLocale toggleLanguage={toggleLanguage} />
      </View>
      <Text style={s.title}>{t("header.title")}</Text>
      <Text style={s.subtitle}>{t("header.subtitle")}</Text>
    </View>
  );
}
