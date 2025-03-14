import { colors } from "@/styles/colors";
import { IconCalendarOff } from "@tabler/icons-react-native";
import React from "react";
import { Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { s } from "./styles";

export function EmptyState() {
  return (
    <Animated.View
      entering={FadeIn.duration(500).springify()}
      style={s.container}
    >
      <IconCalendarOff color={colors.gray[500]} size={48} />
      <Text style={s.title}>Nenhuma conta neste mês!</Text>
      <Text style={s.subtitle}>
        Você não possui contas a pagar neste período. Relaxe e aproveite! 😃
      </Text>
    </Animated.View>
  );
}
