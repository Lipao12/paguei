import "@/locales/i18n";
import {
  IconBell,
  IconCircleCheck,
  IconClipboardList,
} from "@tabler/icons-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Step } from "../step";
import { s } from "./style";

export function Steps() {
  const { t, i18n } = useTranslation("onboarding");

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "pt" : "en";
    i18n.changeLanguage(newLang);
  };
  return (
    <View style={s.container}>
      <Step
        icon={IconClipboardList}
        title={t("step1.title")} //"Cadastre suas contas"
        description={t("step1.description")}
      />
      <Step
        icon={IconBell}
        title={t("step2.title")}
        description={t("step2.description")}
      />
      <Step
        icon={IconCircleCheck}
        title={t("step3.title")}
        description={t("step3.description")}
      />
    </View>
  );
}
