import { colors } from "@/styles/colors"; // Arquivo de cores globais
import { fontFamily } from "@/styles/font-family";
import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: colors.green.light,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  containerTitle:{
    alignItems:"center",
    flexGrow: 1,
  },
  headerTitle:{
    fontSize: 26,
    fontFamily: fontFamily.bold,
    color: colors.gray[200],
    
  },
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
  headerRow: {
    flexDirection: "row",
    width:"100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15, 
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.gray[200],
    textTransform: "uppercase",
  },
  filterContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  activeFilter: {
    backgroundColor: colors.green.base,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.green.dark,
    textTransform: "capitalize",
  },
  activeText: {
    color: "#FFF",
  },
  valuesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 15,
  },
  valueBox: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: colors.gray[400],
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.gray[600],
  },
});
