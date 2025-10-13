import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { PainelEntity } from '../types/entities';

interface PainelCardProps {
  painel: PainelEntity;
  onPress: () => void;
}

export function PainelCard({ painel, onPress }: PainelCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={'rounded-xl p-4 mr-3 min-w-32 h-20 justify-center items-center shadow-lg'}
      style={{ backgroundColor: painel.cor || '#4630eb' }}
    >
      <Text className="text-white text-sm font-bold text-center">{painel.nome}</Text>
    </TouchableOpacity>
  );
}
