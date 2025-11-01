import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useDatabase, useAnotacoes, usePaineis } from "../hooks/useDatabase";
import DataCard from "../components/manual/DataCard";
import CriarTarefaModal from "../components/manual/EditarTarefaModal";
import { Anotacao } from '../database/models'; // ✅ Importar a classe Anotacao
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
  const [modalVisible, setModalVisible] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const { paineis, loading: loadingPaineis, criarPainel, excluirPainel, recarregar } = usePaineis();
  
  // ✅ Obter as funções do hook useAnotacoes
  const { anotacoes, loading: loadingAnotacoes, atualizarAnotacao, excluirAnotacao } = useAnotacoes();

  useEffect(() => {
    async function fetchAtividades() {
      if (!isReady || !services || loadingAnotacoes) return;
      
      const marks = {};
      const atividadeDataMap = {};
      
      anotacoes.forEach((anotacao) => {
        const date = anotacao.data_vencimento?.slice(0, 10);
        if (date) {
          let dotColor = "#10b981";
          if (anotacao.prioridade >= 3) dotColor = "#ef4444";
          else if (anotacao.prioridade >= 2) dotColor = "#f59e0b";
          
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

  // ✅ FUNÇÃO PARA ABRIR EDIÇÃO
  const handleEditTarefa = (tarefa) => {
    console.log('Editando tarefa no calendário:', tarefa.descricao);
    setTarefaEditando(tarefa);
    setModalVisible(true);
  };

  // ✅ FUNÇÃO PARA SALVAR EDIÇÃO - IDÊNTICA AO handleEditarTarefa QUE FUNCIONA
  const handleSalvarEdicao = async (dadosTarefa: any) => {
    try {
      console.log('Novos dados de tarefa para editar:', JSON.stringify(dadosTarefa, null, 2));
      
      if (!tarefaEditando) {
        Alert.alert('Erro', 'Nenhuma tarefa selecionada para edição.');
        return;
      }

      // ✅ EXATAMENTE IGUAL AO handleEditarTarefa QUE FUNCIONA
      const anotacaoAtualizada = new Anotacao({
        ...tarefaEditando,
        descricao: dadosTarefa.descricao,
        prioridade: dadosTarefa.prioridade,
        nota: dadosTarefa.nota,
        data_vencimento: dadosTarefa.data_vencimento,
        painel_id: dadosTarefa.painel_id
      });

      console.log('AnotacaoAtualizada criada:', anotacaoAtualizada);
        
      // ✅ USAR A FUNÇÃO DO HOOK useAnotacoes (igual ao TarefaSection)
      await atualizarAnotacao(tarefaEditando.id, anotacaoAtualizada);
      
      setModalVisible(false);
      setTarefaEditando(null);
      
      Alert.alert('Sucesso', 'Tarefa atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível salvar a tarefa');
    }
  };

  // ✅ FUNÇÃO PARA DELETAR TAREFA
  const handleDeleteTarefa = async (tarefa: Anotacao) => {
    try {
      await excluirAnotacao(tarefa.id);
      Alert.alert('Sucesso', 'Tarefa deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível deletar a tarefa');
    }
  };

  const handleFecharModal = () => {
    setModalVisible(false);
    setTarefaEditando(null);
  };

  const handleAddTarefa = () => {
    Alert.alert('Ação', 'Adicionar nova tarefa - implemente esta função');
  };

  const handleTarefaPress = (tarefa) => {
    console.log('Tarefa pressionada (ação normal):', tarefa.descricao);
    // Você pode adicionar outras ações aqui se quiser
    // Por exemplo: marcar como concluída, abrir detalhes, etc.
  };

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
      
      {/* ✅ DATACARD CONECTADO COM TODAS AS FUNÇÕES */}
      {isReady && services && (
        <DataCard 
          tarefas={anotacoes} 
          onAddTarefa={handleAddTarefa}
          onTarefaPress={handleTarefaPress}
          onEditTarefa={handleEditTarefa}
          onDeleteTarefa={handleDeleteTarefa} // ✅ DELETAR VIA PRESSÃO LONGA
          darkMode={darkMode}
          fontSize={fontSize}
        />
      )}

      {/* ✅ MODAL DE EDIÇÃO */}
      <CriarTarefaModal
        visible={modalVisible}
        onClose={handleFecharModal}
        onEditTarefa={handleSalvarEdicao}
        darkMode={darkMode}
        fontSize={fontSize}
        tarefaParaEditar={tarefaEditando}
        paineis={paineis} // Passe sua lista de paineis aqui se tiver
      />
    </View>
  );
}