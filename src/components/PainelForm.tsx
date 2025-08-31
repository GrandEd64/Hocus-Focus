import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { PainelEntity } from '../types/entities';

interface PainelFormProps {
  onCriarPainel: (painel: Omit<PainelEntity, 'id'>) => Promise<void>;
  onClose: () => void;
  totalPaineis: number;
}

export function PainelForm({ onCriarPainel, onClose, totalPaineis }: PainelFormProps) {
  const [textoPainel, setTextoPainel] = useState('');

  const handleCriarPainel = async () => {
    if (!textoPainel.trim()) return;

    try {
      await onCriarPainel({
        nome: textoPainel,
        cor: '#4630eb',
        ordem: totalPaineis,
        tipoEstudo: 1
      });
      setTextoPainel('');
      onClose();
      Alert.alert('Sucesso', 'Painel criado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o painel');
    }
  };

  return (
    <View className="bg-gray-50 p-4 rounded-lg mb-4">
      <TextInput
        className="border border-gray-300 rounded-lg h-12 px-4 text-base bg-white mb-3"
        placeholder="Nome do painel..."
        value={textoPainel}
        onChangeText={setTextoPainel}
        autoFocus
      />
      <TouchableOpacity onPress={handleCriarPainel} className="bg-green-600 rounded-lg py-3 px-6 items-center">
        <Text className="text-white text-base font-bold">Criar Painel</Text>
      </TouchableOpacity>
    </View>
  );
}
