import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  Animated,
  PanResponder
} from 'react-native';
import { AnotacaoEntity } from '../types/entities';
import { AnotacaoItem } from './AnotacaoItem';
import "../../global.css"

interface TarefaSectionProps {
  anotacoes: AnotacaoEntity[];
  loading: boolean;
  onCriarAnotacao: (anotacao: Omit<AnotacaoEntity, 'id'>) => Promise<void>;
  onExcluirAnotacao: (id: number) => Promise<void>;
}

export function TarefaSection({
  anotacoes,
  loading,
  onCriarAnotacao,
  onExcluirAnotacao,
}: TarefaSectionProps) {
  const [textoAnotacao, setTextoAnotacao] = useState('');
  const [localAnotacoes, setLocalAnotacoes] = useState<AnotacaoEntity[]>(anotacoes);
  const [itemLayouts, setItemLayouts] = useState<Map<number, { x: number, y: number, width: number, height: number }>>(new Map());

  const measureLayout = (id: number) => (x: number, y: number, width: number, height: number) => {
    setItemLayouts(prev => new Map(prev).set(id, { x, y, width, height }));
  };
  
  const handleReorder = (draggedId: number, dropTargetId: number) => {
    const newAnotacoes = [...localAnotacoes];
    const draggedIndex = newAnotacoes.findIndex(item => item.id === draggedId);
    const dropIndex = newAnotacoes.findIndex(item => item.id === dropTargetId);

    if (draggedIndex !== -1 && dropIndex !== -1) {
      const [draggedItem] = newAnotacoes.splice(draggedIndex, 1);
      newAnotacoes.splice(dropIndex, 0, draggedItem);
      
      // Update priorities based on new positions
      newAnotacoes.forEach((item, index) => {
        item.prioridade = newAnotacoes.length - index;
      });

      setLocalAnotacoes(newAnotacoes);
      // Here you would typically call an API to persist the new order
    }
  };

  useEffect(() => {
    setLocalAnotacoes(anotacoes);
  }, [anotacoes]);

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
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a tarefa');
    }
  };

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

  

  const moverAnotacao = (id: number, valorArrastado : number) => {
    const indiceAnot = localAnotacoes.findIndex(a => a.id === id);
    if(indiceAnot <= 0) return;

    const item : AnotacaoEntity = localAnotacoes[indiceAnot];

    const novoIndice = indiceAnot + valorArrastado;
    item.prioridade = novoIndice;

    const anotacoesAtualizadas = [...localAnotacoes];

  };

  const placeHolderFunction = (id) => {};

  const handleMarcarConcluida = async (id: number) => {
    try {
      await placeHolderFunction(id);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível marcar como concluída');
    }
  };

  anotacoes.sort((a, b) => b.prioridade - a.prioridade);

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
          placeholderTextColor="#878787"
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
          {localAnotacoes.map((anotacao) => (
            <AnotacaoItem
              key={anotacao.id}
              item={anotacao}
              todasTarefas={localAnotacoes}
              onPress={() => handleMarcarConcluida(anotacao.id)}
              onLongPress={() => handleExcluirAnotacao(anotacao.id)}
              onReorder={handleReorder}
              measureLayout={() => {
                const component = anotacao as any;
                component.measure && component.measure(measureLayout(anotacao.id));
              }}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
