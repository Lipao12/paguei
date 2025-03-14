import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, PressableProps, Text, View } from "react-native";
import { ButtonLocale } from "../button_locale";
import { s } from "./style";

type Props = PressableProps & {
  total?: number;
  paid?: number;
  toPay?: number;
  onSelectMounth: (prev: number) => void;
  onSelectFilter: (prev: boolean) => void;
};

type FilterType = "all" | "toPay";

export function SummaryHeader({ onSelectMounth, onSelectFilter }: Props) {
  const { t, i18n } = useTranslation("summary");

  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const mounth =
    i18n.language === "pt"
      ? [
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
        ]
      : [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

  useEffect(() => {
    onSelectMounth(currentMonth);
  }, [currentMonth, onSelectMounth]);

  useEffect(() => {
    onSelectFilter(selectedFilter === "toPay");
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
      return newMonth;
    });
  }

  function handleChangeFilter(filter: FilterType) {
    setSelectedFilter(filter);
    onSelectFilter(filter === "toPay");
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "pt" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <View style={s.container}>
      {/* Título */}
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 10,
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <View style={s.containerTitle}>
          <Text style={[s.headerTitle]}>{t("title")}</Text>
        </View>
        <ButtonLocale toggleLanguage={toggleLanguage} />
      </View>

      {/* Navegação de Mês */}
      <View style={s.headerRow}>
        <Pressable onPress={() => handleChangeMonth("prev")}>
          <Ionicons name="chevron-back" size={20} color={colors.gray[200]} />
        </Pressable>

        <Text style={s.monthTitle}>{mounth[currentMonth]}</Text>

        <Pressable onPress={() => handleChangeMonth("next")}>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[200]} />
        </Pressable>
      </View>

      <View style={{ marginTop: 7 }}>
        <Text style={[s.monthTitle, { fontSize: 18 }]}>2025</Text>
      </View>

      {/* Filtros */}
      <View style={s.filterContainer}>
        {["all", "toPay"].map((filter) => (
          <Pressable
            key={filter}
            style={[
              s.filterButton,
              selectedFilter === filter && s.activeFilter,
            ]}
            onPress={() => handleChangeFilter(filter as FilterType)}
          >
            <Text
              style={[s.filterText, selectedFilter === filter && s.activeText]}
            >
              {t(`filters.${filter}`)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Valores */}
      {/* 
      <View style={s.valuesContainer}>
        <View style={s.valueBox}>
          <Text style={s.label}>{t("labels.total")}</Text>
          <Text style={s.value}>R$ {total}</Text>
        </View>

        <View style={s.valueBox}>
          <Text style={s.label}>{t("labels.paid")}</Text>
          <Text style={[s.value, { color: colors.green.base }]}>R$ {paid}</Text>
        </View>

        <View style={s.valueBox}>
          <Text style={s.label}>{t("labels.toPay")}</Text>
          <Text style={[s.value, { color: colors.red.base }]}>R$ {toPay}</Text>
        </View>
      </View>
      */}
    </View>
  );
}
