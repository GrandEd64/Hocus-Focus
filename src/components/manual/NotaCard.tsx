import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

type Nota = {
  id: number;
  nota: number;
  materia: string;
  descricao: string;
  data_criacao: string;
};

type NotaCardProps = {
  notas: Nota[];
  onAddNota?: () => void;
  onNotaPress?: (nota: Nota) => void;
  onNotaLongPress?: (nota: Nota) => void;
  darkMode?: boolean;
  fontSize?: number;
  showAddButton?: boolean;
};

export default function NotaCard({ 
  notas, 
  onAddNota, 
  onNotaPress, 
  onNotaLongPress,
  darkMode = true, 
  fontSize = 16,
  showAddButton = true 
}: NotaCardProps) {
  // Cores baseadas no tema
  const textColor = darkMode ? "text-white" : "text-black";
  const secondaryTextColor = darkMode ? "text-slate-400" : "text-slate-600";
  const cardBg = darkMode ? "bg-neutral-800" : "bg-slate-100";
  const borderColor = darkMode ? "border-neutral-700" : "border-slate-200";

  const getNotaColor = (nota: number) => {
    if (nota >= 9) return "#10b981"; // verde - excelente
    if (nota >= 7) return "#3b82f6"; // azul - bom
    if (nota >= 5) return "#f59e0b"; // amarelo - médio
    return "#ef4444"; // vermelho - ruim
  };

  const getNotaLabel = (nota: number) => {
    if (nota >= 9) return "Excelente";
    if (nota >= 7) return "Bom";
    if (nota >= 5) return "Regular";
    return "Precisa melhorar";
  };

  const calcularMedia = () => {
    if (notas.length === 0) return 0;
    const soma = notas.reduce((acc, nota) => acc + nota.nota, 0);
    return (soma / notas.length).toFixed(1);
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  const renderNota = ({ item }: { item: Nota }) => {
    const notaColor = getNotaColor(item.nota);
    
    return (
      <TouchableOpacity
        className={`flex-row items-center p-3 mb-2 rounded-lg border ${cardBg} ${borderColor}`}
        onPress={() => onNotaPress?.(item)}
        onLongPress={() => onNotaLongPress?.(item)}
        activeOpacity={0.7}
      >
        {/* Nota com cor */}
        <View 
          className="w-12 h-12 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: notaColor }}
        >
          <Text className="text-white font-bold" style={{ fontSize: fontSize + 2 }}>
            {item.nota.toFixed(1)}
          </Text>
        </View>

        {/* Conteúdo da nota */}
        <View className="flex-1">
          <Text className={`font-semibold ${textColor}`} style={{ fontSize }}>
            {item.materia}
          </Text>
          {item.descricao && (
            <Text 
              className={secondaryTextColor} 
              style={{ fontSize: fontSize - 2 }}
              numberOfLines={2}
            >
              {item.descricao}
            </Text>
          )}
          <View className="flex-row items-center mt-1">
            <MaterialIcons 
              name="schedule" 
              size={12} 
              color={darkMode ? "#64748b" : "#94a3b8"} 
            />
            <Text 
              className={secondaryTextColor} 
              style={{ fontSize: fontSize - 4, marginLeft: 4 }}
            >
              {formatarData(item.data_criacao)}
            </Text>
          </View>
        </View>

        {/* Indicador de qualidade */}
        <View className="items-end">
          <View 
            className="px-2 py-1 rounded-full"
            style={{ backgroundColor: notaColor + '20' }}
          >
            <Text 
              style={{ color: notaColor, fontSize: fontSize - 4 }}
              className="font-medium"
            >
              {getNotaLabel(item.nota)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1">
      {/* Header com título e botão de adicionar */}
      <View className="flex-row justify-between items-center mb-4 px-4">
        <View>
          <Text className={`font-bold ${textColor}`} style={{ fontSize: fontSize + 4 }}>
            Notas ({notas.length})
          </Text>
          {notas.length > 0 && (
            <Text className={secondaryTextColor} style={{ fontSize: fontSize - 2 }}>
              Média geral: {calcularMedia()}
            </Text>
          )}
        </View>
        
        {showAddButton && (
          <TouchableOpacity
            onPress={onAddNota}
            className="bg-blue-600 rounded-full w-10 h-10 items-center justify-center"
            activeOpacity={0.8}
          >
            <AntDesign name="plus" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de notas */}
      <View className="flex-1 px-4">
        {notas.length > 0 ? (
          <FlatList
            data={notas}
            keyExtractor={item => String(item.id)}
            renderItem={renderNota}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View className="flex-1 items-center justify-center py-12">
            <MaterialIcons 
              name="school" 
              size={48} 
              color={darkMode ? "#64748b" : "#94a3b8"} 
            />
            <Text 
              className={`mt-2 text-center ${secondaryTextColor}`} 
              style={{ fontSize }}
            >
              Nenhuma nota registrada ainda
            </Text>
            <Text 
              className={`mt-1 text-center ${secondaryTextColor}`} 
              style={{ fontSize: fontSize - 2 }}
            >
              Toque no + para adicionar sua primeira nota
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
