import { Image, Text, View } from "react-native";
import { s } from "./style";

export function Welcome() {
  return (
    <View>
      <Image source={require("@/assets/logo.png")} style={s.logo} />
      <Text style={s.title}>Boas vindas ao Paguei!</Text>
      <Text style={s.subtitle}>Seu dinheiro no controle. Sem atrasos!</Text>
    </View>
  );
}
