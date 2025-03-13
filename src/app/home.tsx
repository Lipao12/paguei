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
  const [selectedFilter, setSelectedFilter] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [toPayAmount, setToPayAmount] = useState(0);

  console.log("Mes selecionado: ", selectedMonth);

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

      const filterByPaid = (bills: Bill[], filter: boolean): Bill[] => {
        if (!filter) return bills;

        return bills.filter((bill) => {
          return !("Pago" === bill.status);
        });
      };

      async function fetchData() {
        const storedBills = await loadBills(); // Buscar do AsyncStorage ou API
        const filtered = filterByPaid(
          filterBillsByMonth(storedBills, selectedMonth),
          selectedFilter
        );

        console.log("Filtrado: ", filtered);

        // Atualizando status das contas conforme a data de vencimento
        const updatedBills = filtered.map((bill) => {
          const dueDate = new Date(bill.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          console.log(dueDate, today);

          // Se a data de vencimento for menor que hoje e a conta não for paga, marque como "Atrasado"
          if (dueDate < today && bill.status !== "Pago") {
            return {
              ...bill,
              status: "Atrasado",
            };
          }

          return bill;
        });

        setBills(updatedBills);

        /*let total = 0;
        let paid = 0;
        let toPay = 0;

        filtered.forEach((bill) => {
          total += bill.amount;
          if (bill.status === "Pago") {
            paid += bill.amount;
          } else {
            toPay += bill.amount;
          }
        });

        setTotalAmount(total);
        setPaidAmount(paid);
        setToPayAmount(toPay);*/
      }

      fetchData();
    }, [selectedMonth, selectedFilter])
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

  const toggleBillStatus = (id: string) => {
    const updatedBills = bills.map((bill) =>
      bill.id === id
        ? {
            ...bill,
            status: bill.status != "Pago" ? "Pago" : "Pendente",
          }
        : bill
    );
    setBills(updatedBills);

    AsyncStorage.setItem("bills", JSON.stringify(updatedBills));
  };

  console.log("Qnt: ", bills.length);
  console.log("Filter: ", selectedFilter);

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 40, gap: 40 }}>
      <View style={{ flex: 1, gap: 10 }}>
        <SummaryHeader
          onSelectFilter={setSelectedFilter}
          onSelectMounth={setSelectedMonth}
          total={totalAmount}
          paid={paidAmount}
          toPay={toPayAmount}
        />
        {bills.length === 0 ? (
          <>
            <EmptyState />
          </>
        ) : (
          <FlatList
            style={{ paddingHorizontal: 16 }}
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
                onToggleStatus={() => toggleBillStatus(item.id)}
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
