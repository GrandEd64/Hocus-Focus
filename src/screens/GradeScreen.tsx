import React from 'react';
import { View, Text } from 'react-native';

export function GradeScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-blue-500">Notas</Text>
      <Text className="mt-2 text-gray-500">Aqui ficará o gráfico de desempenho.</Text>
    </View>
  );
}
