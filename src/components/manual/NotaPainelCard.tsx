import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { PainelNotas } from '../../Painel/PainelNotas';
import { Anotacao } from '../../database/models';
import { AnotacaoEntity, PainelEntity } from '../../types/entities';

type NotaPainelCardProps = {
  paineisNotas: PainelNotas[];
  darkMode?: boolean;
  fontSize?: number;
  onAnotacaoPress? : (anot : AnotacaoEntity) => void;
};

export default function NotaPainelCard({ 
  paineisNotas, 
  darkMode = true, 
  fontSize = 16,
  onAnotacaoPress
}: NotaPainelCardProps) {
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
    if (paineisNotas.length === 0) return 0;
    const paineisComNotas = paineisNotas.flatMap(pn => pn.Anotacoes);
    const soma = paineisComNotas.reduce((acc, anotacao) => acc + anotacao.nota, 0);
    return (soma / paineisComNotas.length).toFixed(1);
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  const renderPainel = ({ item }: { item : PainelNotas;}) => {
    const renderNota = ({item} : {item : AnotacaoEntity;}) => {const notaColor = getNotaColor(item.nota); return(
      <TouchableOpacity
        className={`flex-row items-center p-3 rounded-lg border ${cardBg} ${borderColor}`}
        onPress={() => onAnotacaoPress?.(item)}
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
            {item.descricao}
          </Text>
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
    )};

    const soma = item.Anotacoes.reduce((acc, anot) => acc + anot.nota, 0);
    const mediaPainel = (soma / item.Anotacoes.length).toFixed(1);
    return (

      <View className="mt-2">
        <Text className={`font-semibold ${textColor} mb-2`} style={{ fontSize }}>
          {item.Painel.nome} (média: {mediaPainel})
        </Text>
        <FlatList
          className={`rounded-lg ${cardBg}`}
          style={{ 
            borderLeftWidth: 4, 
            borderLeftColor: item.Painel.cor, 
            gap: 5, 
            paddingTop: 5, 
            paddingBottom: 5,
            paddingRight: 5
          }}
          data={item.Anotacoes}
          keyExtractor={item => String(item.id)}
          renderItem={renderNota}
        />
      </View>
    )
  };

  return (
    <View className="flex-1">
      {/* Header com título e botão de adicionar */}
      <View className="flex-row justify-between items-center mb-4 px-4">
        <View>
          <Text className={`font-bold ${textColor}`} style={{ fontSize: fontSize + 4 }}>
            Notas de paineis ({(paineisNotas.flatMap(a => a.Anotacoes).length)})
          </Text>
          {paineisNotas.length > 0 && (
            <Text className={secondaryTextColor} style={{ fontSize: fontSize - 2 }}>
              Média geral: {calcularMedia()}
            </Text>
          )}
        </View>
      </View>

      {/* Lista de notas */}
      
      <View className="flex-1 px-4">
        {paineisNotas.length > 0 && (
          <FlatList
            data={paineisNotas}
            keyExtractor={item => String(item.Painel.id)}
            renderItem={renderPainel}
            showsVerticalScrollIndicator={false}
            className='rounded-lg'
          />
        )}
      </View>
    </View>
  );
}
