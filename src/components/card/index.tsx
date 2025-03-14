import { colors } from "@/styles/colors";
import { BillStatus } from "@/types";
import {
  IconAlertCircle,
  IconCircleCheck,
  IconClock,
  IconTrash,
} from "@tabler/icons-react-native";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Pressable,
  PressableProps,
  Switch,
  Text,
  View,
} from "react-native";
import { s } from "./style";

type Props = PressableProps & {
  id: string;
  name: string;
  value: number;
  vence: string;
  bill_status: BillStatus;
  isNotificationsEnabled?: boolean;
  onToggleStatus: () => void;
  onSetNotifications: () => void;
  onDelete: () => void;
};

export function Card({
  id,
  name,
  value,
  vence,
  bill_status,
  isNotificationsEnabled,
  onDelete,
  onToggleStatus,
  onSetNotifications,
  ...rest
}: Props) {
  const { t, i18n } = useTranslation("card");

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
    pending: daysUntilDue <= 5 ? IconClock : null,
    paid: IconCircleCheck,
    overdue: IconAlertCircle,
  };

  const statusColor: Record<BillStatus, string> = {
    pending: daysUntilDue <= 5 ? colors.orange.base : colors.gray[500],
    paid: colors.green.base,
    overdue: colors.red.base,
  };

  const StatusIcon = StatusIconMap[bill_status];
  const statusColorValue = statusColor[bill_status];

  const ButtonStatusIcon = bill_status === "paid" ? IconClock : IconCircleCheck;
  const ButtonstatusColor =
    bill_status === "paid" ? colors.gray[400] : colors.green.base;
  const textValueColor =
    bill_status === "overdue" ? colors.red.base : colors.green.base;

  const formateData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString(i18n.language, {
      day: "numeric",
      month: "long",
    });
  };

  function formateMoney(value: number): string {
    const currency = i18n.language === "pt" ? "BRL" : "USD";
    const options: Intl.NumberFormatOptions = {
      style: "currency",
      currency: currency,
    };
    return value.toLocaleString(
      i18n.language === "pt" ? "pt-BR" : "en-US",
      options
    );
  }

  const confirmDelete = (id: string) => {
    Alert.alert(t("confirmation"), t("delete_confirmation"), [
      { text: t("cancel"), style: "cancel" },
      { text: t("delete"), style: "destructive", onPress: onDelete },
    ]);
  };

  return (
    <View
      style={[
        s.container,
        bill_status === "paid" && {
          borderColor: colors.green.base,
        },
        bill_status === "overdue" && { borderColor: colors.red.base },
      ]}
    >
      <View style={s.infos_container}>
        <Text style={s.title}>{name}</Text>
        <Text style={[s.moneyText, { color: textValueColor }]}>
          {formateMoney(value)}
        </Text>
        <Text style={s.subtitle}>
          {t("due_in")} {formateData(vence)}
        </Text>
        <View style={s.statusContainer}>
          {StatusIcon && <StatusIcon color={statusColorValue} size={18} />}
          <Text style={[s.title, { color: statusColorValue }]}>
            {t(`status_${bill_status.toLowerCase()}`)}
          </Text>
        </View>
      </View>

      <View style={s.container_action_button}>
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
        <View>
          <Switch
            value={isNotificationsEnabled}
            onValueChange={onSetNotifications}
            trackColor={{ false: "#767577", true: colors.green.base }}
            thumbColor={value ? "#FFF" : "#FFF"}
          />
        </View>
      </View>
    </View>
  );
}
