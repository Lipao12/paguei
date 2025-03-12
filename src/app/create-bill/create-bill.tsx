import { Button } from "@/components/button";
import { colors } from "@/styles/colors";
import { Bill } from "@/types"; // Importe o novo type
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { IconArrowLeft } from "@tabler/icons-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Switch, Text, TextInput, View } from "react-native";
import { s } from "./styles";

export default function RegisterBill() {
  console.log("Page - Create Bill");
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm<Bill>();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  /*const [bill, setBill] = useState<Bill>({
    id: "",
    name: "",
    category: "",
    amount: 0,
    dueDate: new Date().toISOString(),
    description: "",
    paid: false,
    reminderAt: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });*/

  const handleBack = () => {
    router.back();
  };

  /*const handleChange = (
    field: keyof Bill,
    value: string | number | boolean
  ) => {
    setBill({ ...bill, [field]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange("dueDate", selectedDate.toISOString());
    }
  };*/

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    setShowDatePicker(false);
    if (selectedDate) {
      reset({ dueDate: selectedDate.toISOString() });
    }
  };

  /*async function onSubmit(data: Omit<Bill, "id" | "createdAt" | "updatedAt">) {
    setLoading(true);
    try {
      const newBill: Bill = {
        ...data,
        id: String(Date.now()),
        paid: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(`bill-${newBill.id}`, JSON.stringify(newBill));
      Alert.alert("Sucesso", "Conta cadastrada com sucesso!");
      reset();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a conta.");
    } finally {
      setLoading(false);
    }
  }*/
  async function onSubmit(data: Bill) {
    setLoading(true);
    try {
      const newBill: Bill = {
        ...data,
        id: String(Date.now()),
        paid: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(`bill-${newBill.id}`, JSON.stringify(newBill));
      Alert.alert("Sucesso", "Conta cadastrada com sucesso!");
      reset();
      router.back(); // Volta para a tela anterior após salvar
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a conta.");
    } finally {
      setLoading(false);
    }
  }

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
        <Controller
          control={control}
          name="dueDate"
          rules={{ required: "Informe a data de vencimento" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <Button onPress={() => setShowDatePicker(true)}>
                <Button.Title>Selecionar Data</Button.Title>
              </Button>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date(value || new Date())}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
              {error && <Text style={s.errorText}>{error.message}</Text>}
            </>
          )}
        />

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
