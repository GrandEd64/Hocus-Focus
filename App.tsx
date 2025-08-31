import "./global.css"
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useDatabase } from './src/hooks/useDatabase';
import { HomeScreen } from './src/screens';

export default function App() {
  const { isReady, error } = useDatabase();

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <Text className="text-lg text-red-600 text-center mb-2">Erro ao inicializar banco de dados</Text>
        <Text className="text-sm text-gray-600 text-center">{error.message}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4630eb" />
        <Text className="mt-4 text-base text-gray-600">Inicializando Hocus Focus...</Text>
      </View>
    );
  }

  return <HomeScreen />;
}