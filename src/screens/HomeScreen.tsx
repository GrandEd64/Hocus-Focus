import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { usePaineis, useAnotacoes } from '../hooks/useDatabase';
import { PainelSection } from '../components/PainelSection';
import { TarefaSection } from '../components/TarefaSection';

export function HomeScreen() {
  const [painelSelecionado, setPainelSelecionado] = useState<number | null>(null);
  
  const { paineis, loading: loadingPaineis, criarPainel } = usePaineis();
  const { anotacoes, loading: loadingAnotacoes, criarAnotacao, marcarConcluida, excluirAnotacao } = useAnotacoes(painelSelecionado);

  return (
    <View className="bg-white flex-1 pt-16 px-4">
      <Text className="text-2xl font-bold text-center mb-6 text-slate-800">🎯 Hocus Focus</Text>
      
      {/* Seção de Painéis */}
      <PainelSection
        paineis={paineis}
        loading={loadingPaineis}
        painelSelecionado={painelSelecionado}
        onPainelSelect={setPainelSelecionado}
        onCriarPainel={criarPainel}
      />

      {/* Seção de Tarefas */}
      {painelSelecionado && (
        <TarefaSection
          anotacoes={anotacoes}
          loading={loadingAnotacoes}
          onCriarAnotacao={criarAnotacao}
          onMarcarConcluida={marcarConcluida}
          onExcluirAnotacao={excluirAnotacao}
          painelSelecionado={painelSelecionado}
        />
      )}

      {/* Mensagens de estado */}
      {!painelSelecionado && paineis.length > 0 && (
        <View className="flex-1 justify-center items-center py-10">
          <Text className="text-lg text-gray-500 text-center italic">👆 Selecione um painel acima para ver as tarefas</Text>
        </View>
      )}

      {paineis.length === 0 && !loadingPaineis && (
        <View className="flex-1 justify-center items-center py-10">
          <Text className="text-lg text-gray-500 text-center italic">🚀 Crie seu primeiro painel para começar!</Text>
        </View>
      )}
    </View>
  );
}
