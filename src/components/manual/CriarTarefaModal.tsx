import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { nomeDoDia, nomeDoMes } from "../../Calendário/NomesDatas";

type CriarTarefaModalProprs = {
    dia?: Date;
    fontSize: number;
    visible: boolean;
    onClose: () => void;
    onCreate: (descricao : string, prioridade?: number) => void;
}

export default function CriarTarefaModal({
    dia,
    visible,
    fontSize,
    onClose,
    onCreate
}: CriarTarefaModalProprs)
{
    const [descricao, setDescricao] = useState('');
    const [prioridade, setPrioridade] = useState(null);

    const getPrioridadeColor = (prio: number) => {
        if (prio >= 3) return 'bg-red-500';
        if (prio >= 2) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getPrioridadeText = (prio: number) => {
        if (prio >= 3) return 'Alta';
        if (prio >= 2) return 'Média';
        return 'Baixa';
    };

    return (
        <Modal
        visible = {visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="rounded-t-3xl p-6 bg-white">
                    {/*Header*/}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="font-bold" style={{fontSize: fontSize + 4}}>
                            Criar tarefa para o dia {dia.getDate()} de {nomeDoMes(dia.getMonth())}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <AntDesign 
                                name="close" 
                                size={24} 
                                color={"#000"} 
                            />
                        </TouchableOpacity>
                    </View>
                    {/* Descrição */}
                    <View className="mb-6">
                        <Text className={'mb-2 font-medium text-black'} style={{ fontSize }}>
                                      Descrição
                                    </Text>
                        <TextInput
                            className={'rounded-lg px-4 py-3 text-black bg-slate-100'}
                            placeholder="Digite a descrição da tarefa..."
                            placeholderTextColor={'#666'}
                            value={descricao}
                            onChangeText={setDescricao}
                            style={{ fontSize }}
                        />
                    </View>
                    {/* Prioridade */}
                    <View className="mb-4">
                        <Text className={`mb-2 font-medium`} style={{ fontSize }}>
                            Prioridade
                        </Text>
                        <View className="flex-row justify-between">
                            {[1, 2, 3].map((prio) => (
                            <TouchableOpacity
                                key={prio}
                                className={`flex-1 mx-1 p-3 rounded-lg border-2 ${
                                prioridade === prio 
                                    ? `${getPrioridadeColor(prio)} border-transparent` 
                                    : 'bg-slate-100 border-slate-300'}
                                }`}
                                onPress={() => setPrioridade(prio)}
                            >
                                <View className="items-center">
                                <View className={`w-3 h-3 rounded-full mb-1 ${getPrioridadeColor(prio)}`} />
                                <Text 
                                    className={prioridade === prio ? 'text-white font-bold' : 'text-black'}
                                    style={{ fontSize: fontSize - 2 }}
                                >
                                    {getPrioridadeText(prio)}
                                </Text>
                                </View>
                            </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    {/* Botões */}
                    <View className="flex-row justify-end space-x-3">
                        <TouchableOpacity
                            className={'px-6 py-3 rounded-lg bg-slate-100'}
                            onPress={onClose}
                        >
                            <Text className={'text-black'} style={{ fontSize }}>
                            Cancelar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="px-6 py-3 rounded-lg bg-blue-600"
                            onPress={() => {onCreate(descricao, prioridade); setDescricao(''); setPrioridade(null);}}
                        >
                            <Text className="text-white font-bold" style={{ fontSize }}>
                                Criar Tarefa
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}