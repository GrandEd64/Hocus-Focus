import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert
} from 'react-native';
import { AnotacaoEntity } from '../types/entities';
import { AnotacaoItem } from './AnotacaoItem';
import "../../global.css"
import { Anotacao } from '../database/models';

interface TarefaSectionProps {
  anotacoes: AnotacaoEntity[];
  loading: boolean;
  onCriarAnotacao: (anotacao: Omit<AnotacaoEntity, 'id'>) => Promise<void>;
  onExcluirAnotacao: (id: number) => Promise<void>;
  onUpdateAnotacao: (id, anotacao) => Promise<void>;
}

export function TarefaSection({
  anotacoes,
  loading,
  onCriarAnotacao,
  onExcluirAnotacao,
  onUpdateAnotacao
}: TarefaSectionProps) {
  const [textoAnotacao, setTextoAnotacao] = useState('');
  const [localAnotacoes, setLocalAnotacoes] = useState<AnotacaoEntity[]>(anotacoes);
  const itemPositionsRef = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    console.log("(voz do Zangado) e.... começou");
    if(localAnotacoes.length === 0)
    {
      setLocalAnotacoes(anotacoes.sort((a, b) => b.prioridade - a.prioridade));
    };
  }, [loading]);

  // Debug logs
  //console.log('🎯 TarefaSection - anotacoes recebidas:', anotacoes);
  //console.log('🎯 TarefaSection - loading:', loading);

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

  const moverAnotacao = (id: number, afterId: number | null) => {
    setLocalAnotacoes((prev) => {
      const formatarparaString = (novaArray : AnotacaoEntity[]) => novaArray.map((anotacao) => `Descrição ${anotacao.descricao} - id ${anotacao.id} - índice ${novaArray.findIndex(a => a.id === anotacao.id)}`).join(', ');


      const from = prev.findIndex(a => a.id === id);
      if (from === -1) return prev;

      const next = [...prev];
      const [item] = next.splice(from, 1);
      
      //console.log(`Com o objeto removido, a nossa array ficou dessa forma: ${formatarparaString(next)}`);
      //console.log(`Estamos segurando o ${item.descricao} com id ${item.id}`);

      let insertIndex = 0;
      if (afterId !== null) {
        const idxAfter = next.findIndex(a => a.id === afterId);
        //console.log(`Índice encontrado ${idxAfter}`);
        // se não achar afterId, insere no fim
        insertIndex = idxAfter === -1 ? next.length : idxAfter + 1;
        //console.log(`Então vamos inserir na posição "${insertIndex}"`);
      }
      next.splice(insertIndex, 0, item);

      //console.log(`Agora a array está organizada dessa forma: ${formatarparaString(next)}`);

      return next.map((anotacao, i) => ({ ...anotacao, prioridade: i }));
    });

    const run = async () => {
          for (const a of localAnotacoes) {
            await onUpdateAnotacao(a.id, new Anotacao(a));
          }
        };
        
    run();
  };

  const handleDropAnotacao = (id: number, droppedY: number) => {
    //console.log(itemPositionsRef.current);
    const adjustedPosition = droppedY + itemPositionsRef.current.get(id);
    const sorted = new Map([...itemPositionsRef.current.entries()].sort((a, b) => b[1] - a[1]))
    sorted.delete(id);
    const [itemDropado] = localAnotacoes.filter(a => a.id === id);
    for (const [posId, yPos] of sorted) 
      {
        if (0 > adjustedPosition)
        {
          //console.log(`Não tinha nada em cima do ${itemDropado.descricao}, então ele virou o primeiro da lista}`)
          moverAnotacao(id, null);
          break;
        }
        if(yPos < adjustedPosition) 
        {
          //console.log(`Posição do item dropado "${itemDropado.descricao}" com o id ${id}: ${adjustedPosition}`);
          const [itemAcima] = localAnotacoes.filter(a => a.id === posId);
          //console.log(`Ele estava em baixo de "${itemAcima.descricao}" com o id ${itemAcima.id}`)
          
          //console.log('Item acima:', itemAcima.descricao);
          moverAnotacao(id, itemAcima.id);
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
  //console.log('🎯 TarefaSection - anotacoesPendentes:', anotacoesPendentes);
  //console.log('🎯 TarefaSection - anotacoesConcluidas:', anotacoesConcluidas);
  //console.log('🎯 TarefaSection - total pendentes:', anotacoesPendentes.length);
  //console.log('🎯 TarefaSection - total concluidas:', anotacoesConcluidas.length);

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
              onLayout={(event) => handleItemLayout(anotacao.id, event)}
              item={anotacao}
              todasTarefas={localAnotacoes}
              onPress={() => handleMarcarConcluida(anotacao.id)}
              onLongPress={() => handleExcluirAnotacao(anotacao.id)}
              onDropAnotacao={(newY) => handleDropAnotacao(anotacao.id, newY)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
