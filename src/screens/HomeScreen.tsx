import React, { useState } from "react";
import { View, Text } from "react-native";
import { usePaineis, useAnotacoes } from "../hooks/useDatabase";
import { PainelSection } from "../components/PainelSection";
import { TarefaSection } from "../components/TarefaSection";

type HomeScreenProps = {
  darkMode: boolean;
  fontSize: number;
};

export function HomeScreen({ darkMode, fontSize }: HomeScreenProps) {

  const [painelSelecionado, setPainelSelecionado] = useState<number | null>(
    null
  );

  const { paineis, loading: loadingPaineis, criarPainel } = usePaineis();
  
  const {
    anotacoes,
    loading: loadingAnotacoes,
    criarAnotacao,
    marcarConcluida,
    excluirAnotacao,
    atualizarAnotacao,
  } = useAnotacoes(painelSelecionado);

  const textColor = darkMode ? "text-white" : "text-black";
  const bgColor = darkMode ? "bg-neutral-900" : "bg-white";

  return (
    <View className={`flex-1 pt-16 px-4 ${bgColor}`}>
      <Text
        className={`font-bold text-center mb-6 text-blue-500`}
        style={{ fontSize: fontSize + 4 }}
      >
        Hocus Focus
      </Text>

      <TarefaSection
        anotacoes={anotacoes}
        loading={loadingAnotacoes}
        onCriarAnotacao={criarAnotacao}
        onExcluirAnotacao={excluirAnotacao}
        onUpdateAnotacao={atualizarAnotacao}
      />

      {/* Seção de Painéis 
      <PainelSection
        paineis={paineis}
        loading={loadingPaineis}
        painelSelecionado={painelSelecionado}
        onPainelSelect={setPainelSelecionado}
        onCriarPainel={criarPainel}
      />
      */}

      {/* Mensagens de estado 
      {!painelSelecionado && paineis.length > 0 && (
        <View className="flex-1 justify-center items-center py-10">
          <Text className="text-lg text-gray-500 text-center italic">👆 Selecione um painel acima para ver as tarefas</Text>
        </View>
      )}
      */}

      {/*paineis.length === 0 && !loadingPaineis && (
        <View className="flex-1 justify-center items-center py-10">
          <Text className="text-lg text-gray-500 text-center italic">🚀 Crie seu primeiro painel para começar!</Text>
        </View>
      )*/}
    </View>
  );
}
