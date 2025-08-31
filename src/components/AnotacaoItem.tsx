import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { AnotacaoEntity } from '../types/entities';

interface AnotacaoItemProps {
  item: AnotacaoEntity;
  onPress: () => void;
  onLongPress: () => void;
}

export function AnotacaoItem({ item, onPress, onLongPress }: AnotacaoItemProps) {
  const { descricao, concluido } = item;
  
  console.log('🎯 AnotacaoItem renderizando:', item);
  
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={{
        backgroundColor: concluido === 1 ? '#d5f4e6' : '#fff',
        borderColor: concluido === 1 ? '#27ae60' : '#e1e8ed',
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        marginBottom: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      }}
    >
      <Text style={{
        color: concluido === 1 ? '#27ae60' : '#2c3e50',
        fontSize: 16,
        textDecorationLine: concluido === 1 ? 'line-through' : 'none'
      }}>
        {concluido === 1 ? '✅ ' : '⏳ '}{descricao}
      </Text>
    </TouchableOpacity>
  );
}
