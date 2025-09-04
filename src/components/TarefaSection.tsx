import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { AnotacaoEntity } from '../types/entities';
import { AnotacaoItem } from './AnotacaoItem';
import "../../global.css"

interface TarefaSectionProps {
  anotacoes: AnotacaoEntity[];
  loading: boolean;
  onCriarAnotacao: (anotacao: Omit<AnotacaoEntity, 'id'>) => Promise<void>;
  //onMarcarConcluida: (id: number) => Promise<void>;
  onExcluirAnotacao: (id: number) => Promise<void>;
}

export function TarefaSection({
  anotacoes,
  loading,
  onCriarAnotacao,
  //onMarcarConcluida,
  onExcluirAnotacao,
}: TarefaSectionProps) {
  const [textoAnotacao, setTextoAnotacao] = useState('');

  // Debug logs
  console.log('🎯 TarefaSection - anotacoes recebidas:', anotacoes);
  console.log('🎯 TarefaSection - loading:', loading);

  const handleCriarAnotacao = async () => {
    if (!textoAnotacao.trim()) return;

    try {
      await onCriarAnotacao({
        descricao: textoAnotacao,
        concluido: 0,
        data_envio: new Date().toISOString()
      });
      setTextoAnotacao('');
      Alert.alert('Sucesso', 'Tarefa criada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a tarefa');
    }
  };

  /*
  const handleMarcarConcluida = async (id: number) => {
    try {
      await onMarcarConcluida(id);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível marcar como concluída');
    }
  };
  */

  const handleDrag = () => {};

  const handleExcluirAnotacao = async (id: number) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await onExcluirAnotacao(id);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a tarefa');
            }
          }
        }
      ]
    );
  };

  const anotacoesPendentes = anotacoes.filter((item) => item.concluido === 0);
  const anotacoesConcluidas = anotacoes.filter((item) => item.concluido === 1);

  // Debug logs para as listas filtradas
  console.log('🎯 TarefaSection - anotacoesPendentes:', anotacoesPendentes);
  console.log('🎯 TarefaSection - anotacoesConcluidas:', anotacoesConcluidas);
  console.log('🎯 TarefaSection - total pendentes:', anotacoesPendentes.length);
  console.log('🎯 TarefaSection - total concluidas:', anotacoesConcluidas.length);

  return (
    <View className="mb-6">
      <Text className="text-xl text-white mb-4">Tarefas</Text>
      
      {/* Input para nova tarefa */}
      <View className="flex-row items-center mb-4">
        <TextInput
          className="border text-white border-gray-300 rounded-lg flex-1 h-12 px-4 text-base"
          placeholder="Nova tarefa..."
          value={textoAnotacao}
          onChangeText={setTextoAnotacao}
          onSubmitEditing={handleCriarAnotacao}
        />
        <TouchableOpacity onPress={handleCriarAnotacao} className="bg-indigo-600 rounded-lg h-12 w-12 ml-3 justify-center items-center">
          <Text className="text-white text-2xl font-bold">+</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#4630eb" />
      ) : (
        <ScrollView className="flex-1 min-h-[900px]">
          {/* Tarefas Pendentes */}

        </ScrollView>
      )}
    </View>
  );
}
