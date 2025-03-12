import { Card } from "@/components/card";
import { SummaryHeader } from "@/components/summary_header";
import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function Index() {
  const router = useRouter();

  console.log("Página - Home");

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 40, gap: 40 }}>
      <SummaryHeader />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
        <Card
          iconId={""}
          name={"Conta 1"}
          value={107}
          vence={"2025-03-20"}
          bill_status={"Pendente"}
          onToggleStatus={() => {}}
        />
        <Card
          iconId={""}
          name={"Conta 1"}
          value={107}
          vence={"2025-03-13"}
          bill_status={"Pendente"}
          onToggleStatus={() => {}}
        />
        <Card
          iconId={""}
          name={"Conta 1"}
          value={107}
          vence={"2025-03-13"}
          bill_status={"Pendente"}
          onToggleStatus={() => {}}
        />
        <Card
          iconId={""}
          name={"Conta 1"}
          value={107}
          vence={"2025-03-13"}
          bill_status={"Pago"}
          onToggleStatus={() => {}}
        />
        <Card
          iconId={""}
          name={"Conta 1"}
          value={107}
          vence={"2025-03-13"}
          bill_status={"Atrasado"}
          onToggleStatus={() => {}}
        />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          router.push("/create-bill/create-bill");
        }}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: colors.green.base,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
