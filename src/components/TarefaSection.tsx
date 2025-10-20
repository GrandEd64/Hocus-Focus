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
import { AnotacaoEntity, PainelEntity } from '../types/entities';
import { AnotacaoItem } from './AnotacaoItem';
import CriarTarefaModal from './manual/EditarTarefaModal';
import "../../global.css"
import { Anotacao } from '../database/models';

interface TarefaSectionProps {
  anotacoes: AnotacaoEntity[];
  loading: boolean;
  onCriarAnotacao: (anotacao: Omit<AnotacaoEntity, 'id'>) => Promise<void>;
  onExcluirAnotacao: (id: number) => Promise<void>;
  onUpdateAnotacao: (id, anotacao) => Promise<void>;
  onUpdateOrdemAnotacao: (id, anotacao) => Promise<void>;
  darkMode?: boolean;
  fontSize?: number;
  paineis?: PainelEntity[];
  painelAtual?: PainelEntity;
}

export function TarefaSection({
  anotacoes,
  loading,
  paineis,
  painelAtual,
  onCriarAnotacao,
  onExcluirAnotacao,
  onUpdateAnotacao,
  onUpdateOrdemAnotacao,
  darkMode = true,
  fontSize = 16
}: TarefaSectionProps) {
  const [textoAnotacao, setTextoAnotacao] = useState('');
  const [anotacoesDisplay, setAnotacoesDisplay] = useState<AnotacaoEntity[]>(anotacoes);
  const anotacoesInfoRef = useRef<AnotacaoEntity[]>(anotacoes);
  const itemPositionsRef = useRef<Map<number, number>>(new Map());
  const [modalVisible, setModalVisible] = useState(false);
  const [tarefaParaEditar, setTarefaParaEditar] = useState<AnotacaoEntity | null>(null);

  const atualizarAnotacoesFront = (novaAnotacoes : AnotacaoEntity[]) => {
    anotacoesInfoRef.current = novaAnotacoes;
    setAnotacoesDisplay(anotacoesInfoRef.current);
  };

  useEffect(() => {
    console.log("e.... começou");
    const sorted = [...anotacoes].sort((a, b) => b.prioridade - a.prioridade);
    atualizarAnotacoesFront(sorted);
  }, [anotacoes]);

  // Debug logs
  //console.log('🎯 TarefaSection - anotacoes recebidas:', anotacoes);
  //console.log('🎯 TarefaSection - loading:', loading);

  // Cores baseadas no tema
  const textColor = darkMode ? "text-white" : "text-black";
  const inputBgColor = darkMode ? "bg-neutral-800" : "bg-white";
  const inputBorderColor = darkMode ? "border-gray-600" : "border-gray-300";
  const inputTextColor = darkMode ? "text-white" : "text-black";
  const placeholderColor = darkMode ? "#9ca3af" : "#6b7280";

  const handleCriarAnotacao = async () => {
    if (!textoAnotacao.trim()) return;

    try {
      await onCriarAnotacao({
        descricao: textoAnotacao,
        concluido: 0,
        data_envio: new Date().toISOString(),
        painel_id: painelAtual?.id ?? null
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
    const prev = anotacoesInfoRef.current;
    const formatarparaString = (novaArray : AnotacaoEntity[]) => novaArray.map((anotacao) => `Descrição ${anotacao.descricao} - id ${anotacao.id} - índice ${novaArray.findIndex(a => a.id === anotacao.id)}`).join(', ');


    const from = prev.findIndex(a => a.id === id);
    if (from === -1) return prev;

    const next = [...prev];
    const [item] = next.splice(from, 1);
    
    console.log(`Com o objeto removido, a nossa array ficou dessa forma: ${formatarparaString(next)}`);
    console.log(`Estamos segurando o ${item.descricao} com id ${item.id}`);

    let insertIndex = 0;
    if (afterId !== null) {
      const idxAfter = next.findIndex(a => a.id === afterId);
      console.log(`Índice encontrado ${idxAfter}`);
      // se não achar afterId, insere no fim
      insertIndex = idxAfter === -1 ? next.length : idxAfter + 1;
      console.log(`Então vamos inserir na posição "${insertIndex}"`);
    }
    next.splice(insertIndex, 0, item);

    console.log(`Agora a array está organizada dessa forma: ${formatarparaString(next)}`);

    atualizarAnotacoesFront(next.map((anotacao, i) => ({ ...anotacao, prioridade: i })));

    const run = async () => {
          for (const a of anotacoesInfoRef.current) {
            await onUpdateOrdemAnotacao(a.id, new Anotacao(a));
          }
        };
        
    run();
    
  };

  const handleDropAnotacao = (id: number, droppedY: number) => {
    console.log(itemPositionsRef.current);
    const adjustedPosition = droppedY + itemPositionsRef.current.get(id);
    const sorted = new Map([...itemPositionsRef.current.entries()].sort((a, b) => b[1] - a[1]))
    sorted.delete(id);
    const [itemDropado] = anotacoesInfoRef.current.filter(a => a.id === id);
    for (const [posId, yPos] of sorted) 
      {
        if (0 > adjustedPosition)
        {
          console.log(`Não tinha nada em cima do ${itemDropado.descricao}, então ele virou o primeiro da lista}`)
          moverAnotacao(id, null);
          break;
        }
        if(yPos < adjustedPosition) 
        {
          console.log(`Posição do item dropado "${itemDropado.descricao}" com o id ${id}: ${adjustedPosition}`);
          console.log(`anotações do display atual: ${anotacoesInfoRef.current.map(a => `Anotação id ${a.id}, descrição ${a.descricao}`).join(' - ')}`);
          console.log(`anotacoes original para efeito de comparação: ${anotacoes.map(a => `Anotação id ${a.id}, descrição ${a.descricao}`).join(' - ')}`);
          const [itemAcima] = anotacoesInfoRef.current.filter(a => a.id === posId);
          console.log(`Ele estava em baixo de "${itemAcima.descricao}" com o id ${itemAcima.id}`);
          
          console.log('Item acima:', itemAcima.descricao);
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

  const handleDoublePress = (tarefa: AnotacaoEntity) => {
    console.log('handleDoublePress chamado para tarefa:', tarefa.descricao);
    setTarefaParaEditar(tarefa);
    setModalVisible(true);
  };

  const handleEditarTarefa = async (dadosTarefa: any) => {
    try {
      // Editar tarefa existente
      const anotacaoAtualizada = new Anotacao({
        ...tarefaParaEditar,
        descricao: dadosTarefa.descricao,
        prioridade: dadosTarefa.prioridade,
        data_vencimento: dadosTarefa.data_vencimento,
        painel_id: dadosTarefa.painel_id
      });
        
      await onUpdateAnotacao(tarefaParaEditar.id, anotacaoAtualizada);
      
      setAnotacoesDisplay(anotacoes);
      setTarefaParaEditar(null);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a tarefa');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTarefaParaEditar(null);
  };

  const anotacoesPendentes = anotacoes.filter((item) => item.concluido === 0);
  const anotacoesConcluidas = anotacoes.filter((item) => item.concluido === 1);

  // Debug logs para as listas filtradas
  //console.log('🎯 TarefaSection - anotacoesPendentes:', anotacoesPendentes);
  //console.log('🎯 TarefaSection - anotacoesConcluidas:', anotacoesConcluidas);
  //console.log('🎯 TarefaSection - total pendentes:', anotacoesPendentes.length);
  //console.log('🎯 TarefaSection - total concluidas:', anotacoesConcluidas.length);

  return (
    <View className="flex-1 mb-5">
      <View className="flex-row items-end mb-4">
        <Text className={`text-xl ${textColor}`}>Tarefas</Text>
        {painelAtual != null && (
          <Text className={`text-xs ${textColor} ml-2`}>do painel "{painelAtual.nome}"</Text>
        )}
      </View>
      
      {/* Input para nova tarefa */}
      <View className="flex-row items-center mb-4">
        <TextInput
          className={`border ${inputTextColor} ${inputBorderColor} ${inputBgColor} rounded-lg flex-1 h-12 px-4 text-base`}
          placeholder="Nova tarefa..."
          value={textoAnotacao}
          onChangeText={setTextoAnotacao}
          onSubmitEditing={handleCriarAnotacao}
          placeholderTextColor={placeholderColor}
        />
        <TouchableOpacity onPress={handleCriarAnotacao} className="bg-indigo-600 rounded-lg h-12 w-12 ml-3 justify-center items-center">
          <Text className="text-white text-2xl font-bold">+</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#4630eb" />
      ) : (
        <ScrollView className="flex-1" style={painelAtual && {backgroundColor:painelAtual.cor}}>
          {/* Tarefas Pendentes */}
          {anotacoesDisplay.map((anotacao) => (
            <AnotacaoItem
              key={anotacao.id}
              onLayout={(event) => handleItemLayout(anotacao.id, event)}
              item={anotacao}
              todasTarefas={anotacoesDisplay}
              onPress={() => handleMarcarConcluida(anotacao.id)}
              onLongPress={() => handleExcluirAnotacao(anotacao.id)}
              onEdit={() => handleDoublePress(anotacao)}
              onDropAnotacao={(newY) => handleDropAnotacao(anotacao.id, newY)}
              darkMode={darkMode}
            />
          ))}
        </ScrollView>
      )}

      {/* Modal para criar/editar tarefa */}
      <CriarTarefaModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onCriarTarefa={handleEditarTarefa}
        darkMode={darkMode}
        fontSize={fontSize}
        tarefaParaEditar={tarefaParaEditar}
        paineis={paineis}
      />
    </View>
  );
}
