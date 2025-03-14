import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Pressable, PressableProps, Text, View } from "react-native";
import { s } from "./style"; // Importando os estilos

type Props = PressableProps & {
  total?: number;
  paid?: number;
  toPay?: number;
  onSelectMounth: (prev: number) => void;
  onSelectFilter: (prev: boolean) => void;
};

type FilterType = "Todas" | "A Pagar";
const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function SummaryHeader({ onSelectMounth, onSelectFilter }: Props) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("Todas");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Pega o mês atual

  useEffect(() => {
    onSelectMounth(currentMonth);
  }, [currentMonth, onSelectMounth]);

  useEffect(() => {
    onSelectFilter(selectedFilter === "A Pagar");
  }, [selectedFilter, onSelectFilter]);

  function handleChangeMonth(direction: "prev" | "next") {
    setCurrentMonth((prev) => {
      const newMonth =
        direction === "prev"
          ? prev === 0
            ? 11
            : prev - 1
          : prev === 11
          ? 0
          : prev + 1;
      //onSelectMounth(newMonth); // Chama o onSelectMounth diretamente com o novo mês
      return newMonth;
    });
  }

  function handleChangeFilter(filter: string) {
    setSelectedFilter(filter as FilterType);
    onSelectFilter(filter === "Todas" ? false : true);
  }
  return (
    <View style={s.container}>
      {/* Título + Navegação */}
      <Text style={s.headerTitle}>Resumo Financeiro</Text>
      <View style={s.headerRow}>
        <Pressable onPress={() => handleChangeMonth("prev")}>
          <Ionicons name="chevron-back" size={20} color={colors.gray[200]} />
        </Pressable>

        <Text style={s.monthTitle}>{months[currentMonth]}</Text>

        <Pressable onPress={() => handleChangeMonth("next")}>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[200]} />
        </Pressable>
      </View>

      <View style={{ marginTop: 7 }}>
        <Text style={[s.monthTitle, { fontSize: 18 }]}>{2025}</Text>
      </View>

      {/* Filtros */}
      <View style={s.filterContainer}>
        {["Todas", "A Pagar"].map((filter) => (
          <Pressable
            key={filter}
            style={[
              s.filterButton,
              selectedFilter === filter && s.activeFilter,
            ]}
            onPress={() => handleChangeFilter(filter)}
          >
            <Text
              style={[s.filterText, selectedFilter === filter && s.activeText]}
            >
              {filter}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Valores 
      <View style={s.valuesContainer}>
        <View style={s.valueBox}>
          <Text style={s.label}>Total:</Text>
          <Text style={s.value}>R$ {total}</Text>
        </View>

        <View style={s.valueBox}>
          <Text style={s.label}>Pago:</Text>
          <Text style={[s.value, { color: colors.green.base }]}>R$ {paid}</Text>
        </View>

        <View style={s.valueBox}>
          <Text style={s.label}>A Pagar:</Text>
          <Text style={[s.value, { color: colors.red.base }]}>R$ {toPay}</Text>
        </View>
      </View>*/}
    </View>
  );
}
