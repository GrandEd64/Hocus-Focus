import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';

type Tarefa = {
  id: number;
  descricao: string;
  data_vencimento?: string;
  concluido: boolean;
  prioridade: number;
};

type DataCardProps = {
  tarefas: Tarefa[];
  onAddTarefa?: () => void;
  onTarefaPress?: (tarefa: Tarefa) => void;
  darkMode?: boolean;
  fontSize?: number;
};

export default function DataCard({ tarefas, onAddTarefa, onTarefaPress, darkMode = true, fontSize = 16 }: DataCardProps) {
    // Cores baseadas no tema
  const textColor = darkMode ? "text-white" : "text-black";
  const inputBgColor = darkMode ? "bg-neutral-800" : "bg-white";
  const inputBorderColor = darkMode ? "border-gray-600" : "border-gray-300";
  const inputTextColor = darkMode ? "text-white" : "text-black";
  const placeholderColor = darkMode ? "#9ca3af" : "#6b7280";
    const secondaryTextColor = darkMode ? "text-slate-500" : "text-slate-600";    
    const formatarData = (dataString?: string) => {
        if (!dataString) return '';
        const data = new Date(dataString);
        const dia = data.getDate();
        const mes = data.toLocaleDateString('pt-BR', { month: 'short' });
        return { dia, mes };
    };
console.log(tarefas);
    const renderTarefa = ({ item }: { item: Tarefa }) => {
        const dataFormatada = formatarData(item.data_vencimento);
        
        return (
            <TouchableOpacity 
                className="flex items-center flex-row mx-6 mt-4 max-w-96"
                onPress={() => onTarefaPress?.(item)}
            >
                <View className={`p-4 items-center rounded-lg w-20 h-20 ${item.concluido ? 'bg-green-500' : 'bg-blue-400'}`}>
                    {dataFormatada ? (
                        <>
                            <Text className="text-white text-2xl font-bold">{dataFormatada.dia}</Text>
                            <Text className="text-white text-xs">{dataFormatada.mes}</Text>
                        </>
                    ) : (
                        <Text className="text-white text-xs">Sem data</Text>
                    )}
                </View>
                <View className="ml-4 flex-1 rounded-lg">
                    <View className="flex-row justify-between items-start">
                        <Text 
                            className={`flex-1 ${item.concluido ? ' line-through' : textColor}`} 
                            numberOfLines={2}
                            style={{ fontSize: fontSize + 2 }}
                        >
                            {item.descricao}
                        </Text>
                        <TouchableOpacity className="ml-2">
                            <Feather color={darkMode ? "#475569" : "#64748b"} name="more-vertical" size={20} />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row items-center mt-1">
                        <View className={`w-2 h-2 rounded-full mr-2 ${
                            item.prioridade >= 3 ? 'bg-red-500' : 
                            item.prioridade >= 2 ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <Text className={secondaryTextColor} style={{ fontSize: fontSize - 2 }}>
                            {item.prioridade >= 3 ? 'Alta' : item.prioridade >= 2 ? 'Média' : 'Baixa'} prioridade
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View>
            <View className="mt-4 mx-6 flex flex-row justify-between items-center">
                <Text className={textColor} style={{ fontSize: fontSize + 8 }}>
                    Atividades ({tarefas.length})
                </Text>
                <TouchableOpacity onPress={onAddTarefa}>
                    <AntDesign name="plus" size={24} color={darkMode ? "#60a5fa" : "#2563eb"} />
                </TouchableOpacity>
            </View>
            
            {tarefas.length > 0 ? (
                <FlatList
                    data={tarefas}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderTarefa}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View className="flex items-center justify-center mx-6 mt-8 p-8">
                    <Text className={secondaryTextColor} style={{ fontSize }}>
                        Nenhuma tarefa encontrada
                    </Text>
                </View>
            )}
        </View>
    )
}