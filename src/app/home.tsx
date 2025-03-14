import { Card } from "@/components/card";
import { EmptyState } from "@/components/empty_state";
import { SummaryHeader } from "@/components/summary_header";
import { loadBills } from "@/services/bill";
import NotificationService from "@/services/notifications";
import { colors } from "@/styles/colors";
import { Bill } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

async function scheduleDueDateNotification(bill: Bill) {
  const dueDate = new Date(bill.dueDate);
  const today = new Date();

  if (today > dueDate) {
    const notificationDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      20, // Hora (20 para 20:00)
      9, // Minutos (5 para 20:05)
      0 // Segundos
    );
    console.log("Data da Notificação: ", notificationDate);
    if (today > notificationDate) {
      console.log("O horário de 20:05 já passou hoje. Agendando para amanhã.");
      notificationDate.setDate(notificationDate.getDate()); // Agenda para o mesmo horário no dia seguinte
    }

    // Define o objeto trigger corretamente
    const trigger: Notifications.DateTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: notificationDate.getTime(), // Timestamp em milissegundos
    };

    // Agenda a notificação
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Teste",
        body: `A conta "${bill.name}" vence hoje às 20:09!`,
        sound: "default",
        data: { billId: bill.id },
      },
      trigger,
    });

    console.log(
      `Notificação agendada para a conta "${bill.name}" em ${notificationDate}`
    );
  }

  if (dueDate > today) {
    const reminderDate = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000); // 1 dia antes
    console.log("Remid: ", reminderDate);

    const trigger: Notifications.DateTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate.getTime(), // Timestamp em milissegundos
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete de Pagamento",
        body: `A conta "${bill.name}" vence amanhã!`,
        sound: "default",
        data: { billId: bill.id },
      },
      trigger,
    });

    console.log(
      `Notificação agendada para a conta "${bill.name}" em ${reminderDate}`
    );
  }
}

export default function Index() {
  console.log("Página - Home");
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedFilter, setSelectedFilter] = useState(false);
  /*const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [toPayAmount, setToPayAmount] = useState(0);*/

  console.log("Mes selecionado: ", selectedMonth);

  /*useEffect(() => {
    async function loadBills() {
      await AsyncStorage.setItem("bills", JSON.stringify(updatedBills));
    }
    loadBills();
  }, []);*/

  const filterBillsByMonth = (bills: Bill[], targetMonth: number): Bill[] => {
    return bills.filter((bill) => {
      const dueDate = new Date(bill.dueDate);
      return dueDate.getMonth() === targetMonth;
    });
  };

  const filterByPaid = (bills: Bill[], filter: boolean): Bill[] => {
    if (!filter) return bills;
    return bills.filter((bill) => bill.status !== "Pago");
  };

  const updateBillStatus = (bills: Bill[]): Bill[] => {
    return bills.map((bill) => {
      const dueDate = new Date(bill.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate < today && bill.status !== "Pago") {
        return { ...bill, status: "Atrasado" };
      }
      return bill;
    });
  };

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        const storedBills = await loadBills();
        const updatedBills = updateBillStatus(storedBills);
        setBills(updatedBills);
      }

      fetchData();
    }, [])
  );

  const handleDeleteBill = async (id: string) => {
    try {
      const updatedBills = bills.filter((bill) => bill.id !== id);
      setBills(updatedBills);
      await AsyncStorage.setItem("bills", JSON.stringify(updatedBills));
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
    }
  };

  const toggleBillStatus = async (id: string) => {
    const updatedBills = bills.map((bill) =>
      bill.id === id
        ? { ...bill, status: bill.status !== "Pago" ? "Pago" : "Pendente" }
        : bill
    );
    setBills(updatedBills);
    await AsyncStorage.setItem("bills", JSON.stringify(updatedBills));
  };

  const onSetNotifications = async (id: string) => {
    const updatedBills = bills.map((bill) =>
      bill.id === id ? { ...bill, isNotifing: !bill.isNotifing } : bill
    );
    setBills(updatedBills);
    await AsyncStorage.setItem("bills", JSON.stringify(updatedBills));
  };

  const filteredBills = filterByPaid(
    filterBillsByMonth(bills, selectedMonth),
    selectedFilter
  );
  console.log("Qnt: ", bills.length);
  console.log("Filter: ", selectedFilter);

  useEffect(() => {
    const initializeNotifications = async () => {
      console.log("IDsk");
      // Solicita permissão para notificações
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Você precisa permitir notificações para receber lembretes!");
        return;
      }

      // Configura o canal de notificação (Android)
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("bill_reminders", {
          name: "Lembretes de Contas",
          importance: Notifications.AndroidImportance.HIGH,
          sound: "default",
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF0000",
        });
      }

      // Carrega as contas e agenda notificações
      const loadedBills = await loadBills();
      setBills(loadedBills);

      loadedBills.forEach((bill) => {
        if (bill.status !== "Pago") {
          scheduleDueDateNotification(bill);
        }
      });
    };

    initializeNotifications();
  }, []);

  useEffect(() => {
    const initializeNotifications = async () => {
      await NotificationService.configureNotificationChannel();
      const hasPermission = await NotificationService.requestPermissions();

      if (hasPermission) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Lembrete de Pagamento",
            body: "A conta de luz vence amanhã!",
            sound: "default",
          },
          trigger: {
            date: new Date(Date.now() + 120000), // 1 minuto no futuro
          },
        });
      }
    };

    initializeNotifications();
  }, []);

  const handleScheduleNotification = async () => {
    const title = "Lembrete de Pagamento";
    const body = "A conta de luz vence amanhã!";
    const date = new Date(Date.now() + 60000); // 1 minuto no futuro

    await NotificationService.scheduleNotification(title, body, date);
  };

  const handleCancelAllNotifications = async () => {
    await NotificationService.cancelAllNotifications();
  };

  useEffect(() => {
    // Carrega as contas e agenda notificações
    const fetchBills = async () => {
      const loadedBills = await loadBills();
      setBills(loadedBills);

      // Agenda notificações para cada conta
      loadedBills.forEach((bill) => {
        const dueDate = new Date(bill.dueDate);
        const reminderDate = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000); // 1 dia antes

        NotificationService.scheduleNotification(
          "Lembrete de Pagamento",
          `A conta "${bill.name}" vence amanhã!`,
          reminderDate
        );
      });
    };

    fetchBills();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 40, gap: 40 }}>
      <View style={{ flex: 1, gap: 10 }}>
        <SummaryHeader
          onSelectFilter={setSelectedFilter}
          onSelectMounth={setSelectedMonth}
        />
        {filteredBills.length === 0 ? (
          <>
            <EmptyState />
          </>
        ) : (
          <FlatList
            style={{ paddingHorizontal: 16 }}
            data={filteredBills}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card
                key={item.id}
                id={item.id}
                name={item.name}
                value={item.amount.toFixed(2)}
                vence={item.dueDate}
                bill_status={item.status}
                isNotificationsEnabled={!(item.reminderAt === "")}
                onDelete={() => handleDeleteBill(item.id)}
                onSetNotifications={() => onSetNotifications(item.id)}
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
