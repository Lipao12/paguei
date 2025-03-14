import { colors } from "@/styles/colors"; // Arquivo de cores globais
import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  imageButton:{
    borderWidth: 2,
    borderColor: colors.gray[200],
    borderRadius: 50,
    overflow: 'hidden'
  },
  image:{
    width: 30, 
    height: 30
  },
});
