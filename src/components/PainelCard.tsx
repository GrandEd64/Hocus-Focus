import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { PainelEntity } from '../types/entities';

interface PainelCardProps {
  painel: PainelEntity;
  selecionado: boolean;
  onPress: () => void;
  onExcluirPainel: () => void;
}

export function PainelCard({ painel, selecionado, onPress, onExcluirPainel }: PainelCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onExcluirPainel}
      className={'rounded-xl p-4 min-w-32 h-20 justify-center items-center shadow-lg'}
      style={selecionado ? {borderColor: painel.cor, backgroundColor: '#f1f5f9', borderWidth: 1} : { backgroundColor: painel.cor || '#4630eb' }}
    >
      <Text className={`${selecionado ? 'text-slate-500' : 'text-white'} text-sm font-bold text-center`}>{painel.nome}</Text>
    </TouchableOpacity>
  );
}
