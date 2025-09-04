import React from 'react';
import { View, Text } from 'react-native';

export function ConfigScreen() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl font-bold text-blue-500">Configurações</Text>
      <Text className="mt-2 text-white">Aqui ficarão as opções de configuração.</Text>
    </View>
  );
}
