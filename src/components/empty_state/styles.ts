import { colors } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
    container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
          },
    title:{
            fontSize: 20,
            fontWeight: "bold",
            color: colors.gray[600],
            marginTop: 16,
        },
    subtitle:{
              fontSize: 16,
              color: colors.gray[500],
              textAlign: "center",
              marginTop: 8,
            }
})