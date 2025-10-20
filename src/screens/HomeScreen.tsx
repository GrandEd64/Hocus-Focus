import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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

  const { paineis, loading: loadingPaineis, criarPainel, excluirPainel } = usePaineis();
  
  const currentPainel = paineis.find(p => p.id === painelSelecionado) ?? null;

  const {
    anotacoes,
    loading: loadingAnotacoes,
    criarAnotacao,
    marcarConcluida,
    excluirAnotacao,
    atualizarAnotacao,
    atualizarAnotacaoSemCarregar
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

      {/* Seção de Tarefas */}
      <TarefaSection
        anotacoes={anotacoes}
        loading={loadingAnotacoes}
        onCriarAnotacao={criarAnotacao}
        onExcluirAnotacao={excluirAnotacao}
        onUpdateAnotacao={atualizarAnotacao}
        onUpdateOrdemAnotacao={atualizarAnotacaoSemCarregar}
        darkMode={darkMode}
        fontSize={fontSize}
        paineis={paineis}
        painelAtual={currentPainel}
      />

      {paineis.length === 0 && !loadingPaineis ? (
        <View className="bottom-0 fixed">
          <View className="justify-center items-center py-10">
            <TouchableOpacity onPress={criarPainel} className="bg-gray-200 rounded-lg w-full h-32 justify-center">
              <Text className="text-lg text-gray-600 text-center italic">
                🚀 Crie seu primeiro painel para começar!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
      ) 
        :
      (
        <PainelSection
        paineis={paineis}
        loading={loadingPaineis}
        onCriarPainel={criarPainel}
        onPainelSelect={(id) => setPainelSelecionado(id === painelSelecionado ? null : id)}
        onExcluirPainel={excluirPainel}
        painelSelecionado={currentPainel}
        />
      )}
    </View>
  );
}
