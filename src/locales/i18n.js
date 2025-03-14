import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCard from "./en/card.json";
import enEmpty from "./en/empty.json";
import enNewBill from "./en/newbill.json";
import enOnboarding from "./en/onboarding.json";
import enSummary from "./en/summary.json";
import ptCard from "./pt/card.json";
import ptEmpty from "./pt/empty.json";
import ptNewBill from "./pt/newbill.json";
import ptOnboarding from "./pt/onboarding.json";
import ptSummary from "./pt/summary.json";

const LANG_STORAGE_KEY = "@app_language";

const resources = {
  pt: {
    onboarding: ptOnboarding,
    summary: ptSummary,
    empty: ptEmpty,
    card: ptCard,
    newbil: ptNewBill,
  },
  en: {
    onboarding: enOnboarding,
    summary: enSummary,
    empty: enEmpty,
    card: enCard,
    newbil: enNewBill,
  }
};

const getStoredLanguage = async () => {
  const savedLanguage = await AsyncStorage.getItem(LANG_STORAGE_KEY);
  return savedLanguage || (Localization.locale.startsWith("pt") ? "pt" : "en");
};

getStoredLanguage().then((lng) => {
  i18n.init({
    resources,
    lng,
    fallbackLng: "pt",
    interpolation: { escapeValue: false },
  });
});

i18n.on("languageChanged", (lng) => {
  AsyncStorage.setItem(LANG_STORAGE_KEY, lng);
});

i18n.use(initReactI18next);

export default i18n;
