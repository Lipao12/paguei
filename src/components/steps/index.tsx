import {
  IconBell,
  IconCircleCheck,
  IconClipboardList,
} from "@tabler/icons-react-native";
import { View } from "react-native";
import { Step } from "../step";
import { s } from "./style";

export function Steps() {
  return (
    <View style={s.container}>
      <Step
        icon={IconClipboardList}
        title="Cadastre suas contas"
        description="Adicione suas contas e nunca mais esqueça de pagar."
      />
      <Step
        icon={IconBell}
        title="Receba lembretes"
        description="Fique tranquilo! O Paguei avisa quando uma conta estiver perto do vencimento."
      />
      <Step
        icon={IconCircleCheck}
        title="Marque como paga"
        description="Mantenha tudo organizado e acompanhe seus pagamentos com facilidade."
      />
    </View>
  );
}
