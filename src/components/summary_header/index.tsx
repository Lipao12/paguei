import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/font-family";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { s } from "./style"; // Importando os estilos

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

export function SummaryHeader() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("Todas");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Pega o mês atual

  function handleChangeMonth(direction: "prev" | "next") {
    setCurrentMonth((prev) => {
      if (direction === "prev") return prev === 0 ? 11 : prev - 1;
      return prev === 11 ? 0 : prev + 1;
    });
  }

  return (
    <View style={s.container}>
      <Text style={s.headerTitle}>Resumo Financeiro</Text>
      {/* Título + Navegação */}
      <View style={s.headerRow}>
        <Pressable onPress={() => handleChangeMonth("prev")}>
          <Ionicons name="chevron-back" size={20} color={colors.gray[200]} />
        </Pressable>

        <Text style={s.monthTitle}>{months[currentMonth]}</Text>

        <Pressable onPress={() => handleChangeMonth("next")}>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[200]} />
        </Pressable>
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
            onPress={() => setSelectedFilter(filter as FilterType)}
          >
            <Text
              style={[s.filterText, selectedFilter === filter && s.activeText]}
            >
              {filter}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Valores */}
      <View style={s.valuesContainer}>
        <View style={s.valueBox}>
          <Text style={s.label}>Total:</Text>
          <Text style={s.value}>R$ 23,65</Text>
        </View>

        <View style={s.valueBox}>
          <Text style={s.label}>Pago:</Text>
          <Text style={[s.value, { color: colors.green.base }]}>R$ 0,65</Text>
        </View>

        <View style={s.valueBox}>
          <Text style={s.label}>A Pagar:</Text>
          <Text style={[s.value, { color: colors.red.dark }]}>R$ 23,00</Text>
        </View>
      </View>
    </View>
  );
}
