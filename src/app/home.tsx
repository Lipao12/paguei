import { Card } from "@/components/card";
import { EmptyState } from "@/components/empty_state";
import { SummaryHeader } from "@/components/summary_header";
import { loadBills } from "@/services/bill";
import { colors } from "@/styles/colors";
import { Bill } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  console.log("Página - Home");
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);

  console.log(selectedMonth);

  /*useEffect(() => {
    async function loadBills() {
      const storedBills = await AsyncStorage.getItem("bills");
      if (storedBills) {
        setBills(JSON.parse(storedBills));
      }
      console.log(storedBills);
    }
    loadBills();
  }, []);*/

  useFocusEffect(
    useCallback(() => {
      const filterBillsByMonth = (
        bills: Bill[],
        targetMonth: number
      ): Bill[] => {
        return bills.filter((bill) => {
          const dueDate = new Date(bill.dueDate); // Converte a dueDate (string) para Date
          return dueDate.getMonth() === targetMonth; // Filtra pelo mês
        });
      };

      async function fetchData() {
        const storedBills = await loadBills(); // Buscar do AsyncStorage ou API
        const filtered = filterBillsByMonth(storedBills, selectedMonth);
        setBills(filtered);
      }

      fetchData();
    }, [])
  );

  async function handleDeleteBill(id: string) {
    try {
      const updatedBills = bills.filter((bill) => bill.id !== id);
      setBills(updatedBills); // Atualiza o estado imediatamente

      await AsyncStorage.setItem("bills", JSON.stringify(updatedBills));
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
    }
  }

  console.log(bills.length);

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 40, gap: 40 }}>
      <SummaryHeader onSelectMounth={setSelectedMonth} />
      <View style={{ paddingHorizontal: 16, gap: 10, flex: 1 }}>
        {bills.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={bills}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card
                key={item.id}
                id={item.id}
                name={item.name}
                value={item.amount.toFixed(2)}
                vence={item.dueDate}
                bill_status={item.status}
                onDelete={() => handleDeleteBill(item.id)}
                onToggleStatus={() => {}}
              />
            )}
          />
        )}
      </View>

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
