import { colors } from "@/styles/colors";
import { IconCalendarOff } from "@tabler/icons-react-native";
import React from "react";
import { Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export function EmptyState() {
  return (
    <Animated.View
      entering={FadeIn.duration(500).springify()}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
      }}
    >
      <IconCalendarOff color={colors.gray[500]} size={48} />
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: colors.gray[600],
          marginTop: 16,
        }}
      >
        Nenhuma conta neste mês!
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: colors.gray[500],
          textAlign: "center",
          marginTop: 8,
        }}
      >
        Você não possui contas a pagar neste período. Relaxe e aproveite! 😃
      </Text>
    </Animated.View>
  );
}
