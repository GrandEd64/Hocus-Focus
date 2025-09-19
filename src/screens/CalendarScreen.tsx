import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useDatabase } from "../hooks/useDatabase";
import DataCard from "../components/manual/DataCard";

/*a ideia é que ele seja um agrupamento, consegue enxergar no calendario 
os paineis que voce fez de acordo com a data*/
// Configuração de idioma para o calendário
LocaleConfig.locales["pt-br"] = {
  monthNames: [
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
  ],
  monthNamesShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  dayNames: [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

type CalendarScreenProps = {
  darkMode: boolean;
  fontSize: number;
};

export function CalendarScreen({ darkMode, fontSize }: CalendarScreenProps) {
  const { isReady, services } = useDatabase();
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [painelPorData, setPainelPorData] = useState({});

  useEffect(() => {
    async function fetchPaineis() {
      if (!isReady || !services) return;
      const paineis = await services.painel.findAllActive();
      // Agrupa painéis por data de criação (formato yyyy-mm-dd)
      const marks = {};
      const painelDataMap = {};
      paineis.forEach((painel) => {
        const date = painel.data_criacao?.slice(0, 10);
        if (date) {
          marks[date] = {
            marked: true,
            dotColor: painel.cor || "#4630eb",
          };
          if (!painelDataMap[date]) painelDataMap[date] = [];
          painelDataMap[date].push(painel);
        }
      });
      setMarkedDates(marks);
      setPainelPorData(painelDataMap);
    }
    fetchPaineis();
  }, [isReady, services]);

  const textColor = darkMode ? "text-white" : "text-black";
  const bgColor = darkMode ? "bg-neutral-900" : "bg-white";

  return (
    <View className={`flex-1 pt-16 ${bgColor}`}>
      <Text
        className={`font-bold text-center mb-6 ${textColor}`}
        style={{ fontSize: fontSize + 4 }}
      >
        Calendário
      </Text>
      <Calendar
        markedDates={{
          ...markedDates,
          ...(selectedDate
            ? {
                [selectedDate]: {
                  selected: true,
                  selectedColor: "#3b82f6",
                  ...markedDates[selectedDate],
                },
              }
            : {}),
        }}
        theme={{
          calendarBackground: "transparent",
          textSectionTitleColor: darkMode ? "#94a3b8" : "#475569",
          dayTextColor: darkMode ? "#f1f5f9" : "#1e293b",
          monthTextColor: darkMode ? "#f1f5f9" : "#0f172a",
          selectedDayBackgroundColor: "#3b82f6",
          selectedDayTextColor: "#fff",
          todayTextColor: darkMode ? "#E8E8E8" : "#3b82f6",
          dotColor: "#3b82f6",
          arrowColor: darkMode ? "#f1f5f9" : "#1e293b",
          textDayFontWeight: "500",
          textDisabledColor: darkMode ? "#64748b" : "#cbd5e1",
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        style={{
          backgroundColor: "transparent",
        }}
      />
      {selectedDate && painelPorData[selectedDate] && (
        <View className="mt-4 px-4">
          <Text
            className={`font-bold mb-2 ${textColor}`}
            style={{ fontSize: fontSize }}
          >
            Painéis do dia:
          </Text>
          {painelPorData[selectedDate].map((painel) => (
            <View
              key={painel.id}
              className={`mb-2 p-2 rounded border-l-4 ${darkMode ? "bg-slate-800" : "bg-slate-200"}`}
              style={{ borderLeftColor: painel.cor }}
            >
              <Text
                className="font-semibold"
                style={{ color: painel.cor, fontSize }}
              >
                {painel.nome}
              </Text>
              <Text
                style={{
                  color: darkMode ? "#94a3b8" : "#475569",
                  fontSize: fontSize - 2,
                }}
              >
                Criado em: {painel.data_criacao?.slice(0, 10)}
              </Text>
            </View>
          ))}
        </View>
      )}
      <DataCard />
    </View>
  );
}
