import { colors, fontFamily } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  container: {
    backgroundColor: colors.gray[100],
    borderWidth: 2,
    borderColor: colors.gray[100],
    borderRadius: 8,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 15,
    marginVertical: 8, // Para dar mais espaçamento entre os cards
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  infos_container: {
    flexDirection: "column",
    flexGrow: 1,
    gap: 6,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: colors.gray[600],
  },
  moneyText: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
    color: colors.green.base,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    color: colors.gray[500],
    marginTop: 6,
  },
  containerSelected: {
    backgroundColor: colors.green.base,
    borderColor: colors.green.base,
  },
  nameSelected: {
    color: colors.gray[100],
  },
  container_action_button:{
    flexDirection: "column",
    justifyContent:"space-between",
    paddingVertical: 10,
  },
  action_buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    marginVertical: "auto",
  },
  buttonAction: {
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.gray[200],
    justifyContent: "center",
    alignItems: "center",
  },
});
