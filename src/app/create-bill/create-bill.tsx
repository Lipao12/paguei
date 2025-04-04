import { Button } from "@/components/button";
import i18n from "@/locales/i18n";
import { storeNotificationId } from "@/services/bill";
import { scheduleBillNotifications } from "@/services/not";
import { colors } from "@/styles/colors";
import { Bill } from "@/types"; // Importe o novo type
import AsyncStorage from "@react-native-async-storage/async-storage";
import { default as DateTimePicker } from "@react-native-community/datetimepicker";
import { IconArrowLeft, IconCalendarSearch } from "@tabler/icons-react-native";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, Switch, Text, TextInput, View } from "react-native";

async function scheduleDueDateNotification(bill: Bill) {
  const existingNotificationId = await getNotificationId(bill.id);
  if (existingNotificationId) {
    console.log(`Notificação já agendada para a conta ${bill.id}. Pulando.`);
    return;
  }

  const dueDate = new Date(bill.dueDate);
  const today = new Date();

  let trigger;
  let content;

  if (today > dueDate) {
    const notificationDate = new Date(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      20, // Hora
      5, // Minuto
      0 // Segundo
    );
    if (today > notificationDate) {
      notificationDate.setDate(notificationDate.getDate() + 1); // Agenda para amanhã
    }
    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: notificationDate,
    };
    content = {
      title: "Teste",
      body: `A conta "${bill.name}" venceu!`,
      sound: "default",
      data: { billId: bill.id },
    };
  } else {
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(reminderDate.getDate() - 1);
    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
    };
    content = {
      title: "Lembrete de Pagamento",
      body: `A conta "${bill.name}" vence amanhã!`,
      sound: "default",
      data: { billId: bill.id },
    };
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content,
    trigger,
  });

  // Armazena o ID de notificação com o ID da conta
  await storeNotificationId(bill.id, notificationId);
}

export default function RegisterBill() {
  console.log("Page - Create Bill");
  const { t } = useTranslation("newbill");
  const router = useRouter();
  const { control, handleSubmit, reset, setValue } = useForm<Bill>();
  const [loading, setLoading] = useState(false);
  //const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleDateChange = (_: any, date: Date | undefined) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setValue("dueDate", date.toISOString()); //({ dueDate: date.toISOString() });
    }
  };

  async function scheduleDueDateNotification(bill: Bill) {
    if (bill.dueDate) {
      const dueDate = new Date(bill.dueDate); // Data de vencimento
      const reminderDate = new Date(
        dueDate.getTime() - 3 * 24 * 60 * 60 * 1000
      ); // 3 dias antes da dueDate
      const today = new Date(); // Data atual

      console.log("Data de vencimento: ", dueDate);
      console.log("Data do lembrete (3 dias antes): ", reminderDate);

      // Verifica se a data do lembrete ainda não passou
      if (reminderDate > today) {
        // Define a hora e os minutos da notificação (exemplo: 12:11)
        const notificationDate = new Date(
          reminderDate.getFullYear(),
          reminderDate.getMonth(),
          reminderDate.getDate(),
          12, // Hora (12 para 12:00)
          13, // Minutos (11 para 12:11)
          0 // Segundos
        );

        console.log("Data da Notificação: ", notificationDate);

        // Define o objeto trigger corretamente
        const trigger: Notifications.DateTriggerInput = {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: notificationDate.getTime(), // Timestamp em milissegundos
        };

        // Agenda a notificação
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Lembrete de Pagamento",
            body: `A conta "${bill.name}" vence em 3 dias!`,
            sound: "default",
            data: { billId: bill.id },
          },
          trigger,
        });

        console.log(
          `Notificação agendada para a conta "${bill.name}" em ${notificationDate}`
        );
      } else {
        console.log("A data do lembrete já passou. Notificação não agendada.");
      }
    } else {
      console.log("Data de vencimento não definida. Notificação não agendada.");
    }
  }

  async function onSubmit(data: Bill) {
    setLoading(true);
    console.log(data);
    try {
      // Verifica se a conta é recorrente
      if (data.recurring) {
        const year = selectedDate.getFullYear();
        const startMonth = selectedDate.getMonth();

        const recurringBills: Bill[] = [];

        for (let month = startMonth; month <= 11; month++) {
          const dueDate = new Date(year, month, selectedDate.getDate());

          const newBill: Bill = {
            ...data,
            id: String(Date.now() + month),
            paid: false,
            status: "pending",
            createdAt: new Date().toISOString(),
            dueDate: dueDate.toISOString(),
          };

          recurringBills.push(newBill); // Adiciona a conta ao array
        }
        recurringBills.forEach((bill) => scheduleBillNotifications(bill));

        const storedBills = await AsyncStorage.getItem("bills");
        const bills: Bill[] = storedBills ? JSON.parse(storedBills) : [];

        const updatedBills = [...bills, ...recurringBills];

        await AsyncStorage.setItem("bills", JSON.stringify(updatedBills));
      } else {
        const newBill: Bill = {
          ...data,
          id: String(Date.now()),
          paid: false,
          status: "pending",
          createdAt: new Date().toISOString(),
          dueDate: selectedDate.toISOString(),
        };

        console.log(data);

        const storedBills = await AsyncStorage.getItem("bills");
        const bills: Bill[] = storedBills ? JSON.parse(storedBills) : [];

        const updatedBills = [...bills, newBill];

        await scheduleBillNotifications(newBill);

        await AsyncStorage.setItem("bills", JSON.stringify(updatedBills));
        scheduleDueDateNotification(newBill);
      }

      Alert.alert(t("success"), t("successText"));
      reset();
      router.back();
    } catch (error) {
      Alert.alert(t("error"), t("errorText"));
    } finally {
      setLoading(false);
    }
  }

  const formateData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString(i18n.language, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <View style={s.container}>
      <View style={[s.header]}>
        <Button style={s.buttonBack} onPress={handleBack}>
          <Button.Icon icon={IconArrowLeft} />
        </Button>
        <Text style={s.title}>{t("title")}</Text>
      </View>

      <View style={s.formContainer}>
        <Text style={s.label}>{t("nameLabel")}</Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: t("nameRequired") }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextInput
                style={s.input}
                onChangeText={onChange}
                value={value}
              />
              {error && <Text style={s.errorText}>{error.message}</Text>}
            </>
          )}
        />

        <Text style={s.label}>{t("amountLabel")}</Text>
        <Controller
          control={control}
          name="amount"
          rules={{ required: t("amountRequired") }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextInput
                style={s.input}
                onChangeText={(text) => onChange(parseFloat(text))}
                value={value ? value.toString() : ""}
                keyboardType="numeric"
              />
              {error && <Text style={s.errorText}>{error.message}</Text>}
            </>
          )}
        />

        <Text style={s.label}>{t("dueDateLabel")}</Text>
        <View
          style={s.dateContainer}
          onTouchEnd={() => setShowDatePicker(true)}
        >
          <Text style={s.dateText}>{formateData(selectedDate.toString())}</Text>
          <IconCalendarSearch color={colors.gray[400]} />
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <View style={s.switchContainer}>
          <Text style={s.label}>{t("recurringLabel")}</Text>
          <Controller
            control={control}
            name="recurring"
            render={({ field: { onChange, value } }) => (
              <Switch
                value={value || false}
                onValueChange={onChange}
                trackColor={{ false: "#767577", true: colors.green.base }}
                thumbColor={value ? "#FFF" : "#FFF"}
              />
            )}
          />
        </View>

        {/*<View style={s.switchContainer}>
          <Text style={s.label}>{t("reminderLabel")}</Text>
          <Controller
            control={control}
            name="reminderAt"
            render={({ field: { onChange, value } }) => (
              <Switch
                value={!!value}
                //onValueChange={(enabled) =>
                //  onChange(enabled ? new Date().toISOString() : "")
                //}
                onValueChange={(enabled) => {
                  if (enabled) {
                    const dueDate = new Date(selectedDate);
                    const reminderDate = new Date(
                      dueDate.getTime() - 3 * 24 * 60 * 60 * 1000 // 3 dias antes
                    );
                    onChange(reminderDate.toISOString());
                  } else {
                    onChange("");
                  }
                }}
                trackColor={{ false: "#767577", true: colors.green.base }}
                thumbColor={value ? "#FFF" : "#FFF"}
              />
            )}
          />
        </View>*/}

        <Button
          style={s.button}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          <Button.Title>
            <Text style={s.buttonText}>
              {loading ? t("saving") : t("buttonSubmit")}
            </Text>
          </Button.Title>
        </Button>
      </View>
    </View>
  );
}

import { StyleSheet } from "react-native";

const s = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    paddingBottom: 20,
    justifyContent: "center",
  },
  header: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 15,
    padding: 20,
    backgroundColor: colors.green.light,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.gray[200],
    marginBottom: 20,
    textAlign: "center",
  },
  buttonBack: {
    width: 40,
    height: 40,
    backgroundColor: colors.gray[200],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.green.base,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  label: {
    fontSize: 14,
    marginBottom: 2,
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    marginRight: 100,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: colors.gray[600],
  },
});
