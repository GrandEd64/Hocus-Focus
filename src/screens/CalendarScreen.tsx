import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useDatabase, useAnotacoes } from "../hooks/useDatabase";
import DataCard from "../components/manual/DataCard";
import CalendarioSemanal from "../components/CalendarioSemanal";

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
  
  // Hook para pegar todas as anotações
  const { anotacoes, loading: loadingAnotacoes } = useAnotacoes();

  useEffect(() => {
    async function fetchAtividades() {
      if (!isReady || !services || loadingAnotacoes) return;
      
      // Agrupa atividades por data de vencimento
      const marks = {};
      const atividadeDataMap = {};
      
      anotacoes.forEach((anotacao) => {
        const date = anotacao.data_vencimento?.slice(0, 10);
        if (date) {
          // Define cor da bolinha baseada na prioridade
          let dotColor = "#10b981"; // verde para baixa prioridade
          if (anotacao.prioridade >= 3) dotColor = "#ef4444"; // vermelho para alta
          else if (anotacao.prioridade >= 2) dotColor = "#f59e0b"; // amarelo para média
          
          // Se já existe uma data, usa a cor da prioridade mais alta
          if (marks[date]) {
            const currentColor = marks[date].dotColor;
            if (currentColor === "#10b981" && (dotColor === "#f59e0b" || dotColor === "#ef4444")) {
              marks[date].dotColor = dotColor;
            } else if (currentColor === "#f59e0b" && dotColor === "#ef4444") {
              marks[date].dotColor = dotColor;
            }
          } else {
            marks[date] = {
              marked: true,
              dotColor: dotColor,
            };
          }
          
          if (!atividadeDataMap[date]) atividadeDataMap[date] = [];
          atividadeDataMap[date].push(anotacao);
        }
      });
      
      setMarkedDates(marks);
      setPainelPorData(atividadeDataMap);
    }
    fetchAtividades();
  }, [isReady, services, anotacoes, loadingAnotacoes]);

  const textColor = darkMode ? "text-white" : "text-black";
  const bgColor = darkMode ? "bg-neutral-900" : "bg-white";

  return (
    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
      <View style={{width: Dimensions.get('window').width}}>
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
                Atividades do dia ({painelPorData[selectedDate].length}):
              </Text>
              {painelPorData[selectedDate].map((atividade) => {
                const prioridadeColor = atividade.prioridade >= 3 ? "#ef4444" : 
                                      atividade.prioridade >= 2 ? "#f59e0b" : "#10b981";
                const prioridadeTexto = atividade.prioridade >= 3 ? "Alta" : 
                                      atividade.prioridade >= 2 ? "Média" : "Baixa";
                
                return (
                  <View
                    key={atividade.id}
                    className={`mb-2 p-3 rounded-lg border-l-4 ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}
                    style={{ borderLeftColor: prioridadeColor }}
                  >
                    <Text
                      className={`font-semibold ${atividade.concluido ? 'line-through' : ''}`}
                      style={{ 
                        color: atividade.concluido ? "#94a3b8" : (darkMode ? "#f1f5f9" : "#1e293b"), 
                        fontSize 
                      }}
                    >
                      {atividade.descricao}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <View 
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: prioridadeColor }}
                      />
                      <Text
                        style={{
                          color: darkMode ? "#94a3b8" : "#64748b",
                          fontSize: fontSize - 2,
                        }}
                      >
                        {prioridadeTexto} prioridade
                      </Text>
                      {atividade.concluido === 1 && (
                        <Text
                          style={{
                            color: "#10b981",
                            fontSize: fontSize - 2,
                            marginLeft: 8,
                            fontWeight: "bold"
                          }}
                        >
                          ✓ Concluída
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
          <DataCard 
            tarefas={anotacoes} 
            onAddTarefa={() => console.log('Adicionar')}
            onTarefaPress={(tarefa) => console.log('Tarefa:', tarefa)}
          />
        </View>
      </View>
      <View style={{width: Dimensions.get('window').width}}>
        <CalendarioSemanal
        fontSize={fontSize}
        services={services}
        onAnotacaoTouched={() => {}}/>
      </View>
    </ScrollView>
    
  );
}
