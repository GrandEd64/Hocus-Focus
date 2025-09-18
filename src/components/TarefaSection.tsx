import React, { useState, useEffect, useRef } from 'react';
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
  const itemPositionsRef = useRef<Map<number, number>>(new Map());

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

  const moverAnotacao = (id: number, novaPosicao: number) => {
    console.log("alterando posições....");
    const anotacoesAtualizadas = [...localAnotacoes];
    const [item] = anotacoesAtualizadas.splice(anotacoesAtualizadas.findIndex(a => a.id === id), 1);
    
    if (novaPosicao > localAnotacoes.length) novaPosicao = localAnotacoes.length;
    if (novaPosicao !== 0) novaPosicao - 1;

    anotacoesAtualizadas.splice(novaPosicao, 0, item);

    anotacoesAtualizadas.forEach((anotacao, index) => {
      anotacao.prioridade = index;
    });

    console.log(anotacoesAtualizadas);
    setLocalAnotacoes(anotacoesAtualizadas);
  };

  const handleDropAnotacao = (id: number, droppedY: number) => {
    const adjustedPosition = droppedY + itemPositionsRef.current.get(id);
    const sorted = new Map([...itemPositionsRef.current.entries()].sort((a, b) => b[1] - a[1]))
    sorted.delete(id);
    for (const [posId, yPos] of sorted) 
      {
        if (0 > adjustedPosition)
        {
          moverAnotacao(id, 0);
          break;
        }
        if(yPos < adjustedPosition) 
        {
          console.log(adjustedPosition);
          const [itemAcima] = localAnotacoes.filter(a => a.id === posId);
          console.log('Item acima:', itemAcima.descricao);
          moverAnotacao(id, localAnotacoes.findIndex(a => a.id == posId));
          break;
        }
    };
  };

  const placeHolderFunction = (id) => {};

  const handleItemLayout = (id: number, event: any) => {
    const layout = event.nativeEvent.layout;
    itemPositionsRef.current.set(id, layout.y);
  };

  const handleMarcarConcluida = async (id: number) => {
    try {
      await placeHolderFunction(id);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível marcar como concluída');
    }
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
              onLayout={(event) => handleItemLayout(anotacao.id, event)}
              onDropAnotacao={(newY) => handleDropAnotacao(anotacao.id, newY)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
