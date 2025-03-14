import { colors } from "@/styles/colors";
import { IconCalendarOff } from "@tabler/icons-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { s } from "./styles";

export function EmptyState() {
  const { t } = useTranslation("empty");
  return (
    <Animated.View
      entering={FadeIn.duration(500).springify()}
      style={s.container}
    >
      <IconCalendarOff color={colors.gray[500]} size={48} />
      <Text style={s.title}>{t("title")}</Text>
      <Text style={s.subtitle}>{t("subtitle")}</Text>
    </Animated.View>
  );
}
