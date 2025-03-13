import { Button } from "@/components/button";
import { colors } from "@/styles/colors";
import { Bill } from "@/types"; // Importe o novo type
import AsyncStorage from "@react-native-async-storage/async-storage";
import { default as DateTimePicker } from "@react-native-community/datetimepicker";
import { IconArrowLeft, IconCalendarSearch } from "@tabler/icons-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Switch, Text, TextInput, View } from "react-native";

export default function RegisterBill() {
  console.log("Page - Create Bill");
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm<Bill>();
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      reset({ dueDate: date.toISOString() });
    }
  };

  async function onSubmit(data: Bill) {
    setLoading(true);
    try {
      // Verifica se a conta é recorrente
      if (data.recurring) {
        const year = selectedDate.getFullYear(); // Ano da data selecionada
        const startMonth = selectedDate.getMonth(); // Mês da data selecionada

        // Array para armazenar todas as contas recorrentes
        const recurringBills: Bill[] = [];

        // Cria uma conta para cada mês, de startMonth até dezembro (mês 11)
        for (let month = startMonth; month <= 11; month++) {
          const dueDate = new Date(year, month, selectedDate.getDate()); // Data de vencimento para o mês atual

          const newBill: Bill = {
            ...data,
            id: String(Date.now() + month), // ID único para cada conta
            paid: false,
            status: "Pendente",
            createdAt: new Date().toISOString(),
            dueDate: dueDate.toISOString(), // Data de vencimento formatada
          };

          recurringBills.push(newBill); // Adiciona a conta ao array
        }

        // Contas já criadas
        const storedBills = await AsyncStorage.getItem("bills");
        const bills: Bill[] = storedBills ? JSON.parse(storedBills) : [];

        // Adiciona todas as contas recorrentes ao array existente
        const updatedBills = [...bills, ...recurringBills];

        // Salva de volta no AsyncStorage
        await AsyncStorage.setItem("bills", JSON.stringify(updatedBills));
      } else {
        // Se não for recorrente, cria apenas uma conta
        const newBill: Bill = {
          ...data,
          id: String(Date.now()),
          paid: false,
          status: "Pendente",
          createdAt: new Date().toISOString(),
          dueDate: selectedDate.toISOString(),
        };

        // Contas já criadas
        const storedBills = await AsyncStorage.getItem("bills");
        const bills: Bill[] = storedBills ? JSON.parse(storedBills) : [];

        const updatedBills = [...bills, newBill];

        // Salva de volta no AsyncStorage
        await AsyncStorage.setItem("bills", JSON.stringify(updatedBills));
      }

      Alert.alert("Sucesso", "Conta cadastrada com sucesso!");
      reset();
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a conta.");
    } finally {
      setLoading(false);
    }
  }

  const formateData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", {
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
        <Text style={s.title}>Crie Uma Nova Conta</Text>
      </View>

      <View style={s.formContainer}>
        <Text style={s.label}>Nome da Conta</Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: "Informe o nome da conta" }}
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

        <Text style={s.label}>Categoria</Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <TextInput style={s.input} onChangeText={onChange} value={value} />
          )}
        />

        <Text style={s.label}>Valor (R$)</Text>
        <Controller
          control={control}
          name="amount"
          rules={{ required: "Informe o valor" }}
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

        <Text style={s.label}>Data de Vencimento</Text>
        <View
          style={s.dateContainer}
          onTouchEnd={() => setShowDatePicker(true)}
        >
          <Text style={s.dateText}>{formateData(selectedDate.toString())}</Text>
          <IconCalendarSearch color={colors.gray[400]} />{" "}
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
          <Text style={s.label}>Recorrente</Text>
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

        <View style={s.switchContainer}>
          <Text style={s.label}>Receber Notificação</Text>
          <Controller
            control={control}
            name="reminderAt"
            render={({ field: { onChange, value } }) => (
              <Switch
                value={!!value}
                onValueChange={(enabled) =>
                  onChange(enabled ? new Date().toISOString() : "")
                }
                trackColor={{ false: "#767577", true: colors.green.base }}
                thumbColor={value ? "#FFF" : "#FFF"}
              />
            )}
          />
        </View>

        <Button
          style={s.button}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          <Button.Title>
            <Text style={s.buttonText}>
              {loading ? "Salvando..." : "Cadastrar"}
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
