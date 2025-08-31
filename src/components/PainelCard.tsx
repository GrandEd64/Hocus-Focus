import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { PainelEntity } from '../types/entities';

interface PainelCardProps {
  painel: PainelEntity;
  isSelected: boolean;
  onPress: () => void;
}

export function PainelCard({ painel, isSelected, onPress }: PainelCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-xl p-4 mr-3 min-w-32 h-20 justify-center items-center shadow-lg ${
        isSelected ? 'border-4 border-orange-400' : ''
      }`}
      style={{ backgroundColor: painel.cor || '#4630eb' }}
    >
      <Text className="text-white text-sm font-bold text-center">{painel.nome}</Text>
    </TouchableOpacity>
  );
}
