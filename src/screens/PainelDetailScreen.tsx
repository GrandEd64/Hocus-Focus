import React from 'react';
import { View, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type PainelDetailRouteProp = RouteProp<RootStackParamList, 'PainelDetail'>;

type Props = {
  route: PainelDetailRouteProp;
};

const PainelDetailScreen = ({ route }: Props) => {
  const { painelId, painelNome } = route.params;

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg font-bold">Painel: {painelNome}</Text>
      <Text>ID: {painelId}</Text>
    </View>
  );
}

export default PainelDetailScreen;
