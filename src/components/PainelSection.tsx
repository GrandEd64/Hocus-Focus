import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { PainelEntity } from '../types/entities';
import { PainelCard } from './PainelCard';
import { PainelForm } from './PainelForm';
import { MaterialIcons } from '@expo/vector-icons';

interface PainelSectionProps {
  paineis: PainelEntity[];
  loading: boolean;
  painelSelecionado: PainelEntity;
  onPainelSelect: (id: number) => void;
  onCriarPainel: (painel: Omit<PainelEntity, 'id'>) => Promise<void>;
  onExcluirPainel: (id: number) => void;
}

export function PainelSection({ 
  paineis, 
  loading,
  painelSelecionado,
  onPainelSelect,
  onCriarPainel,
  onExcluirPainel
}: PainelSectionProps) {
  const [mostrarForm, setMostrarForm] = useState(false);

  const handleExcluirPainel = async (id: number) => {
      Alert.alert(
        'Confirmar Exclusão',
        'Tem certeza que deseja excluir esse painel?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Excluir', 
            style: 'destructive',
            onPress: async () => {
              try {
                await onExcluirPainel(id);
              } catch (error) {
                Alert.alert('Erro', 'Não foi possível excluir a tarefa');
              }
            }
          }
        ]
      );
    };


  return (
    <View className='fixed bottom-0 mb-5'>
      <View className="flex-row justify-between items-center mb-4">
        <View className='flex-row items-end'>
          <Text className="text-xl font-bold text-slate-800">📋 Painéis</Text>
          {painelSelecionado != null && (
            <Text className={'text-xs ml-2'}>(Painel selecionado: "{painelSelecionado.nome}")</Text>
          )}
        </View>
        
        (painelSelecionado && (
        <TouchableOpacity onPress={() => setMostrarForm(!mostrarForm)}
        className="bg-indigo-600 rounded-lg h-12 w-12 justify-center items-center">
          <MaterialIcons name='edit' size={20} color={'white'}/>
        </TouchableOpacity>))
        <TouchableOpacity
          onPress={() => setMostrarForm(!mostrarForm)}
          className="bg-indigo-600 rounded-lg h-12 w-12 justify-center items-center"
        >
          <Text className="text-white text-2xl font-bold">+</Text>
        </TouchableOpacity>
      </View>

      {mostrarForm && (
        <PainelForm
          onCriarPainel={onCriarPainel}
          onClose={() => setMostrarForm(false)}
          totalPaineis={paineis.length}
        />
      )}

      {loading ? (
        <ActivityIndicator size="small" color="#4630eb" />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className='bg-gray-300 rounded-lg p-2 h-56'>
          {paineis.map((painel) => (
            <PainelCard
              key={painel.id}
              painel={painel}
              onPress={() => onPainelSelect(painel.id)}
              onExcluirPainel={() => handleExcluirPainel(painel.id)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
