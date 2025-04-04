import { colors } from "@/styles/colors";
import { IconProps } from "@tabler/icons-react-native";
import { Text, View } from "react-native";
import { s } from "./style";
type Props = {
  title: string;
  description: string;
  icon: React.ComponentType<IconProps>;
};

export function Step({ title, description, icon: Icon }: Props) {
  console.log(Icon);
  return (
    <View style={s.container}>
      {Icon && <Icon size={32} color={colors.red.base} />}
      <View style={s.details}>
        <Text style={s.title}>{title}</Text>
        <Text style={s.description}>{description}</Text>
      </View>
    </View>
  );
}
