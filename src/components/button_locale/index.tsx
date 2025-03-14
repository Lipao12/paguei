import { useTranslation } from "react-i18next";
import { Image, PressableProps, TouchableOpacity } from "react-native";
import { s } from "./style";

type Props = PressableProps & {
  toggleLanguage: () => void;
};

export function ButtonLocale({ toggleLanguage }: Props) {
  const { i18n } = useTranslation();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={s.imageButton}
      onPress={toggleLanguage}
    >
      <Image
        source={
          i18n.language === "pt"
            ? require("@/assets/brasilia.png")
            : require("@/assets/usa.png")
        }
        style={s.image}
      />
    </TouchableOpacity>
  );
}
