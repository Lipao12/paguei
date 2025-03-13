import { colors } from "@/styles/colors";
import {
  IconAlertCircle,
  IconCircleCheck,
  IconClock,
  IconTrash,
} from "@tabler/icons-react-native";
import { Alert, Pressable, PressableProps, Text, View } from "react-native";
import { s } from "./style";

type BillStatus = "Pendente" | "Pago" | "Atrasado";

type Props = PressableProps & {
  id: string;
  name: string;
  value: string;
  vence: string;
  bill_status: string;
  onToggleStatus: () => void;
  onDelete: () => void;
};

export function Card({
  id,
  name,
  value,
  vence,
  bill_status,
  onDelete,
  onToggleStatus,
  ...rest
}: Props) {
  // Função para calcular a diferença de dias
  const getDateDifference = (dateString: string) => {
    const currentDate = new Date();
    const dueDate = new Date(dateString);

    currentDate.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const timeDiff = dueDate.getTime() - currentDate.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convertendo para dias
    return dayDiff;
  };

  const daysUntilDue = getDateDifference(vence);

  const StatusIconMap: Record<BillStatus, any> = {
    Pendente: daysUntilDue <= 5 ? IconClock : null,
    Pago: IconCircleCheck,
    Atrasado: IconAlertCircle,
  };

  const statusColor: Record<BillStatus, string> = {
    Pendente: daysUntilDue <= 5 ? colors.orange.base : colors.gray[500],
    Pago: colors.green.base,
    Atrasado: colors.red.base,
  };

  const StatusIcon = StatusIconMap[bill_status];
  const statusColorValue = statusColor[bill_status];

  const ButtonStatusIcon = bill_status === "Pago" ? IconClock : IconCircleCheck;
  const ButtonstatusColor =
    bill_status === "Pago" ? colors.gray[400] : colors.green.base;
  const textValueColor =
    bill_status === "Atrasado" ? colors.red.base : colors.green.base;

  const formateData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
  };

  const confirmDelete = (id: string) => {
    Alert.alert("Confirmação", "Tem certeza que deseja excluir esta conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: onDelete },
    ]);
  };

  return (
    <View
      style={[
        s.container,
        bill_status === "Pago" && {
          borderColor: colors.green.base,
        },
        bill_status === "Atrasado" && { borderColor: colors.red.base },
      ]}
    >
      <View style={s.infos_container}>
        <Text style={s.title}>{name}</Text>
        <Text style={[s.moneyText, { color: textValueColor }]}>R${value}</Text>
        <Text style={s.subtitle}>Vence em {formateData(vence)}</Text>
        <View style={s.statusContainer}>
          {StatusIcon && <StatusIcon color={statusColorValue} size={18} />}
          <Text style={[s.title, { color: statusColorValue }]}>
            {bill_status}
          </Text>
        </View>
      </View>

      <View style={s.action_buttons}>
        <Pressable {...rest} style={s.buttonAction} onPress={onToggleStatus}>
          <ButtonStatusIcon color={ButtonstatusColor} size={24} />
        </Pressable>
        <Pressable
          {...rest}
          style={s.buttonAction}
          onPress={() => confirmDelete(id)}
        >
          <IconTrash color={colors.red.base} size={24} />
        </Pressable>
      </View>
    </View>
  );
}
