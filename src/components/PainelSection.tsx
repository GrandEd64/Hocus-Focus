import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { PainelEntity } from '../types/entities';
import { PainelCard } from './PainelCard';
import { PainelForm } from './PainelForm';

interface PainelSectionProps {
  paineis: PainelEntity[];
  loading: boolean;
  onPainelSelect: (id: number) => void;
  onCriarPainel: (painel: Omit<PainelEntity, 'id'>) => Promise<void>;
}

export function PainelSection({ 
  paineis, 
  loading, 
  onPainelSelect, 
  onCriarPainel 
}: PainelSectionProps) {
  const [mostrarForm, setMostrarForm] = useState(false);

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-slate-800">📋 Painéis</Text>
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-32">
          {paineis.map((painel) => (
            <PainelCard
              key={painel.id}
              painel={painel}
              onPress={() => onPainelSelect(painel.id)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
