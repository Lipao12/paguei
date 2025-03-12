import { colors } from "@/styles/colors";
import { categoriesIcons } from "@/utils/categories-icons";
import {
  IconAlertCircle,
  IconAlertOctagon,
  IconAlertTriangle,
  IconCircleCheck,
  IconClock,
  IconTrash,
} from "@tabler/icons-react-native";
import { Pressable, PressableProps, Text, View } from "react-native";
import { s } from "./style";

type BillStatus = "Pendente" | "Pago" | "Atrasado";

type Props = PressableProps & {
  iconId: string;
  isSelected?: boolean;
  name: string;
  value: number;
  vence: string;
  bill_status: string;
  onToggleStatus: () => void;
};

export function Card({
  name,
  value,
  iconId,
  vence,
  bill_status,
  isSelected = false,
  ...rest
}: Props) {
  const Icon = categoriesIcons[iconId];

  // Função para calcular a diferença de dias
  const getDateDifference = (dateString: string) => {
    const currentDate = new Date();
    const dueDate = new Date(dateString);
    const timeDiff = dueDate.getTime() - currentDate.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24); // Convertendo para dias
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

  const ButtonStatusIcon =
    bill_status === "Pago" ? IconAlertTriangle : IconCircleCheck;
  const ButtonstatusColor =
    bill_status === "Pago" ? colors.orange.base : colors.green.base;

  const formateData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
  };

  return (
    <View
      style={[
        s.container,
        bill_status === "Pago" && { borderColor: colors.green.base },
        bill_status === "Atrasado" && { borderColor: colors.red.base },
        isSelected && s.containerSelected,
      ]}
    >
      <View style={s.infos_container}>
        <Text style={s.title}>{name}</Text>
        <Text style={s.moneyText}>R${value}</Text>
        <Text style={s.subtitle}>Vence em {formateData(vence)}</Text>
        <View style={s.statusContainer}>
          {StatusIcon && <StatusIcon color={statusColorValue} size={18} />}
          <Text style={[s.title, { color: statusColorValue }]}>
            {bill_status}
          </Text>
        </View>
      </View>

      <View style={s.action_buttons}>
        <Pressable {...rest} style={s.buttonAction}>
          <ButtonStatusIcon color={ButtonstatusColor} size={24} />
        </Pressable>
        <Pressable {...rest} style={s.buttonAction}>
          <IconTrash color={colors.red.base} size={24} />
        </Pressable>
      </View>
    </View>
  );
}
